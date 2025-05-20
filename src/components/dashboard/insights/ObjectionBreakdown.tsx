
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";

interface ObjectionBreakdownProps {
  objectionTypeData: any[];
  colorMapping: Record<string, string>;
}

const ObjectionBreakdown: React.FC<ObjectionBreakdownProps> = ({ objectionTypeData, colorMapping }) => {
  // Add color to each objection type
  const enhancedData = objectionTypeData.map(objection => {
    const objName = objection.name.replace("Objection::", "");
    return {
      ...objection,
      color: colorMapping[objName] || colorMapping["Other"]
    };
  });

  return (
    <Card className="col-span-1 border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Objection Types
        </CardTitle>
        <CardDescription>
          Breakdown of objections by category
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={enhancedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.replace("Objection::", "")}
            />
            <Tooltip 
              formatter={(value: number) => [value, 'Count']} 
              labelFormatter={(label) => label.replace("Objection::", "")}
            />
            <Bar 
              dataKey="value" 
              name="Count" 
              radius={[0, 4, 4, 0]}
            >
              {enhancedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ObjectionBreakdown;
