import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DealTable from "@/components/dashboard/DealTable";
import AEInsights from "@/components/dashboard/AEInsights";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { safeJsonParse } from "@/lib/utils";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, 
  ScatterChart, Scatter,
  RadialBarChart, RadialBar,
  Treemap
} from "recharts";
import { 
  AlertCircle, AlertTriangle, CheckCircle, HelpCircle, 
  TrendingUp, ChartBar, Info, ChartPie, Award, Flag,
  ArrowDown, ArrowUp, Filter, ChevronDown, ChevronUp, 
  BarChart2, Search, ListCheck
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { 
  extractResolutionStatus, extractUpsellOpportunities, 
  extractPriorityActions, extractObjectionTypes, extractConfidenceData,
  extractActionTypes, extractDealStages, processSignalTypeData
} from "@/lib/utils";

interface AEDashboardProps {
  crmData: any[];
  aeList: string[];
  selectedAE: string;
  setSelectedAE: (ae: string) => void;
}

const AEDashboard: React.FC<AEDashboardProps> = ({ 
  crmData, 
  aeList, 
  selectedAE, 
  setSelectedAE 
}) => {
  const [filteredDeals, setFilteredDeals] = useState<any[]>([]);
  const [dealStages, setDealStages] = useState<string[]>([]);
  const [dealsByStage, setDealsByStage] = useState<Record<string, number>>({});
  const [tabView, setTabView] = useState("ae");
  const [aePerformanceData, setAePerformanceData] = useState<any[]>([]);
  const [priorityDealsCount, setPriorityDealsCount] = useState(0);
  const [priorityDeals, setPriorityDeals] = useState<any[]>([]);
  const [dashboardTab, setDashboardTab] = useState("playbook");
  const [managerTab, setManagerTab] = useState("signal-analysis");
  const [showCompleteAEList, setShowCompleteAEList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "totalDeals", direction: "desc" });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // New state for Manager/CRO charts
  const [signalTypeData, setSignalTypeData] = useState<any[]>([]);
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

  // Colors for charts (same as in AEInsights)
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8E9196'];
  const CONFIDENCE_COLORS = {
    high: '#10B981',
    medium: '#F97316',
    low: '#EF4444'
  };

  useEffect(() => {
    // Fixed filter logic: show all deals when selectedAE is "all"
    const deals = selectedAE === "all" 
      ? crmData
      : crmData.filter(deal => deal.owner === selectedAE);
    
    setFilteredDeals(deals);
    
    // Extract unique deal stages
    const stages = [...new Set(crmData.map(deal => deal.deal_stage))].filter(Boolean) as string[];
    setDealStages(stages);
    
    // Count deals by stage for the selected AE
    const stageCount: Record<string, number> = {};
    deals.forEach(deal => {
      const stage = deal.deal_stage || "Unknown";
      stageCount[stage] = (stageCount[stage] || 0) + 1;
    });
    setDealsByStage(stageCount);

    // Find priority deals - use same logic for both AE and Manager views
    const highPriorityDeals = crmData.filter(deal => {
      if (!deal.nba || !deal.actions) return false;

      try {
        // Parse NBA data
        const nbaData = safeJsonParse(deal.nba, {});
        
        // Extract action_reference_id from NBA
        const actionId = nbaData?.nba_action?.action_reference_id || 
                         nbaData?.action_reference_id || 
                         "";
        
        if (!actionId) return false;
        
        // Parse actions to find the referenced action
        const actionsData = safeJsonParse(deal.actions, []);
        
        // Check if actions is an array or an object with actions array
        let actionsList = Array.isArray(actionsData) ? actionsData : 
                         (actionsData.actions && Array.isArray(actionsData.actions) ? actionsData.actions : []);
                         
        // Find the specific action by ID
        const matchedAction = actionsList.find((action: any) => 
          action.signal_reference_id === actionId || 
          action.action_reference_id === actionId
        );
        
        // Check if the action has high priority
        return matchedAction && 
               matchedAction.priority && 
               matchedAction.priority.toLowerCase() === "high";
      } catch (e) {
        console.error("Error parsing deal data:", e);
        return false;
      }
    });
    
    setPriorityDeals(highPriorityDeals);
    setPriorityDealsCount(highPriorityDeals.length);

    // Generate AE performance data for the CRO view
    if (tabView === "manager") {
      generateAEPerformanceData();
      
      // Generate chart data for Manager/CRO view (when in manager view)
      // Process signal type distribution data
      const signalTypeResult = processSignalTypeData(crmData);
      setSignalTypeData(signalTypeResult);
      
      // Process objection resolution data
      processObjectionResolutionData(crmData);
      
      // Process signal confidence data
      const confidenceResult = extractConfidenceData(crmData);
      setConfidenceData(confidenceResult);
      
      // Process action center data
      const actionCenterResult = extractActionTypes(crmData);
      setActionCenterData(actionCenterResult);
      
      // Process deal value by signal type data
      processDealValueBySignalData(crmData);
      
      // Process objection type data
      const objectionTypeResult = extractObjectionTypes(crmData);
      setObjectionTypeData(objectionTypeResult);
      
      // Process priority actions data
      const priorityActionsResult = extractPriorityActions(crmData);
      setPriorityActionsData(priorityActionsResult);
      
      // Process upsell opportunities data
      processUpsellOpportunitiesData(crmData);
      
      // Calculate KPIs
      calculateKPIs(crmData);
    }
  }, [selectedAE, crmData, tabView]);

  // Calculate top-level KPIs (same as in AEInsights)
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

  // Process objection resolution data (same as in AEInsights)
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

  // Process deal value by signal type (same as in AEInsights)
  const processDealValueBySignalData = (deals: any[]) => {
    const dealValueBySignal: any[] = [];
    
    deals.forEach(deal => {
      try {
        const dealAmount = parseFloat(deal.deal_amount) || 0;
        const dealName = deal.deal_name || 'Unknown Deal';
        
        const signalsData = safeJsonParse(deal.signals);
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

  // Process upsell opportunities data (same as in AEInsights)
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

  // Original generateAEPerformanceData function
  const generateAEPerformanceData = () => {
    const aeData: any[] = [];
    
    // Process data for each AE
    aeList.forEach(ae => {
      const aeDeals = crmData.filter(deal => deal.owner === ae);
      
      // Initialize counters
      let resolvedObjections = 0;
      let partiallyResolvedObjections = 0;
      let totalObjections = 0;
      
      // Deal stage counts
      let discoveryCount = 0;
      let implementationCount = 0;
      let qualificationCount = 0;
      
      // Upsell metrics
      let upsellOpportunities = 0;
      let successfulUpsells = 0;

      // Process each deal for the current AE
      aeDeals.forEach(deal => {
        // Count deals by stage
        if (deal.deal_stage) {
          const stage = deal.deal_stage.toLowerCase();
          if (stage.includes('discovery')) discoveryCount++;
          if (stage.includes('implementation')) implementationCount++;
          if (stage.includes('qualification')) qualificationCount++;
        }

        // Process signals data for objection resolution status and upsell opportunities - IMPROVED VERSION
        let signalsData = deal.signals;
        if (signalsData) {
          const parsedSignals = safeJsonParse(signalsData, {});
          
          // Check if it's an object with a 'signals' array inside
          if (parsedSignals?.signals && Array.isArray(parsedSignals.signals)) {
            parsedSignals.signals.forEach((s: any) => {
              // Check for objection_analysis with resolution_status
              if (s?.objection_analysis?.resolution_status) {
                totalObjections++;
                const status = s.objection_analysis.resolution_status.toLowerCase();
                if (status.includes('resolved') && !status.includes('partially')) {
                  resolvedObjections++;
                } else if (status.includes('partially')) {
                  partiallyResolvedObjections++;
                }
              }
              
              // Check for upsell opportunities with customer_receptiveness
              if (s?.customer_receptiveness) {
                upsellOpportunities++;
                // Count as successful upsell if customer_receptiveness is "High"
                if (s.customer_receptiveness === "High") {
                  successfulUpsells++;
                }
              }
            });
          }
          // Check if it's a direct array of signals
          else if (Array.isArray(parsedSignals)) {
            parsedSignals.forEach((s: any) => {
              if (s?.objection_analysis?.resolution_status) {
                totalObjections++;
                const status = s.objection_analysis.resolution_status.toLowerCase();
                if (status.includes('resolved') && !status.includes('partially')) {
                  resolvedObjections++;
                } else if (status.includes('partially')) {
                  partiallyResolvedObjections++;
                }
              }
              
              // Check for upsell opportunities with customer_receptiveness
              if (s?.customer_receptiveness) {
                upsellOpportunities++;
                // Count as successful upsell if customer_receptiveness is "High"
                if (s.customer_receptiveness === "High") {
                  successfulUpsells++;
                }
              }
            });
          }
          // Direct single signal with objection_analysis and resolution_status
          else if (parsedSignals?.objection_analysis?.resolution_status) {
            totalObjections++;
            const status = parsedSignals.objection_analysis.resolution_status.toLowerCase();
            if (status.includes('resolved') && !status.includes('partially')) {
              resolvedObjections++;
            } else if (status.includes('partially')) {
              partiallyResolvedObjections++;
            }
            
            // Check for upsell opportunities with customer_receptiveness
            if (parsedSignals?.customer_receptiveness) {
              upsellOpportunities++;
              // Count as successful upsell if customer_receptiveness is "High"
              if (parsedSignals.customer_receptiveness === "High") {
                successfulUpsells++;
              }
            }
          }
        }

        // Process actions data for upsell opportunities - This original section is kept 
        // but now we prioritize the signal's customer_receptiveness field
        let actionsData = deal.actions;
        if (actionsData) {
          const parsedActions = safeJsonParse(actionsData, {});
          
          // If it's an array or object, look for upsell data
          if (Array.isArray(parsedActions)) {
            parsedActions.forEach((action: any) => {
              if (action && typeof action === 'object' && action.type && 
                  action.type.toLowerCase().includes('upsell')) {
                // Only increment if we didn't already count from signals data
                if (upsellOpportunities === 0) {
                  upsellOpportunities++;
                  if (action.status && action.status.toLowerCase().includes('successful')) {
                    successfulUpsells++;
                  }
                }
              }
            });
          } else if (typeof parsedActions === 'object' && parsedActions !== null) {
            if (parsedActions.type && parsedActions.type.toLowerCase().includes('upsell')) {
              // Only increment if we didn't already count from signals data
              if (upsellOpportunities === 0) {
                upsellOpportunities++;
                if (parsedActions.status && parsedActions.status.toLowerCase().includes('successful')) {
                  successfulUpsells++;
                }
              }
            }
            
            // Also check actions array inside actions object
            if (parsedActions.actions && Array.isArray(parsedActions.actions)) {
              parsedActions.actions.forEach((action: any) => {
                if (action && typeof action === 'object' && 
                    action.action_type && action.action_type.toLowerCase().includes('upsell')) {
                  // Only increment if we didn't already count from signals data
                  if (upsellOpportunities === 0) {
                    upsellOpportunities++;
                    if (action.status && action.status.toLowerCase().includes('successful')) {
                      successfulUpsells++;
                    }
                  }
                }
              });
            }
          }
        }
        
        // Also check NBA data for upsell signals
        let nbaData = deal.nba;
        if (nbaData) {
          const parsedNba = safeJsonParse(nbaData, {});
          if (parsedNba?.nba_action?.action_type && 
              parsedNba.nba_action.action_type.toLowerCase().includes('upsell')) {
            // Only increment if we didn't already count from signals or actions data
            if (upsellOpportunities === 0) {
              upsellOpportunities++;
              if (parsedNba.nba_action.status && 
                  parsedNba.nba_action.status.toLowerCase().includes('successful')) {
                successfulUpsells++;
              }
            }
          }
        }
      });

      // Calculate success rates
      const objectionResolutionRate = totalObjections > 0 ? 
        ((resolvedObjections + (partiallyResolvedObjections * 0.5)) / totalObjections * 100).toFixed(1) : "0";
        
      const upsellSuccessRate = upsellOpportunities > 0 ?
        ((successfulUpsells / upsellOpportunities) * 100).toFixed(1) : "0";

      // Add AE data to the array
      aeData.push({
        name: ae,
        totalDeals: aeDeals.length,
        resolvedObjections,
        partiallyResolvedObjections,
        totalObjections,
        objectionResolutionRate,
        discoveryCount,
        implementationCount,
        qualificationCount,
        upsellOpportunities,
        successfulUpsells,
        upsellSuccessRate
      });
    });
    
    setAePerformanceData(aeData);
    console.log("Updated AE performance data:", aeData);
  };

  // Sort function for AE performance data
  const sortedAEData = React.useMemo(() => {
    let sortableData = [...aePerformanceData];
    
    // Filter by search term if present
    if (searchTerm) {
      sortableData = sortableData.filter(ae => 
        ae.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort data based on current sort config
    return sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [aePerformanceData, sortConfig, searchTerm]);

  // Handle sorting when column header is clicked
  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (columnName: string) => {
    if (sortConfig.key !== columnName) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 inline ml-1" /> 
      : <ArrowDown className="h-4 w-4 inline ml-1" />;
  };

  // Toggle card expanded state
  const toggleCardExpanded = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {tabView === "ae" ? "Account Executive Portal" : "Manager / CRO Dashboard"}
        </h2>
        
        <Tabs 
          value={tabView} 
          onValueChange={setTabView}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ae">AE View</TabsTrigger>
            <TabsTrigger value="manager">Manager/CRO View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tabView === "ae" && (
        <DealTable deals={filteredDeals} />
      )}
      
      {tabView === "manager" && (
        <>
          {/* CRO Dashboard Content - Enhanced UI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-purple-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('totalDeals')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-800 flex justify-between items-center">
                  <span>Total Deals</span>
                  {expandedCard === 'totalDeals' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{crmData.length}</div>
                <p className="text-xs text-purple-600 mt-1">Across all account executives</p>
                
                <Collapsible open={expandedCard === 'totalDeals'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Average Deal Value:</span> ${Math.round(crmData.reduce((sum, deal) => sum + (parseFloat(deal.deal_amount) || 0), 0) / crmData.length).toLocaleString()}</p>
                      <p><span className="font-medium">Largest Deal:</span> ${Math.max(...crmData.map(deal => parseFloat(deal.deal_amount) || 0)).toLocaleString()}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('activeAEs')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800 flex justify-between items-center">
                  <span>Active AEs</span>
                  {expandedCard === 'activeAEs' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{aeList.length}</div>
                <p className="text-xs text-blue-600 mt-1">Team members with assigned deals</p>
                
                <Collapsible open={expandedCard === 'activeAEs'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Average Deals per AE:</span> {Math.round(crmData.length / aeList.length)}</p>
                      <p><span className="font-medium">Top Performer:</span> {sortedAEData[0]?.name || 'N/A'}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('priorityDeals')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-800 flex justify-between items-center">
                  <span>Priority Deals</span>
                  {expandedCard === 'priorityDeals' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900">{priorityDealsCount}</div>
                <p className="text-xs text-amber-600 mt-1">Requiring immediate attention</p>
                
                <Collapsible open={expandedCard === 'priorityDeals'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Value at Risk:</span> ${priorityDeals.reduce((sum, deal) => sum + (parseFloat(deal.deal_amount) || 0), 0).toLocaleString()}</p>
                      <p><span className="font-medium">Most Affected AE:</span> {
                        Object.entries(priorityDeals.reduce((acc: Record<string, number>, deal) => {
                          acc[deal.owner] = (acc[deal.owner] || 0) + 1;
                          return acc;
                        }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
                      }</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('upsellOps')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 flex justify-between items-center">
                  <span>Upsell Opportunities</span>
                  {expandedCard === 'upsellOps' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{upsellOpportunitiesData.total || 0}</div>
                <p className="text-xs text-green-600 mt-1">Potential additional revenue</p>
                
                <Collapsible open={expandedCard === 'upsellOps'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">High Confidence:</span> {upsellOpportunitiesData.high || 0}</p>
                      <p><span className="font-medium">Success Rate:</span> {
                        upsellOpportunitiesData.total ? 
                          Math.round((upsellOpportunitiesData.high / upsellOpportunitiesData.total) * 100) : 
                          0
                      }%</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
          
          {/* Priority Deals Section - Enhanced UI */}
          {priorityDeals.length > 0 && (
            <Card className="mb-6 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-amber-800">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    <span>High Priority Deals</span>
                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-300">
                      {priorityDeals.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-amber-700 mt-1">
                    These deals require immediate attention from their respective AEs
                  </CardDescription>
                </div>
                <Button variant="outline" className="bg-white border-amber-200 text-amber-800 hover:bg-amber-100">
                  <ListCheck className="h-4 w-4 mr-2" />
                  Assign Tasks
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-amber-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-amber-50/80">
                        <TableHead className="font-medium">Company</TableHead>
                        <TableHead className="font-medium">Deal Name</TableHead>
                        <TableHead className="font-medium">Stage</TableHead>
                        <TableHead className="font-medium text-right">Amount</TableHead>
                        <TableHead className="font-medium">Owner</TableHead>
                        <TableHead className="font-medium text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priorityDeals.map((deal, i) => (
                        <TableRow key={`priority-${i}`} className="hover:bg-amber-50/60">
                          <TableCell className="font-medium">{deal.company_name}</TableCell>
                          <TableCell>{deal.deal_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-white">
                              {deal.deal_stage}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ${deal.deal_amount?.toLocaleString()}
                          </TableCell>
                          <TableCell>{deal.owner}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPI Section - Enhanced UI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Total Deals</span>
                  </div>
                  <p className="text-3xl font-bold">{kpiData.totalDeals}</p>
                  <p className="text-xs text-muted-foreground mt-1">across all pipeline stages</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Total Objections</span>
                  </div>
                  <p className="text-3xl font-bold">{kpiData.totalObjections}</p>
                  <p className="text-xs text-muted-foreground mt-1">requiring resolution</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="h-5 w-5 text-rose-500" />
                    <span className="font-medium">High Priority</span>
                  </div>
                  <p className="text-3xl font-bold">{kpiData.highPriorityActions}</p>
                  <p className="text-xs text-muted-foreground mt-1">urgent actions required</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Successful Upsells</span>
                  </div>
                  <p className="text-3xl font-bold">{kpiData.successfulUpsells}</p>
                  <p className="text-xs text-muted-foreground mt-1">high receptiveness opportunities</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Table Sections with Search and Sort */}
          <div className="space-y-6 mb-6">
            {/* Interactive Search and Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Team Performance</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {aeList.length} AEs
                </Badge>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by AE name" 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setShowCompleteAEList(!showCompleteAEList)}
                >
                  <Filter className="h-4 w-4" />
                  {showCompleteAEList ? "Show Top Performers" : "Show All AEs"}
                </Button>
              </div>
            </div>
            
            {/* Objection Resolution Performance - Interactive Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Objection Resolution Performance
                </CardTitle>
                <CardDescription>
                  Track how effectively each AE addresses customer objections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead 
                          className="w-[180px] cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('name')}
                        >
                          Account Executive
                          {getSortDirectionIndicator('name')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('resolvedObjections')}
                        >
                          Resolved
                          {getSortDirectionIndicator('resolvedObjections')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('partiallyResolvedObjections')}
                        >
                          Partially Resolved
                          {getSortDirectionIndicator('partiallyResolvedObjections')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('totalObjections')}
                        >
                          Total Objections
                          {getSortDirectionIndicator('totalObjections')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('objectionResolutionRate')}
                        >
                          Resolution Rate
                          {getSortDirectionIndicator('objectionResolutionRate')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(showCompleteAEList ? sortedAEData : sortedAEData.slice(0, 5)).map((ae) => (
                        <TableRow key={ae.name} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{ae.name}</TableCell>
                          <TableCell className="text-right">{ae.resolvedObjections}</TableCell>
                          <TableCell className="text-right">{ae.partiallyResolvedObjections}</TableCell>
                          <TableCell className="text-right">{ae.totalObjections}</TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={Number(ae.objectionResolutionRate) > 70 ? "default" : 
                                     Number(ae.objectionResolutionRate) > 40 ? "outline" : "destructive"}
                            >
                              {ae.objectionResolutionRate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {!showCompleteAEList && sortedAEData.length > 5 && (
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowCompleteAEList(true)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Show All {sortedAEData.length} AEs
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deal Stage Distribution - Enhanced Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-600" />
                  Deal Stage Distribution by AE
                </CardTitle>
                <CardDescription>
                  View the current pipeline distribution across team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead 
                          className="w-[180px] cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('name')}
                        >
                          Account Executive
                          {getSortDirectionIndicator('name')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('totalDeals')}
                        >
                          Total Deals
                          {getSortDirectionIndicator('totalDeals')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('discoveryCount')}
                        >
                          Discovery
                          {getSortDirectionIndicator('discoveryCount')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('qualificationCount')}
                        >
                          Qualification
                          {getSortDirectionIndicator('qualificationCount')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('implementationCount')}
                        >
                          Implementation
                          {getSortDirectionIndicator('implementationCount')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(showCompleteAEList ? sortedAEData : sortedAEData.slice(0, 5)).map((ae) => (
                        <TableRow key={`stage-${ae.name}`} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{ae.name}</TableCell>
                          <TableCell className="text-right font-semibold">{ae.totalDeals}</TableCell>
                          <TableCell className="text-right">{ae.discoveryCount}</TableCell>
                          <TableCell className="text-right">{ae.qualificationCount}</TableCell>
                          <TableCell className="text-right">{ae.implementationCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Upsell Performance - Enhanced Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Upsell Performance by AE
                </CardTitle>
                <CardDescription>
                  Track additional revenue opportunities identified by your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead 
                          className="w-[180px] cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('name')}
                        >
                          Account Executive
                          {getSortDirectionIndicator('name')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('upsellOpportunities')}
                        >
                          Opportunities
                          {getSortDirectionIndicator('upsellOpportunities')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('successfulUpsells')}
                        >
                          Successful
                          {getSortDirectionIndicator('successfulUpsells')}
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer hover:bg-muted/70"
                          onClick={() => requestSort('upsellSuccessRate')}
                        >
                          Success Rate
                          {getSortDirectionIndicator('upsellSuccessRate')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(showCompleteAEList ? sortedAEData : sortedAEData.slice(0, 5)).map((ae) => (
                        <TableRow key={`upsell-${ae.name}`} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{ae.name}</TableCell>
                          <TableCell className="text-right">{ae.upsellOpportunities}</TableCell>
                          <TableCell className="text-right">{ae.successfulUpsells}</TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={Number(ae.upsellSuccessRate) > 70 ? "default" : 
                                     Number(ae.upsellSuccessRate) > 40 ? "outline" : "destructive"}
                            >
                              {ae.upsellSuccessRate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Charts Section with Tabs */}
          <Tabs 
            value={managerTab} 
            onValueChange={setManagerTab} 
            className="w-full mt-6"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Performance Analytics</h3>
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
                <TabsTrigger value="signal-analysis" className="gap-2">
                  <ChartPie className="h-4 w-4" />
                  Signal Analysis
                </TabsTrigger>
                <TabsTrigger value="objection-resolution" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Objection Resolution
                </TabsTrigger>
                <TabsTrigger value="action-center" className="gap-2">
                  <Flag className="h-4 w-4" />
                  Action Center
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Signal Analysis Tab - Enhanced UI */}
            <TabsContent value="signal-analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Signal Type Distribution */}
                <Card className="col-span-1 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartPie className="h-5 w-5 text-purple-600" />
                      Signal Type Distribution
                    </CardTitle>
                    <CardDescription>
                      Breakdown of different signal types in your deals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={signalTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {signalTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [value, 'Count']} />
                        <Legend layout="vertical" align="right" verticalAlign="middle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Objection Types Distribution */}
                <Card className="col-span-1 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-rose-500" />
                      Objection Types
                    </CardTitle>
                    <CardDescription>
                      Common objections raised across all deals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={objectionTypeData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={100}
                          tick={{ fontSize: 12 }} 
                        />
                        <Tooltip formatter={(value: number) => [value, 'Count']} />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill="#D946EF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Signal Confidence Gauge */}
                <Card className="col-span-1 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      Signal Confidence Distribution
                    </CardTitle>
                    <CardDescription>
                      Reliability levels of detected signals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        innerRadius={20} 
                        outerRadius={140} 
                        barSize={10} 
                        data={confidenceData}
                      >
                        <RadialBar
                          background
                          dataKey="value"
                          label={{ position: 'insideStart', fill: '#fff' }}
                          cornerRadius={5}
                        />
                        <Legend 
                          iconSize={10} 
                          layout="vertical" 
                          verticalAlign="middle" 
                          wrapperStyle={{ lineHeight: '40px' }} 
                        />
                        <Tooltip formatter={(value: number) => [value, 'Count']} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Deal Value by Signal Heat Map (Simplified as Scatter) */}
                <Card className="col-span-1 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Deal Value by Signal Type
                    </CardTitle>
                    <CardDescription>
                      Correlation between signal types and deal values
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="Index" unit="" />
                        <YAxis type="number" dataKey="y" name="Deal Amount" unit="K" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }} 
                          formatter={(value: number, name: string, props: any) => {
                            if (name === 'Deal Amount') return [`$${value * 1000}`, name];
                            return [value, name];
                          }} 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-2 border rounded shadow-sm">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p>Signal: {payload[0].payload.signalType}</p>
                                  <p>Amount: ${payload[0].payload.value.toLocaleString()}</p>
                                </div>
                              );
                            }
                            return null;
                          }} 
                        />
                        <Scatter name="Deal Values" data={dealValueBySignalData} fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Objection Resolution Tab - Enhanced UI */}
            <TabsContent value="objection-resolution" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Objection Resolution Status */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Objection Resolution Tracking
                    </CardTitle>
                    <CardDescription>
                      Current status of all customer objections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="h-80 md:col-span-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={objectionResolutionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {objectionResolutionData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={
                                    entry.name === "Resolved" ? "#10B981" : 
                                    entry.name === "Partially Resolved" ? "#F97316" :
                                    entry.name === "In Progress" ? "#0EA5E9" : 
                                    "#EF4444"
                                  } 
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [value, 'Count']} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="md:col-span-2">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="resolved-objections">
                            <AccordionTrigger className="hover:bg-green-50 px-4 rounded-md">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-500">Resolved</Badge>
                                <span className="font-medium">
                                  {objectionResolutionData.find(d => d.name === "Resolved")?.value || 0} Objections
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                              <p className="text-muted-foreground text-sm">
                                These objections have been successfully addressed with customers. 
                                Common resolution strategies include product demonstrations, 
                                pricing adjustments, and feature explanations.
                              </p>
                              <div className="mt-4">
                                <Button variant="outline" size="sm" className="text-green-700 border-green-200 bg-green-50">
                                  View Resolution Strategies
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="partial-objections">
                            <AccordionTrigger className="hover:bg-amber-50 px-4 rounded-md">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-amber-500">Partially Resolved</Badge>
                                <span className="font-medium">
                                  {objectionResolutionData.find(d => d.name === "Partially Resolved")?.value || 0} Objections
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                              <p className="text-muted-foreground text-sm">
                                These objections have been partially addressed but may require 
                                follow-up actions to fully resolve. Common next steps include 
                                additional documentation, feature requests, or stakeholder meetings.
                              </p>
                              <div className="mt-4">
                                <Button variant="outline" size="sm" className="text-amber-700 border-amber-200 bg-amber-50">
                                  View Next Steps
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="inprogress-objections">
                            <AccordionTrigger className="hover:bg-blue-50 px-4 rounded-md">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500">In Progress</Badge>
                                <span className="font-medium">
                                  {objectionResolutionData.find(d => d.name === "In Progress")?.value || 0} Objections
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                              <p className="text-muted-foreground text-sm">
                                These objections are actively being worked on by the team. 
                                Current efforts include customer calls, internal discussions, 
                                and solution development.
                              </p>
                              <div className="mt-4">
                                <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 bg-blue-50">
                                  View Action Items
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="unresolved-objections">
                            <AccordionTrigger className="hover:bg-red-50 px-4 rounded-md">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-red-500">Not Resolved</Badge>
                                <span className="font-medium">
                                  {objectionResolutionData.find(d => d.name === "Not Resolved")?.value || 0} Objections
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                              <p className="text-muted-foreground text-sm">
                                These objections remain unresolved and require attention. 
                                Common blockers include complex technical limitations, 
                                pricing constraints, or competitive disadvantages.
                              </p>
                              <div className="mt-4">
                                <Button variant="outline" size="sm" className="text-red-700 border-red-200 bg-red-50">
                                  View Critical Issues
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Upsell Opportunities Summary - Enhanced */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Upsell Opportunities Analysis
                    </CardTitle>
                    <CardDescription>
                      Additional revenue potential from existing customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="col-span-1 md:col-span-2">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'High', value: upsellOpportunitiesData.high, fill: '#10B981' },
                                { name: 'Medium', value: upsellOpportunitiesData.medium, fill: '#F97316' },
                                { name: 'Low', value: upsellOpportunitiesData.low, fill: '#EF4444' }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                            </Pie>
                            <Tooltip formatter={(value: number) => [value, 'Count']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-2">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Badge className="mb-2 bg-blue-500">Total</Badge>
                              <p className="text-2xl font-bold">{upsellOpportunitiesData.total}</p>
                              <p className="text-xs text-muted-foreground">opportunities</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Badge className="mb-2 bg-green-500">Success</Badge>
                              <p className="text-2xl font-bold">{upsellOpportunitiesData.high}</p>
                              <p className="text-xs text-muted-foreground">high receptiveness</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Badge className="mb-2">Rate</Badge>
                              <p className="text-2xl font-bold">
                                {upsellOpportunitiesData.total ? 
                                  Math.round((upsellOpportunitiesData.high / upsellOpportunitiesData.total) * 100) : 
                                  0}%
                              </p>
                              <p className="text-xs text-muted-foreground">success rate</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-transparent border border-green-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ChevronUp className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Upsell Opportunity Insights</h4>
                      </div>
                      <p className="mt-2 text-sm text-green-700">
                        Based on current data, there are {upsellOpportunitiesData.high} high-confidence upsell opportunities 
                        worth pursuing. Focus on these accounts for immediate revenue impact.
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                          Generate Action Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* Action Center Tab - Enhanced UI */}
            <TabsContent value="action-center" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recommended Actions */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Recommended Actions
                    </CardTitle>
                    <CardDescription>
                      Distribution of action types across all deals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={actionCenterData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill="#0EA5E9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Action Priority List - Enhanced */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-amber-500" />
                      Priority Actions
                    </CardTitle>
                    <CardDescription>
                      Tasks that require immediate attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 overflow-auto pr-2">
                    <div className="space-y-4">
                      {actionCenterData.map((action) => (
                        <div 
                          key={action.name}
                          className={`p-4 border rounded-lg flex items-center justify-between ${
                            action.value > 5 
                              ? "border-amber-200 bg-gradient-to-r from-amber-50 to-white" 
                              : "border-gray-200"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{action.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {action.value} action{action.value !== 1 ? 's' : ''} required
                            </p>
                          </div>
                          <Badge 
                            variant={action.value > 5 ? "default" : "outline"}
                            className={action.value > 5 ? "bg-amber-500" : ""}
                          >
                            {action.value > 5 ? "High" : "Normal"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Priority Actions Overview - Enhanced */}
                <Card className="md:col-span-2 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-rose-500" />
                      Priority Actions Overview
                    </CardTitle>
                    <CardDescription>
                      Summary of high-priority tasks requiring immediate attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'High Priority', value: priorityActionsData.high, fill: '#F97316' },
                              { name: 'Medium Priority', value: priorityActionsData.medium, fill: '#FCD34D' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                          </Pie>
                          <Tooltip formatter={(value: number) => [value, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="flex flex-col justify-center">
                        <div className="mb-4">
                          <h4 className="text-lg font-medium">Action Priority Summary</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            High priority actions require immediate attention to avoid potential deal blockers.
                            Medium priority actions should be planned within the next week.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-3 bg-gradient-to-br from-amber-50 to-white border border-amber-200">
                            <div className="text-amber-600 font-medium">High</div>
                            <div className="text-2xl font-bold">{priorityActionsData.high}</div>
                            <div className="text-xs text-amber-600">Urgent Actions</div>
                          </Card>
                          <Card className="p-3 bg-gradient-to-br from-yellow-50 to-white border border-yellow-100">
                            <div className="text-yellow-600 font-medium">Medium</div>
                            <div className="text-2xl font-bold">{priorityActionsData.medium}</div>
                            <div className="text-xs text-yellow-600">Scheduled Actions</div>
                          </Card>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600">
                            <ListCheck className="h-4 w-4 mr-2" />
                            Assign All Priority Actions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AEDashboard;
