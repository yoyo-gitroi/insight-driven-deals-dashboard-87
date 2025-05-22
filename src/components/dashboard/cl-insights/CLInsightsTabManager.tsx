
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExecutiveSummaryTab from "./tabs/ExecutiveSummaryTab";
import SignalDetectionTab from "./tabs/SignalDetectionTab";
import AEPerformanceTab from "./tabs/AEPerformanceTab";
import StakeholdersTab from "./tabs/StakeholdersTab";
import TrendsTab from "./tabs/TrendsTab";
import StrategyTab from "./tabs/StrategyTab";
import { Badge } from "@/components/ui/badge";

interface CLInsightsTabManagerProps {
  report: any;
  crmData: any[];
}

const CLInsightsTabManager: React.FC<CLInsightsTabManagerProps> = ({ report, crmData }) => {
  return (
    <Tabs defaultValue="executive-summary" className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="executive-summary" className="rounded-md">Executive Summary</TabsTrigger>
          <TabsTrigger value="signals" className="rounded-md">Signal Detection</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-md">AE Performance</TabsTrigger>
          <TabsTrigger value="stakeholders" className="rounded-md">Stakeholders</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-md">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="strategy" className="rounded-md">Strategic Actions</TabsTrigger>
        </TabsList>
        
        <div className="flex space-x-2">
          {/* Badges can be added here if needed */}
        </div>
      </div>
      
      <TabsContent value="executive-summary" className="space-y-4">
        <ExecutiveSummaryTab executiveSummary={report["Executive Summary"]} />
      </TabsContent>
      
      <TabsContent value="signals" className="space-y-4">
        <SignalDetectionTab 
          signalCategories={report["Primary Signal Categories"]} 
          crmData={crmData} 
        />
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-4">
        <AEPerformanceTab aePerformance={report["Account Executive Performance"]} />
      </TabsContent>
      
      <TabsContent value="stakeholders" className="space-y-4">
        <StakeholdersTab stakeholderInsights={report["Stakeholder & Persona Insights"]} />
      </TabsContent>
      
      <TabsContent value="trends" className="space-y-4">
        <TrendsTab 
          trendAnalysis={report["Pattern & Trend Analysis"]}
          upsellExpansion={report["Upsell & Expansion"]} 
        />
      </TabsContent>
      
      <TabsContent value="strategy" className="space-y-4">
        <StrategyTab 
          dealAcceleration={report["Deal Acceleration & Risk"]}
          strategicActions={report["Strategic Next Actions"]} 
          contentRecommendations={report["Content & Collateral Recommendations"]} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default CLInsightsTabManager;
