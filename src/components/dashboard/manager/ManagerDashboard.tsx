
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, AlertCircle, AlertTriangle, CheckCircle, Flag, Award } from "lucide-react";
import KPISection from "./KPISection";
import PriorityDealsSection from "./PriorityDealsSection";
import SignalAnalysisTab from "./tabs/SignalAnalysisTab";
import DealProgressionTab from "./tabs/DealProgressionTab";
import ObjectionResolutionTab from "./tabs/ObjectionResolutionTab";
import ActionCenterTab from "./tabs/ActionCenterTab";
import ObjectionAnalysisTab from "./tabs/ObjectionAnalysisTab";
import { extractResolutionStatus, extractUpsellOpportunities, extractPriorityActions, extractObjectionTypes, extractConfidenceData, extractActionTypes, extractDealStages, processSignalTypeData } from "@/lib/utils";

interface ManagerDashboardProps {
  crmData: any[];
  aeList: string[];
  generateAEPerformanceData: () => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  crmData, 
  aeList,
  generateAEPerformanceData
}) => {
  const [priorityDealsCount, setPriorityDealsCount] = useState(0);
  const [priorityDeals, setPriorityDeals] = useState<any[]>([]);
  const [signalTypeData, setSignalTypeData] = useState<any[]>([]);
  const [dealProgressionData, setDealProgressionData] = useState<any[]>([]);
  const [objectionResolutionData, setObjectionResolutionData] = useState<any[]>([]);
  const [confidenceData, setConfidenceData] = useState<any[]>([]);
  const [actionCenterData, setActionCenterData] = useState<any[]>([]);
  const [dealValueBySignalData, setDealValueBySignalData] = useState<any[]>([]);
  const [objectionTypeData, setObjectionTypeData] = useState<any[]>([]);
  const [priorityActionsData, setPriorityActionsData] = useState<any>({});
  const [upsellOpportunitiesData, setUpsellOpportunitiesData] = useState<any>({});
  const [kpiData, setKpiData] = useState<any>({
    totalDeals: 0,
    totalObjections: 0,
    highPriorityActions: 0,
    successfulUpsells: 0
  });

  React.useEffect(() => {
    // Extract priority deals
    const highPriorityDeals = extractPriorityDeals(crmData);
    setPriorityDeals(highPriorityDeals);
    setPriorityDealsCount(highPriorityDeals.length);

    // Generate AE performance data
    generateAEPerformanceData();
    
    // Generate chart data for Manager/CRO view
    const signalTypeResult = processSignalTypeData(crmData);
    setSignalTypeData(signalTypeResult);
    
    const dealProgressionResult = extractDealStages(crmData);
    setDealProgressionData(dealProgressionResult);
    
    processObjectionResolutionData(crmData);
    
    const confidenceResult = extractConfidenceData(crmData);
    setConfidenceData(confidenceResult);
    
    const actionCenterResult = extractActionTypes(crmData);
    setActionCenterData(actionCenterResult);
    
    processDealValueBySignalData(crmData);
    
    const objectionTypeResult = extractObjectionTypes(crmData);
    setObjectionTypeData(objectionTypeResult);
    
    const priorityActionsResult = extractPriorityActions(crmData);
    setPriorityActionsData(priorityActionsResult);
    
    processUpsellOpportunitiesData(crmData);
    
    calculateKPIs(crmData);
  }, [crmData]);

  // Extract priority deals function
  const extractPriorityDeals = (deals: any[]) => {
    return deals.filter(deal => {
      if (!deal.nba || !deal.actions) return false;

      try {
        // Same priority deals extraction logic from original component
        const nbaData = typeof deal.nba === 'string' ? JSON.parse(deal.nba) : deal.nba;
        
        const actionId = nbaData?.nba_action?.action_reference_id || 
                         nbaData?.action_reference_id || 
                         "";
        
        if (!actionId) return false;
        
        const actionsData = typeof deal.actions === 'string' ? JSON.parse(deal.actions) : deal.actions;
        
        let actionsList = Array.isArray(actionsData) ? actionsData : 
                         (actionsData.actions && Array.isArray(actionsData.actions) ? actionsData.actions : []);
                         
        const matchedAction = actionsList.find((action: any) => 
          action.signal_reference_id === actionId || 
          action.action_reference_id === actionId
        );
        
        return matchedAction && 
               matchedAction.priority && 
               matchedAction.priority.toLowerCase() === "high";
      } catch (e) {
        console.error("Error parsing deal data:", e);
        return false;
      }
    });
  };

  // Calculate top-level KPIs
  const calculateKPIs = (deals: any[]) => {
    // Total deals
    const totalDeals = deals.length;
    
    // Get objection resolution counts
    const resolutionCounts = deals.reduce((acc, deal) => {
      const currentCounts = extractResolutionStatus([deal]);
      return {
        resolved: acc.resolved + currentCounts.resolved,
        partiallyResolved: acc.partiallyResolved + currentCounts.partiallyResolved,
        inProgress: acc.inProgress + currentCounts.inProgress,
        notResolved: acc.notResolved + currentCounts.notResolved
      };
    }, { resolved: 0, partiallyResolved: 0, inProgress: 0, notResolved: 0 });
    
    const totalObjections = resolutionCounts.resolved + resolutionCounts.partiallyResolved + 
                            resolutionCounts.inProgress + resolutionCounts.notResolved;
    
    // High priority actions
    const priorityActions = extractPriorityActions(deals);
    
    // Successful upsells
    const upsellOps = deals.reduce((acc, deal) => {
      const currentUpsells = extractUpsellOpportunities([deal]);
      return {
        total: acc.total + currentUpsells.total,
        high: acc.high + currentUpsells.high,
      };
    }, { total: 0, high: 0 });
    
    setKpiData({
      totalDeals,
      totalObjections,
      highPriorityActions: priorityActions.high,
      successfulUpsells: upsellOps.high
    });
  };

  // Process objection resolution data
  const processObjectionResolutionData = (deals: any[]) => {
    // Aggregate all the objection resolution data
    const totalResolutionStatus = deals.reduce((acc, deal) => {
      const currentCounts = extractResolutionStatus([deal]);
      return {
        resolved: acc.resolved + currentCounts.resolved,
        partiallyResolved: acc.partiallyResolved + currentCounts.partiallyResolved,
        inProgress: acc.inProgress + currentCounts.inProgress,
        notResolved: acc.notResolved + currentCounts.notResolved
      };
    }, { resolved: 0, partiallyResolved: 0, inProgress: 0, notResolved: 0 });
    
    // Format for chart
    const chartData = [
      { name: "Resolved", value: totalResolutionStatus.resolved },
      { name: "Partially Resolved", value: totalResolutionStatus.partiallyResolved },
      { name: "In Progress", value: totalResolutionStatus.inProgress },
      { name: "Not Resolved", value: totalResolutionStatus.notResolved }
    ];
    
    setObjectionResolutionData(chartData);
  };

  // Process deal value by signal type
  const processDealValueBySignalData = (deals: any[]) => {
    const dealValueBySignal: any[] = [];
    
    deals.forEach(deal => {
      try {
        const dealAmount = parseFloat(deal.deal_amount) || 0;
        const dealName = deal.deal_name || 'Unknown Deal';
        
        const signalsData = typeof deal.signals === 'string' ? JSON.parse(deal.signals) : deal.signals;
        let signalType = 'Unknown';
        
        // Check if it's an object with a 'signals' array inside
        if (signalsData?.signals && Array.isArray(signalsData.signals) && signalsData.signals.length > 0) {
          signalType = signalsData.signals[0]?.signal_type || 'Unknown';
        }
        // Check if it's a direct array of signals
        else if (Array.isArray(signalsData) && signalsData.length > 0) {
          signalType = signalsData[0]?.signal_type || 'Unknown';
        }
        // Direct single signal
        else if (signalsData && typeof signalsData === 'object') {
          signalType = signalsData.signal_type || 'Unknown';
        }
        
        dealValueBySignal.push({
          name: dealName,
          signalType,
          value: dealAmount,
          x: Math.random() * 100, // For scatter plot X position
          y: dealAmount / 1000     // Scale down for Y position
        });
      } catch (e) {
        console.error("Error processing deal value data:", e);
      }
    });
    
    setDealValueBySignalData(dealValueBySignal);
  };

  // Process upsell opportunities data
  const processUpsellOpportunitiesData = (deals: any[]) => {
    const upsellOps = deals.reduce((acc, deal) => {
      const currentUpsells = extractUpsellOpportunities([deal]);
      return {
        total: acc.total + currentUpsells.total,
        high: acc.high + currentUpsells.high,
        medium: acc.medium + currentUpsells.medium,
        low: acc.low + currentUpsells.low
      };
    }, { total: 0, high: 0, medium: 0, low: 0 });
    
    setUpsellOpportunitiesData(upsellOps);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Total Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{crmData.length}</div>
            <p className="text-xs text-purple-600 mt-1">Across all account executives</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Active AEs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{aeList.length}</div>
            <p className="text-xs text-blue-600 mt-1">Team members with assigned deals</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-white hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              Priority Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{priorityDealsCount}</div>
            <p className="text-xs text-amber-600 mt-1">Requiring immediate attention</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Priority Deals Section */}
      {priorityDeals.length > 0 && (
        <PriorityDealsSection priorityDeals={priorityDeals} />
      )}

      {/* KPI Section */}
      <KPISection kpiData={kpiData} />
      
      {/* Tabs Section */}
      <Tabs defaultValue="signal-analysis" className="w-full mt-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="signal-analysis">Signal Analysis</TabsTrigger>
          <TabsTrigger value="deal-progression">Deal Progression</TabsTrigger>
          <TabsTrigger value="objection-resolution">Objection Resolution</TabsTrigger>
          <TabsTrigger value="action-center">Action Center</TabsTrigger>
          <TabsTrigger value="objection-analysis">Objection Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signal-analysis" className="space-y-6 mt-4">
          <SignalAnalysisTab 
            signalTypeData={signalTypeData} 
            objectionTypeData={objectionTypeData}
            confidenceData={confidenceData}
            dealValueBySignalData={dealValueBySignalData}
          />
        </TabsContent>
        
        <TabsContent value="deal-progression" className="space-y-6 mt-4">
          <DealProgressionTab dealProgressionData={dealProgressionData} />
        </TabsContent>
        
        <TabsContent value="objection-resolution" className="space-y-6 mt-4">
          <ObjectionResolutionTab 
            objectionResolutionData={objectionResolutionData}
            upsellOpportunitiesData={upsellOpportunitiesData}
          />
        </TabsContent>
        
        <TabsContent value="action-center" className="space-y-6 mt-4">
          <ActionCenterTab 
            actionCenterData={actionCenterData}
            priorityActionsData={priorityActionsData}
          />
        </TabsContent>
        
        <TabsContent value="objection-analysis" className="space-y-6 mt-4">
          <ObjectionAnalysisTab crmData={crmData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ManagerDashboard;
