
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Legend,
  Cell,
  BarChart,
  Bar
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

interface PipelineOverviewProps {
  data: CRMData[];
}

const PipelineOverview: React.FC<PipelineOverviewProps> = ({ data }) => {
  // Prepare data for the pipeline funnel
  const pipelineStages = data.reduce((acc, deal) => {
    const stage = deal.deal_stage || "unknown";
    if (!acc[stage]) {
      acc[stage] = { name: stage, value: 0, amount: 0 };
    }
    acc[stage].value += 1;
    acc[stage].amount += deal.deal_amount || 0;
    return acc;
  }, {} as Record<string, { name: string; value: number; amount: number }>);
  
  const pipelineFunnelData = Object.values(pipelineStages)
    .sort((a, b) => b.value - a.value); // Sort by count descending for funnel

  // Simulated pipeline velocity metrics
  const pipelineVelocityData = [
    { stage: "Discovery", avgDays: 15, benchmark: 14 },
    { stage: "Qualification", avgDays: 22, benchmark: 21 },
    { stage: "Implementation", avgDays: 30, benchmark: 28 },
  ];

  // Prepare fake pipeline trend data (would normally come from historical data)
  const currentDate = new Date();
  const pipelineTrendData = Array(6).fill(0).map((_, i) => {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - 5 + i);
    
    return {
      name: month.toLocaleDateString('en-US', { month: 'short' }),
      discovery: Math.floor(Math.random() * 10) + 5,
      qualification: Math.floor(Math.random() * 8) + 3,
      implementation: Math.floor(Math.random() * 5) + 1,
    };
  });

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
                  <Tooltip formatter={(value, name, props) => [
                    name === 'value' ? `${value} Deals` : `$${value.toLocaleString()}`,
                    props.payload.name
                  ]} />
                  <Funnel
                    dataKey="value"
                    data={pipelineFunnelData}
                    isAnimationActive
                  >
                    {pipelineFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        '#8884d8',
                        '#83a6ed', 
                        '#8dd1e1', 
                        '#82ca9d', 
                        '#a4de6c'
                      ][index % 5]} />
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
                  data={pipelineTrendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="discovery" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="qualification" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="implementation" stroke="#ffc658" />
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
                data={pipelineVelocityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis label={{ value: 'Avg. Days in Stage', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgDays" name="Avg Days in Stage" fill="#8884d8" />
                <Bar dataKey="benchmark" name="Benchmark" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineOverview;
