
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
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TeamPerformanceProps {
  data: any[];
  aePerformanceData: any[];
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ data, aePerformanceData }) => {
  // Process AE performance comparison data
  const aeComparisonData = aePerformanceData.map(ae => ({
    name: ae.name,
    totalDeals: ae.totalDeals,
    discovery: ae.discoveryCount,
    qualification: ae.qualificationCount,
    implementation: ae.implementationCount
  })).sort((a, b) => b.totalDeals - a.totalDeals);
  
  // Generate AE activity metrics (simulated since we don't have actual activity data)
  const aeActivityData = aePerformanceData.map(ae => {
    // Simulate activity metrics
    const meetingCount = Math.floor(Math.random() * 20) + 5;
    const emailCount = Math.floor(Math.random() * 50) + 20;
    const callCount = Math.floor(Math.random() * 30) + 10;
    
    // Calculate total pipeline value for this AE
    const pipelineValue = data
      .filter(deal => deal.owner === ae.name)
      .reduce((sum, deal) => sum + (deal.deal_amount || 0), 0);
    
    return {
      name: ae.name,
      meetingCount,
      communicationCount: emailCount + callCount,
      pipelineValue,
      fill: [
        "#8884d8",
        "#83a6ed", 
        "#8dd1e1", 
        "#82ca9d",
        "#a4de6c",
        "#d0ed57"
      ][aePerformanceData.indexOf(ae) % 6]
    };
  });
  
  // Calculate top performers
  const topPerformers = {
    highestPipeline: aePerformanceData.reduce((max, ae) => {
      const pipelineValue = data
        .filter(deal => deal.owner === ae.name)
        .reduce((sum, deal) => sum + (deal.deal_amount || 0), 0);
      
      if (!max.value || pipelineValue > max.value) {
        return { name: ae.name, value: pipelineValue };
      }
      return max;
    }, { name: "", value: 0 }),
    
    mostDeals: aePerformanceData.reduce((max, ae) => {
      if (!max.value || ae.totalDeals > max.value) {
        return { name: ae.name, value: ae.totalDeals };
      }
      return max;
    }, { name: "", value: 0 }),
    
    highestConversion: aePerformanceData.reduce((max, ae) => {
      const conversionRate = ae.totalDeals > 0 ? 
        (ae.implementationCount / ae.totalDeals) * 100 : 0;
      
      if (!max.value || conversionRate > max.value) {
        return { name: ae.name, value: conversionRate };
      }
      return max;
    }, { name: "", value: 0 })
  };
  
  // Custom scatter plot tooltip
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{`Meetings: ${data.meetingCount}`}</p>
          <p className="text-sm">{`Communication: ${data.communicationCount}`}</p>
          <p className="text-sm">{`Pipeline: $${data.pipelineValue.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Team Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Pipeline Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers.highestPipeline.name}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                ${topPerformers.highestPipeline.value.toLocaleString()} pipeline
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Most Active AE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers.mostDeals.name}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                {topPerformers.mostDeals.value} active deals
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Highest Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers.highestConversion.name}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                {topPerformers.highestConversion.value.toFixed(1)}% to implementation
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AE Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={aeComparisonData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="discovery" 
                  stackId="a" 
                  fill="#8884d8" 
                  name="Discovery" 
                />
                <Bar 
                  dataKey="qualification" 
                  stackId="a" 
                  fill="#82ca9d" 
                  name="Qualification" 
                />
                <Bar 
                  dataKey="implementation" 
                  stackId="a" 
                  fill="#ffc658" 
                  name="Implementation" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AE Activity Metrics</CardTitle>
          <CardDescription>
            Meeting frequency vs. communication volume, with bubble size representing pipeline value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="meetingCount" 
                  name="Meetings" 
                  label={{ value: 'Meeting Count', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="communicationCount" 
                  name="Communications"
                  label={{ value: 'Communication Count', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis 
                  type="number" 
                  dataKey="pipelineValue" 
                  range={[400, 2000]} 
                  name="Pipeline Value"
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip />} />
                <Legend />
                <Scatter name="AE Activity" data={aeActivityData}>
                  {aeActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPerformance;
