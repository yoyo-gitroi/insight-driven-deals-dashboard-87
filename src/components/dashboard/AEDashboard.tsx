import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DealTable from "@/components/dashboard/DealTable";
import AEInsights from "@/components/dashboard/AEInsights";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { safeJsonParse } from "@/lib/utils";
import ManagerDashboard from "@/components/dashboard/manager/ManagerDashboard";

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
  const [dashboardTab, setDashboardTab] = useState("playbook");
  const [priorityDeals, setPriorityDeals] = useState<any[]>([]);

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

    // Find high priority deals based on NBA action_reference_id and actions priority
    const highPriorityDeals = crmData.filter(deal => {
      try {
        // Parse the NBA data to get action_reference_id
        const nbaData = safeJsonParse(deal.nba, {});
        const actionReferenceId = nbaData?.nba_action?.action_reference_id;
        
        // If no action reference ID, this deal can't be prioritized
        if (!actionReferenceId) return false;
        
        // Parse actions data to find matching action with high priority
        const actionsData = safeJsonParse(deal.actions, {});
        
        // Check if actions is an array directly
        if (Array.isArray(actionsData)) {
          return actionsData.some(action => 
            action.signal_reference_id === actionReferenceId && 
            action.priority?.toLowerCase() === 'high'
          );
        }
        
        // Check if actions has an actions array inside it (more common structure)
        if (actionsData?.actions && Array.isArray(actionsData.actions)) {
          return actionsData.actions.some(action => 
            action.signal_reference_id === actionReferenceId && 
            action.priority?.toLowerCase() === 'high'
          );
        }
        
        return false;
      } catch (error) {
        console.error("Error processing priority deal:", error);
        return false;
      }
    });
    
    setPriorityDeals(highPriorityDeals);
    setPriorityDealsCount(highPriorityDeals.length);

    // Generate AE performance data for the CRO view
    if (tabView === "manager") {
      generateAEPerformanceData();
    }
  }, [selectedAE, crmData, tabView]);

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
        <>
          <div className="pb-4">
            <label htmlFor="ae-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Account Executive
            </label>
            <Select value={selectedAE} onValueChange={setSelectedAE}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select Account Executive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Account Executives</SelectItem>
                {aeList.map((ae) => (
                  <SelectItem key={ae} value={ae}>{ae}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredDeals.length}</div>
              </CardContent>
            </Card>
            
            {dealStages.map((stage) => (
              <Card key={stage}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dealsByStage[stage] || 0}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs for switching between Playbook and Insights views */}
          <Tabs value={dashboardTab} onValueChange={setDashboardTab}>
            <TabsList>
              <TabsTrigger value="playbook">Playbook View</TabsTrigger>
              <TabsTrigger value="insights">Insights View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="playbook">
              <Card>
                <CardHeader>
                  <CardTitle>Playbook View</CardTitle>
                </CardHeader>
                <CardContent>
                  <DealTable deals={filteredDeals} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights">
              <Card>
                <CardContent className="pt-6">
                  <AEInsights 
                    crmData={filteredDeals}
                    selectedAE={selectedAE}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {tabView === "manager" && (
        <ManagerDashboard 
          crmData={crmData}
          aeList={aeList}
          aePerformanceData={aePerformanceData}
          priorityDeals={priorityDeals}
        />
      )}
    </div>
  );
};

export default AEDashboard;
