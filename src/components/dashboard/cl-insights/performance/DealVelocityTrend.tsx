
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DealVelocityTrend = () => {
  // Sample data - in a real application, this would come from props or API
  const velocityData = [
    {
      month: "Jan",
      "Bhaskar Sunkara": 92,
      "Karl Evans": 85,
      "Randy Boysen": 95,
      "Gomini Shreya": 72,
      "Yashaswi Pathak": 68,
      benchmark: 80
    },
    {
      month: "Feb",
      "Bhaskar Sunkara": 94,
      "Karl Evans": 87,
      "Randy Boysen": 97,
      "Gomini Shreya": 75,
      "Yashaswi Pathak": 70,
      benchmark: 80
    },
    {
      month: "Mar",
      "Bhaskar Sunkara": 95,
      "Karl Evans": 90,
      "Randy Boysen": 98,
      "Gomini Shreya": 77,
      "Yashaswi Pathak": 73,
      benchmark: 80
    },
    {
      month: "Apr",
      "Bhaskar Sunkara": 98,
      "Karl Evans": 92,
      "Randy Boysen": 99,
      "Gomini Shreya": 78,
      "Yashaswi Pathak": 71,
      benchmark: 80
    },
    {
      month: "May",
      "Bhaskar Sunkara": 97,
      "Karl Evans": 93,
      "Randy Boysen": 100,
      "Gomini Shreya": 79,
      "Yashaswi Pathak": 70,
      benchmark: 80
    },
    {
      month: "Jun",
      "Bhaskar Sunkara": 99,
      "Karl Evans": 95,
      "Randy Boysen": 102,
      "Gomini Shreya": 80,
      "Yashaswi Pathak": 69,
      benchmark: 80
    }
  ];

  // Colors for each AE
  const aeColors = {
    "Bhaskar Sunkara": "#3b82f6", // blue
    "Karl Evans": "#10b981", // green
    "Randy Boysen": "#8b5cf6", // violet
    "Gomini Shreya": "#f97316", // orange
    "Yashaswi Pathak": "#ef4444", // red
    "benchmark": "#6b7280" // gray
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">Deal Velocity Trend</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={velocityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis domain={[60, 110]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.keys(aeColors).map((ae) => (
                <Line
                  key={ae}
                  type="monotone"
                  dataKey={ae}
                  stroke={aeColors[ae as keyof typeof aeColors]}
                  strokeWidth={ae === "benchmark" ? 2 : 2}
                  strokeDasharray={ae === "benchmark" ? "5 5" : ""}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealVelocityTrend;
