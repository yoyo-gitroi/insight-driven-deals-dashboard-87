
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  RadialBarChart, RadialBar, Legend
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

type StageProbability = Record<string, number>;

type ExecutiveSummaryProps = {
  data: CRMData[];
  stageProbability: StageProbability;
};

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data, stageProbability }) => {
  // Calculate KPI metrics
  const totalPipelineValue = data.reduce((sum, deal) => sum + deal.deal_amount, 0);
  const totalDeals = data.length;
  const averageDealSize = totalDeals ? totalPipelineValue / totalDeals : 0;
  const weightedPipeline = data.reduce(
    (sum, deal) => sum + deal.deal_amount * (stageProbability[deal.deal_stage] || 0), 
    0
  );
  
  const implementationDeals = data.filter(deal => deal.deal_stage === "Implementation").length;
  const conversionRate = totalDeals ? (implementationDeals / totalDeals) * 100 : 0;

  // Calculate stage distribution for the gauge
  const stageDistribution = data.reduce((acc, deal) => {
    acc[deal.deal_stage] = (acc[deal.deal_stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stageColors: Record<string, string> = {
    "Discovery": "#4f46e5",
    "Qualification": "#8b5cf6",
    "Implementation": "#06b6d4",
    "Closed Won": "#10b981",
    "Closed Lost": "#ef4444"
  };

  const stageData = Object.entries(stageDistribution).map(([name, value]) => ({
    name,
    value,
    fill: stageColors[name] || "#6b7280"
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Executive Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* KPI Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weighted Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${weightedPipeline.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stage Distribution Gauge */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="30%" 
                outerRadius="90%" 
                data={stageData} 
                startAngle={180} 
                endAngle={0}
                cx="50%"
                cy="100%"
              >
                <RadialBar
                  background
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend 
                  iconSize={10} 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
