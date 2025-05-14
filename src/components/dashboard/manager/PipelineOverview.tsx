
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  FunnelItem,
  LabelList,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PipelineOverviewProps {
  data: any[];
}

const PipelineOverview: React.FC<PipelineOverviewProps> = ({ data }) => {
  // Process pipeline funnel data
  const stages = ["discovery", "qualification", "implementation", "closed won"];
  const stageLabels = ["Discovery", "Qualification", "Implementation", "Closed Won"];
  
  const funnelData = stages.map((stage, index) => {
    const dealsInStage = data.filter(deal => 
      deal.deal_stage?.toLowerCase() === stage
    );
    
    const count = dealsInStage.length;
    const value = dealsInStage.reduce((sum, deal) => sum + (deal.deal_amount || 0), 0);
    
    return {
      value: count,
      name: stageLabels[index],
      amount: value,
      fill: [
        "#8884d8",
        "#83a6ed", 
        "#8dd1e1", 
        "#82ca9d"
      ][index % 4]
    };
  }).filter(stage => stage.value > 0);

  // Generate pipeline trend data (simulated by month since we don't have real time series)
  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map(month => {
      // We'll simulate data here since we don't have actual monthly data
      return {
        month,
        discovery: Math.floor(Math.random() * 10 + 5) * 100000,
        qualification: Math.floor(Math.random() * 8 + 3) * 100000,
        implementation: Math.floor(Math.random() * 5 + 1) * 100000
      };
    });
  };
  
  const monthlyData = generateMonthlyData();
  
  // Generate pipeline velocity data
  const velocityData = stages.map(stage => {
    // Calculate average days in stage (simulated)
    // In a real implementation, this would come from deal data with timestamps
    const avgDays = Math.floor(Math.random() * 30) + 10;
    
    return {
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      avgDays,
      benchmark: avgDays < 20 ? "Good" : avgDays < 30 ? "Average" : "Slow"
    };
  });

  // Custom tooltip for funnel chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">{`Deals: ${payload[0].value}`}</p>
          <p className="text-sm">{`Value: $${payload[0].payload.amount.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Pipeline Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList 
                      position="right"
                      fill="#000"
                      stroke="none"
                      dataKey="name"
                    />
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} 
                  />
                  <Tooltip 
                    formatter={(value) => [`$${(Number(value)/1000).toFixed(0)}k`, undefined]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="discovery" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="qualification" 
                    stroke="#82ca9d" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="implementation" 
                    stroke="#ffc658" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={velocityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Average Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="avgDays" 
                  name="Avg Days in Stage" 
                  fill="#8884d8"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                >
                  {velocityData.map((entry, index) => {
                    let color = "#8884d8";
                    if (entry.benchmark === "Good") color = "#4ade80";
                    if (entry.benchmark === "Average") color = "#facc15";
                    if (entry.benchmark === "Slow") color = "#f87171";
                    
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineOverview;
