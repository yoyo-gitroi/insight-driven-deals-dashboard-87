
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis, 
  RadialBarChart, RadialBar
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

type TeamPerformanceProps = {
  data: CRMData[];
};

export const TeamPerformance: React.FC<TeamPerformanceProps> = ({ data }) => {
  // Calculate AE performance metrics
  const aePerformance = Object.entries(
    data.reduce((acc, deal) => {
      const owner = deal.owner;
      if (!acc[owner]) {
        acc[owner] = {
          name: owner,
          deals: 0,
          pipelineValue: 0,
          conversion: 0,
          implementationDeals: 0,
          totalDeals: 0,
          meetings: Math.floor(Math.random() * 30) + 10, // Simulated data
          emails: Math.floor(Math.random() * 100) + 50,  // Simulated data
          calls: Math.floor(Math.random() * 40) + 20,    // Simulated data
        };
      }
      
      acc[owner].deals += 1;
      acc[owner].pipelineValue += deal.deal_amount;
      
      acc[owner].totalDeals += 1;
      if (deal.deal_stage === "Implementation") {
        acc[owner].implementationDeals += 1;
      }
      
      return acc;
    }, {} as Record<string, any>)
  ).map(([_, value]) => ({
    ...value,
    conversion: value.totalDeals > 0 ? (value.implementationDeals / value.totalDeals) * 100 : 0
  }));

  // Sort by pipeline value for performance comparison
  const sortedByPipeline = [...aePerformance].sort((a, b) => b.pipelineValue - a.pipelineValue);

  // Format bubble chart data
  const bubbleData = aePerformance.map(ae => ({
    name: ae.name,
    meetings: ae.meetings,
    communications: ae.emails + ae.calls,
    pipelineValue: ae.pipelineValue,
    fill: getRandomColor(ae.name)
  }));

  // Find top performers
  const topPerformers = {
    highestPipeline: aePerformance.reduce((max, ae) => ae.pipelineValue > max.pipelineValue ? ae : max, aePerformance[0] || { name: "N/A", pipelineValue: 0 }),
    mostDeals: aePerformance.reduce((max, ae) => ae.deals > max.deals ? ae : max, aePerformance[0] || { name: "N/A", deals: 0 }),
    highestConversion: aePerformance.reduce((max, ae) => ae.conversion > max.conversion ? ae : max, aePerformance[0] || { name: "N/A", conversion: 0 })
  };

  // Helper function to generate consistent colors based on name
  function getRandomColor(name: string) {
    // Generate a color based on the string hash of the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      "#4f46e5", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
      "#ef4444", "#f97316", "#6366f1", "#ec4899", "#14b8a6"
    ];
    
    return colors[Math.abs(hash) % colors.length];
  }

  // Helper function to get initials from name
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Team Performance</h2>
      
      {/* AE Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>AE Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={sortedByPipeline}
                margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={60} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="pipelineValue" name="Pipeline Value" fill="#4f46e5">
                  {sortedByPipeline.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* AE Activity Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>AE Activity Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis 
                  type="number" 
                  dataKey="meetings" 
                  name="Meetings" 
                  label={{ value: 'Meetings', position: 'insideBottomRight', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="communications" 
                  name="Emails + Calls" 
                  label={{ value: 'Emails + Calls', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis 
                  type="number" 
                  dataKey="pipelineValue" 
                  range={[400, 2000]} 
                  name="Pipeline Value" 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => {
                    if (name === "Pipeline Value") {
                      return [`$${Number(value).toLocaleString()}`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Scatter name="AE Activity vs Pipeline" data={bubbleData} fill="#8884d8">
                  {bubbleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Top Performer Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Highest Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarFallback style={{ backgroundColor: getRandomColor(topPerformers.highestPipeline.name) }}>
                {getInitials(topPerformers.highestPipeline.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{topPerformers.highestPipeline.name}</p>
              <p className="text-gray-500">${topPerformers.highestPipeline.pipelineValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Most Deals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarFallback style={{ backgroundColor: getRandomColor(topPerformers.mostDeals.name) }}>
                {getInitials(topPerformers.mostDeals.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{topPerformers.mostDeals.name}</p>
              <p className="text-gray-500">{topPerformers.mostDeals.deals} Deals</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Highest Conversion</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarFallback style={{ backgroundColor: getRandomColor(topPerformers.highestConversion.name) }}>
                {getInitials(topPerformers.highestConversion.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{topPerformers.highestConversion.name}</p>
              <p className="text-gray-500">{topPerformers.highestConversion.conversion.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
