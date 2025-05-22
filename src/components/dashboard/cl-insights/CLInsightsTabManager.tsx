
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExecutiveSummaryTab from "./tabs/ExecutiveSummaryTab";
import SignalDetectionTab from "./tabs/SignalDetectionTab";
import AEPerformanceTab from "./tabs/AEPerformanceTab";
import StakeholdersTab from "./tabs/StakeholdersTab";
import TrendsTab from "./tabs/TrendsTab";
import StrategyTab from "./tabs/StrategyTab";
import { Badge } from "@/components/ui/badge";

// Import new dashboard components for Signal Intelligence
import SignalFrequencyHeatmap from "./signals/SignalFrequencyHeatmap";
import IndustryPatternMatrix from "./signals/IndustryPatternMatrix";
import AccountImpactScatter from "./signals/AccountImpactScatter";

// Import new dashboard components for AE Performance
import AEPerformanceLeaderboard from "./performance/AEPerformanceLeaderboard";
import DealVelocityTrend from "./performance/DealVelocityTrend";
import CoachingNeeds from "./performance/CoachingNeeds";

interface CLInsightsTabManagerProps {
  report: any;
  crmData: any[];
}

const CLInsightsTabManager: React.FC<CLInsightsTabManagerProps> = ({ report, crmData }) => {
  return (
    <Tabs defaultValue="signals" className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="executive-summary" className="rounded-md">Executive Summary</TabsTrigger>
          <TabsTrigger value="signals" className="rounded-md">Signal Intelligence</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-md">AE Performance</TabsTrigger>
          <TabsTrigger value="stakeholders" className="rounded-md">Stakeholders</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-md">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="strategy" className="rounded-md">Strategic Actions</TabsTrigger>
        </TabsList>
        
        <div className="flex space-x-2">
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
            14 Accounts
          </Badge>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Portfolio Analysis
          </Badge>
        </div>
      </div>
      
      <TabsContent value="executive-summary" className="space-y-4">
        <ExecutiveSummaryTab executiveSummary={report["Executive Summary"]} />
      </TabsContent>
      
      <TabsContent value="signals" className="space-y-6">
        {/* Chapter 2: Signal Intelligence Deep Dive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignalFrequencyHeatmap />
          <IndustryPatternMatrix />
        </div>
        
        <AccountImpactScatter />
        
        <SignalDetectionTab 
          signalCategories={report["Primary Signal Categories"]} 
          crmData={crmData} 
        />
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-6">
        {/* Chapter 3: Sales Performance Command Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AEPerformanceLeaderboard />
          <DealVelocityTrend />
        </div>
        
        <CoachingNeeds />
        
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
