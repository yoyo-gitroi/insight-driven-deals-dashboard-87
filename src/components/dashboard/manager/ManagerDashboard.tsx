
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { safeJsonParse } from "@/lib/utils";
import ExecutiveSummary from "./ExecutiveSummary";
import PipelineOverview from "./PipelineOverview";
import TeamPerformance from "./TeamPerformance";
import MarketAnalysis from "./MarketAnalysis";
import StrategicSignals from "./StrategicSignals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManagerDashboardProps {
  crmData: any[];
  aeList: string[];
  aePerformanceData: any[];
  priorityDeals: any[];
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  crmData, 
  aeList, 
  aePerformanceData,
  priorityDeals 
}) => {
  // Calculate total pipeline value
  const totalPipeline = crmData.reduce((sum, deal) => sum + (deal.deal_amount || 0), 0);
  
  // Calculate weighted pipeline (simple implementation)
  const stageWeights: Record<string, number> = {
    discovery: 0.2,
    qualification: 0.5,
    implementation: 0.8,
    "closed won": 1.0,
    "closed lost": 0.0
  };
  
  const weightedPipeline = crmData.reduce((sum, deal) => {
    const weight = stageWeights[deal.deal_stage?.toLowerCase() || ""] || 0.1;
    return sum + (deal.deal_amount || 0) * weight;
  }, 0);

  // Set up tabs for different dashboard sections
  const [activeTab, setActiveTab] = React.useState("executive");

  return (
    <div className="space-y-6">
      {/* Top metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              Priority Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{priorityDeals.length}</div>
            <p className="text-xs text-amber-600 mt-1">High priority deals requiring attention</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              ${totalPipeline.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              ${Math.round(weightedPipeline).toLocaleString()} weighted value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="executive">Executive Summary</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Overview</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="signals">Strategic Signals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="executive">
          <Card>
            <CardContent className="pt-6">
              <ExecutiveSummary data={crmData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pipeline">
          <Card>
            <CardContent className="pt-6">
              <PipelineOverview data={crmData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardContent className="pt-6">
              <TeamPerformance data={crmData} aePerformanceData={aePerformanceData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="market">
          <Card>
            <CardContent className="pt-6">
              <MarketAnalysis data={crmData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="signals">
          <Card>
            <CardContent className="pt-6">
              <StrategicSignals data={crmData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;
