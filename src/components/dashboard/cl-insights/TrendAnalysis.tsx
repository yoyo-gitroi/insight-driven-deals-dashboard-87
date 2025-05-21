
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, TrendingUp, LineChart, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendAnalysisProps {
  trendAnalysis: {
    "Cross-Company Patterns": string[];
    "Rising vs. Stable Trends": {
      "Rising Trends": string;
      "Stable Trends": string;
    };
    "Industry- or Size-Specific Patterns": {
      "IT Services": string;
      "Financial Services": string;
    };
    "Temporal Dynamics": string;
  };
  upsellExpansion: {
    "Most Successful Upsell Motions": {
      "Product": string;
      "Average Fit Score": string;
      "ARR lift": string;
    };
    "Common Expansion Paths": string;
    "Feature Requests/Gaps Mentioned Repeatedly": string[];
  };
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trendAnalysis, upsellExpansion }) => {
  return (
    <div className="space-y-6">
      {/* Cross Company Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            Cross-Company Patterns
          </CardTitle>
          <CardDescription>Recurring themes identified across multiple accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {trendAnalysis["Cross-Company Patterns"].map((pattern, index) => (
              <li key={index} className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800">{pattern}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Rising vs Stable Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-red-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingUp className="h-5 w-5" />
              Rising Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{trendAnalysis["Rising vs. Stable Trends"]["Rising Trends"]}</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <LineChart className="h-5 w-5" />
              Stable Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{trendAnalysis["Rising vs. Stable Trends"]["Stable Trends"]}</p>
          </CardContent>
        </Card>
      </div>

      {/* Industry Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Industry-Specific Patterns</CardTitle>
          <CardDescription>Trends and variations by industry vertical</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-200 text-purple-800">IT Services</Badge>
              </div>
              <p className="text-gray-700">{trendAnalysis["Industry- or Size-Specific Patterns"]["IT Services"]}</p>
            </div>
            
            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-200 text-blue-800">Financial Services</Badge>
              </div>
              <p className="text-gray-700">{trendAnalysis["Industry- or Size-Specific Patterns"]["Financial Services"]}</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium mb-2">Temporal Dynamics</h3>
            <p className="text-gray-700">{trendAnalysis["Temporal Dynamics"]}</p>
          </div>
        </CardContent>
      </Card>

      {/* Upsell & Expansion */}
      <Card>
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex justify-between">
            <div>
              <CardTitle>Upsell & Expansion Opportunities</CardTitle>
              <CardDescription>Data-driven patterns for growth</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Most Successful Upsell Motion</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Product:</span>
                  <span className="text-sm font-semibold">{upsellExpansion["Most Successful Upsell Motions"]["Product"]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Average Fit Score:</span>
                  <span className="text-sm font-semibold">{upsellExpansion["Most Successful Upsell Motions"]["Average Fit Score"]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">ARR Lift:</span>
                  <span className="text-sm font-semibold text-green-600">{upsellExpansion["Most Successful Upsell Motions"]["ARR lift"]}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Common Expansion Paths</h3>
              <p className="text-gray-700">{upsellExpansion["Common Expansion Paths"]}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Feature Requests & Gaps</h3>
              <div className="flex flex-wrap gap-2">
                {upsellExpansion["Feature Requests/Gaps Mentioned Repeatedly"].map((feature, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
