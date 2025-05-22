
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AccountImpactScatter = () => {
  // Sample data - in a real application, this would come from props or API
  const accounts = [
    { name: "Amadeus", dealSize: 250000, complexity: 85, winProbability: 75, daysInPipeline: 90 },
    { name: "BigBasket", dealSize: 180000, complexity: 65, winProbability: 60, daysInPipeline: 75 },
    { name: "Billtrust", dealSize: 150000, complexity: 45, winProbability: 80, daysInPipeline: 60 },
    { name: "Chatham Bars Inn", dealSize: 50000, complexity: 30, winProbability: 85, daysInPipeline: 45 },
    { name: "Cognizant", dealSize: 350000, complexity: 75, winProbability: 70, daysInPipeline: 120 },
    { name: "ecoATM", dealSize: 100000, complexity: 50, winProbability: 65, daysInPipeline: 80 },
    { name: "Helen of Troy", dealSize: 120000, complexity: 55, winProbability: 75, daysInPipeline: 65 },
    { name: "HubSpot", dealSize: 280000, complexity: 80, winProbability: 60, daysInPipeline: 105 },
    { name: "Iron Mountain", dealSize: 220000, complexity: 70, winProbability: 55, daysInPipeline: 95 },
    { name: "Mastercard", dealSize: 500000, complexity: 90, winProbability: 65, daysInPipeline: 150 },
    { name: "Priceline", dealSize: 320000, complexity: 60, winProbability: 80, daysInPipeline: 70 },
    { name: "Skipify", dealSize: 130000, complexity: 40, winProbability: 70, daysInPipeline: 55 },
    { name: "TheGuarantors", dealSize: 170000, complexity: 65, winProbability: 75, daysInPipeline: 85 },
    { name: "Yatra", dealSize: 200000, complexity: 75, winProbability: 60, daysInPipeline: 100 }
  ];

  // Function to determine color based on win probability
  const getColor = (probability: number) => {
    if (probability >= 75) return "#10b981"; // Green
    if (probability >= 60) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  // Transform data for scatter chart
  const scatterData = accounts.map(account => ({
    x: account.dealSize / 1000, // Convert to K for better display
    y: account.complexity,
    z: account.daysInPipeline / 2, // Scale down for better visualization
    name: account.name,
    color: getColor(account.winProbability),
    winProbability: account.winProbability,
    daysInPipeline: account.daysInPipeline,
    dealSize: account.dealSize
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">Deal Size: ${data.dealSize.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Complexity: {data.y}/100</p>
          <p className="text-sm text-gray-600">Win Probability: {data.winProbability}%</p>
          <p className="text-sm text-gray-600">Days in Pipeline: {data.daysInPipeline}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">Account Impact Scatter Plot</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Deal Size" 
                unit="K" 
                label={{ value: 'Deal Size ($K)', position: 'bottom', offset: 0 }}
                domain={[0, 'dataMax + 50']}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Complexity" 
                label={{ value: 'Signal Complexity', angle: -90, position: 'left' }}
                domain={[0, 100]}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Days" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {scatterData.map((entry, index) => (
                <Scatter 
                  key={index}
                  name={entry.name} 
                  data={[entry]} 
                  fill={entry.color} 
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountImpactScatter;
