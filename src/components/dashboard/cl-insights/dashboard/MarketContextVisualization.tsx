
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Database, Users } from "lucide-react";

interface MarketContextVisualizationProps {
  context: string[];
}

const MarketContextVisualization: React.FC<MarketContextVisualizationProps> = ({ context = [] }) => {
  // Map context items to specific categories with icons
  const categorizedContext = [
    {
      icon: <TrendingUp className="h-4 w-4 text-indigo-600" />,
      title: "Market Acceleration",
      description: context[0] || "AI-driven insights driving adoption across financial services, travel, retail/ecomm, and SaaS."
    },
    {
      icon: <Database className="h-4 w-4 text-blue-600" />,
      title: "Tech Stack Complexity",
      description: context[1] || "Customers rely on fragmented tools like Power BI, Snowflake, Salesforce, leading to integration friction."
    },
    {
      icon: <Users className="h-4 w-4 text-purple-600" />,
      title: "Competitive Landscape",
      description: context[3] || "Pressure from hyperscalers and incumbents create competitive evaluation challenges."
    }
  ];

  return (
    <Card className="shadow-md border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg pb-2">
        <CardTitle className="text-lg font-medium">
          Market Context
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3 max-h-[180px] overflow-y-auto">
          {categorizedContext.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
              <div className="flex-shrink-0 mt-1">{item.icon}</div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">{item.title}</h4>
                <p className="text-xs text-gray-700 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketContextVisualization;
