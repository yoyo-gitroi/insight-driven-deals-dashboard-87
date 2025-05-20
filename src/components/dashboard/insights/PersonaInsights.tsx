
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface PersonaInsightsProps {
  data: any[];
}

const PersonaInsights: React.FC<PersonaInsightsProps> = ({ data }) => {
  // Process the data to generate persona insights
  const personaData = React.useMemo(() => {
    // In a real app, this would extract persona data from the dataset
    // For now, we'll use sample data
    return [
      { name: "CTO", value: 12, color: "#4CAF50" },
      { name: "IT Director", value: 9, color: "#2196F3" },
      { name: "Security Officer", value: 6, color: "#FF9800" },
      { name: "Finance Director", value: 5, color: "#9C27B0" },
      { name: "Implementation Lead", value: 3, color: "#F44336" }
    ];
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Persona Insights</CardTitle>
        <CardDescription>
          Key stakeholders by engagement frequency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={personaData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 80,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category"
                width={70}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {personaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm bg-blue-50 p-3 rounded border border-blue-100">
          <strong>Insight:</strong> Technical stakeholders (CTO, IT Director) are most actively engaged, 
          while financial stakeholders show lower engagement levels.
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonaInsights;
