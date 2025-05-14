
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell,
  LineChart, Line, FunnelChart, Funnel, LabelList,
  Area, AreaChart, ComposedChart
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

type PipelineOverviewProps = {
  data: CRMData[];
};

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({ data }) => {
  // Calculate metrics for pipeline funnel
  const stageOrder = ["Discovery", "Qualification", "Implementation", "Closed Won"];
  const stageCounts = stageOrder.reduce((acc, stage) => {
    const dealsInStage = data.filter(deal => deal.deal_stage === stage);
    acc.push({
      name: stage,
      value: dealsInStage.length,
      amount: dealsInStage.reduce((sum, deal) => sum + deal.deal_amount, 0)
    });
    return acc;
  }, [] as Array<{name: string, value: number, amount: number}>);

  // Calculate time series pipeline trend
  // In a real app, you'd have dates in the data
  // Here, we'll simulate monthly data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const pipelineTrend = months.map(month => {
    return {
      name: month,
      Discovery: Math.floor(Math.random() * 1000000) + 500000,
      Qualification: Math.floor(Math.random() * 800000) + 400000,
      Implementation: Math.floor(Math.random() * 600000) + 300000
    };
  });

  // Calculate pipeline velocity metrics
  // In a real app, this would come from actual data
  const velocityData = [
    { name: "Discovery", avgDays: 15, count: data.filter(d => d.deal_stage === "Discovery").length },
    { name: "Qualification", avgDays: 30, count: data.filter(d => d.deal_stage === "Qualification").length },
    { name: "Implementation", avgDays: 45, count: data.filter(d => d.deal_stage === "Implementation").length },
    { name: "Closed Won", avgDays: 60, count: data.filter(d => d.deal_stage === "Closed Won").length }
  ];

  const stageColors: Record<string, string> = {
    "Discovery": "#4f46e5",
    "Qualification": "#8b5cf6",
    "Implementation": "#06b6d4",
    "Closed Won": "#10b981",
    "Closed Lost": "#ef4444"
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pipeline Overview</h2>
      
      {/* Pipeline Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip formatter={(value, name) => [
                  name === "value" ? `${value} Deals` : `$${Number(value).toLocaleString()}`,
                  name === "value" ? "Count" : "Amount"
                ]} />
                <Funnel
                  dataKey="value"
                  data={stageCounts}
                  isAnimationActive
                >
                  <LabelList 
                    position="right" 
                    fill="#fff" 
                    stroke="none" 
                    dataKey="name" 
                  />
                  <LabelList 
                    position="right" 
                    fill="#fff" 
                    stroke="none" 
                    dataKey="value" 
                    formatter={(value: number) => `${value} Deals`}
                    offset={60}
                  />
                  {stageCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={stageColors[entry.name] || "#6b7280"} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Time Series Pipeline Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={pipelineTrend}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value/1000)}k`} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="Discovery" 
                  stackId="1"
                  stroke={stageColors["Discovery"]} 
                  fill={stageColors["Discovery"]}
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="Qualification" 
                  stackId="1"
                  stroke={stageColors["Qualification"]} 
                  fill={stageColors["Qualification"]}
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="Implementation" 
                  stackId="1"
                  stroke={stageColors["Implementation"]} 
                  fill={stageColors["Implementation"]}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Pipeline Velocity Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={velocityData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" label={{ value: 'Avg Days in Stage', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Deal Count', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="right" dataKey="count" name="Deal Count" fill="#8884d8" barSize={20}>
                  {velocityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={stageColors[entry.name] || "#6b7280"} />
                  ))}
                </Bar>
                <Line yAxisId="left" type="monotone" dataKey="avgDays" name="Avg Days in Stage" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
