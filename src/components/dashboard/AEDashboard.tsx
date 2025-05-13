
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DealTable from "@/components/dashboard/DealTable";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AEDashboardProps {
  crmData: any[];
  transcriptData: any[];
  aeList: string[];
  selectedAE: string;
  setSelectedAE: (ae: string) => void;
}

const AEDashboard: React.FC<AEDashboardProps> = ({ 
  crmData, 
  transcriptData, 
  aeList, 
  selectedAE, 
  setSelectedAE 
}) => {
  const [filteredDeals, setFilteredDeals] = useState<any[]>([]);
  const [dealStages, setDealStages] = useState<string[]>([]);
  const [dealsByStage, setDealsByStage] = useState<Record<string, number>>({});
  const [tabView, setTabView] = useState("ae");

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
  }, [selectedAE, crmData]);

  // Combine CRM and transcript data based on sr_no
  const getEnrichedDeals = () => {
    return filteredDeals.map(deal => {
      const transcript = transcriptData.find(t => t.sr_no === deal.sr_no) || {};
      return {
        ...deal,
        signals: transcript.signals || '',
        nba: transcript.nba || '',
        actions: transcript.actions || ''
      };
    });
  };

  const enrichedDeals = getEnrichedDeals();

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

      <Card>
        <CardHeader>
          <CardTitle>Playbook View</CardTitle>
        </CardHeader>
        <CardContent>
          <DealTable deals={enrichedDeals} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AEDashboard;
