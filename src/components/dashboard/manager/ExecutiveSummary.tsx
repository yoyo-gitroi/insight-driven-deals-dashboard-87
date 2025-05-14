
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  PieChart
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";

type CRMData = {
  sr_no: number;
  company_name: string;
  size: string;
  deal_name: string;
  deal_stage: string;
  deal_amount: number;
  owner: string;
  close_date: string;
  nba: string;
  signals: string;
  actions: string;
  transcripts: string;
};

interface ExecutiveSummaryProps {
  data: CRMData[];
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
  // Calculate summary metrics
  const totalPipeline = data.reduce((sum, deal) => sum + (deal.deal_amount || 0), 0);
  const totalDeals = data.length;
  const avgDealSize = totalDeals > 0 ? totalPipeline / totalDeals : 0;
  
  // Stage distribution
  const stageDistribution = data.reduce((acc, deal) => {
    const stage = deal.deal_stage || "unknown";
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate weighted pipeline (simple implementation)
  const stageWeights: Record<string, number> = {
    discovery: 0.2,
    qualification: 0.5,
    implementation: 0.8,
    "closed won": 1.0,
    "closed lost": 0.0
  };
  
  const weightedPipeline = data.reduce((sum, deal) => {
    const weight = stageWeights[deal.deal_stage?.toLowerCase() || ""] || 0.1;
    return sum + (deal.deal_amount || 0) * weight;
  }, 0);
  
  // Calculate conversion rate
  const implementationDeals = data.filter(deal => 
    deal.deal_stage?.toLowerCase() === "implementation" || 
    deal.deal_stage?.toLowerCase() === "closed won"
  ).length;
  const conversionRate = totalDeals > 0 ? (implementationDeals / totalDeals) * 100 : 0;

  // Prepare data for the radar chart (AE performance)
  const uniqueAEs = [...new Set(data.map(deal => deal.owner))];
  const aePerformanceData = uniqueAEs.map(ae => {
    const aeDealCount = data.filter(deal => deal.owner === ae).length;
    const aeDealsInProgress = data.filter(
      deal => deal.owner === ae && 
      (deal.deal_stage?.toLowerCase() === "discovery" || deal.deal_stage?.toLowerCase() === "qualification")
    ).length;
    const aeDealsClosed = data.filter(
      deal => deal.owner === ae && 
      (deal.deal_stage?.toLowerCase() === "implementation" || deal.deal_stage?.toLowerCase() === "closed won")
    ).length;
    
    return {
      subject: ae,
      A: aeDealCount / Math.max(...uniqueAEs.map(ae => data.filter(deal => deal.owner === ae).length)) * 100,
      B: aeDealsInProgress > 0 ? (aeDealsInProgress / aeDealCount) * 100 : 0,
      C: aeDealsClosed > 0 ? (aeDealsClosed / aeDealCount) * 100 : 0,
      fullMark: 100
    };
  });

  // Prepare stage distribution data for radial bar chart
  const stageDistributionData = Object.entries(stageDistribution).map(([stage, count], index) => ({
    name: stage,
    value: count,
    fill: [
      '#8884d8',
      '#83a6ed',
      '#8dd1e1',
      '#82ca9d',
      '#a4de6c',
      '#d0ed57'
    ][index % 6]
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPipeline.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              {uniqueAEs.length} Account Executives
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(avgDealSize).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per opportunity
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span>From discovery to implementation</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={aePerformanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Deal Count"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="In Progress"
                    dataKey="B"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Closed"
                    dataKey="C"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="30%" 
                  outerRadius="80%" 
                  data={stageDistributionData} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar 
                    background
                    clockWise={false}
                    dataKey="value" 
                    cornerRadius={10}
                  />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
