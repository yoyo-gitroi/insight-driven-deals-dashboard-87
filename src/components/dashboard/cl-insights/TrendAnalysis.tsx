
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, TrendingUp, LineChart, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SECTION_COLORS } from "../objections/objectionConstants";

interface TrendAnalysisProps {
  trendAnalysis: {
    "Cross-Company Patterns"?: string[] | string;
    "Rising vs. Stable Trends"?: {
      "Rising Trends"?: string;
      "Stable Trends"?: string;
    };
    "Rising vs Stable Trends"?: {
      "Rising Trends"?: string;
      "Stable Trends"?: string;
    };
    "Industry- or Size-Specific Patterns"?: {
      "IT Services"?: string;
      "Financial Services"?: string;
    };
    "Industry-or Size-Specific Patterns"?: any;
    "Temporal Dynamics"?: string;
  };
  upsellExpansion: {
    insight?: string;
    "Most Successful Upsell Motions"?: {
      "Product"?: string;
      "Average Fit Score"?: string;
      "ARR lift"?: string;
    };
    "Common Expansion Paths"?: string;
    "Common Paths and Timing"?: string;
    "Feature Requests/Gaps Mentioned Repeatedly"?: string[] | string;
    "Feature Requests"?: string[] | string;
  };
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trendAnalysis, upsellExpansion }) => {
  // Handle different data formats and provide fallbacks
  const crossCompanyPatterns = trendAnalysis["Cross-Company Patterns"] || "";
  const patternsArray = Array.isArray(crossCompanyPatterns) 
    ? crossCompanyPatterns 
    : typeof crossCompanyPatterns === 'string' 
      ? [crossCompanyPatterns]
      : [];
  
  const risingVsStableTrends = trendAnalysis["Rising vs. Stable Trends"] || trendAnalysis["Rising vs Stable Trends"] || {};
  
  const industryPatterns = trendAnalysis["Industry- or Size-Specific Patterns"] || trendAnalysis["Industry-or Size-Specific Patterns"] || {};
  
  const featureRequests = upsellExpansion["Feature Requests/Gaps Mentioned Repeatedly"] || upsellExpansion["Feature Requests"] || [];
  const featureRequestsArray = Array.isArray(featureRequests) 
    ? featureRequests 
    : typeof featureRequests === 'string' 
      ? [featureRequests]
      : [];
  
  const commonPaths = upsellExpansion["Common Expansion Paths"] || upsellExpansion["Common Paths and Timing"] || "";

  return (
    <div className="space-y-6">
      {/* Cross Company Patterns */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.patterns }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" style={{ color: SECTION_COLORS.patterns }} />
            Cross-Company Patterns
          </CardTitle>
          <CardDescription>Recurring themes identified across multiple accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">{typeof crossCompanyPatterns === 'string' ? crossCompanyPatterns : ""}</p>
          </div>
          
          {patternsArray.length > 0 && (
            <ul className="space-y-3">
              {patternsArray.map((pattern, index) => (
                <li key={index} className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800">{pattern}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Rising vs Stable Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risingVsStableTrends["Rising Trends"] && (
          <Card className="border-l-4 border-l-red-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <TrendingUp className="h-5 w-5" />
                Rising Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{risingVsStableTrends["Rising Trends"]}</p>
            </CardContent>
          </Card>
        )}
        
        {risingVsStableTrends["Stable Trends"] && (
          <Card className="border-l-4 border-l-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <LineChart className="h-5 w-5" />
                Stable Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{risingVsStableTrends["Stable Trends"]}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Industry Patterns */}
      {(industryPatterns["IT Services"] || industryPatterns["Financial Services"]) && (
        <Card>
          <CardHeader>
            <CardTitle>Industry-Specific Patterns</CardTitle>
            <CardDescription>Trends and variations by industry vertical</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industryPatterns["IT Services"] && (
                <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-200 text-purple-800">IT Services</Badge>
                  </div>
                  <p className="text-gray-700">{industryPatterns["IT Services"]}</p>
                </div>
              )}
              
              {industryPatterns["Financial Services"] && (
                <div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-200 text-blue-800">Financial Services</Badge>
                  </div>
                  <p className="text-gray-700">{industryPatterns["Financial Services"]}</p>
                </div>
              )}
            </div>
            
            {trendAnalysis["Temporal Dynamics"] && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-medium mb-2">Temporal Dynamics</h3>
                <p className="text-gray-700">{trendAnalysis["Temporal Dynamics"]}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upsell & Expansion */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.expansion }}>
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
            {upsellExpansion.insight && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">{upsellExpansion.insight}</p>
              </div>
            )}

            {upsellExpansion["Most Successful Upsell Motions"] && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Most Successful Upsell Motion</h3>
                <div className="space-y-2">
                  {upsellExpansion["Most Successful Upsell Motions"]["Product"] && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Product:</span>
                      <span className="text-sm font-semibold">{upsellExpansion["Most Successful Upsell Motions"]["Product"]}</span>
                    </div>
                  )}
                  {upsellExpansion["Most Successful Upsell Motions"]["Average Fit Score"] && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Average Fit Score:</span>
                      <span className="text-sm font-semibold">{upsellExpansion["Most Successful Upsell Motions"]["Average Fit Score"]}</span>
                    </div>
                  )}
                  {upsellExpansion["Most Successful Upsell Motions"]["ARR lift"] && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">ARR Lift:</span>
                      <span className="text-sm font-semibold text-green-600">{upsellExpansion["Most Successful Upsell Motions"]["ARR lift"]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {commonPaths && (
              <div>
                <h3 className="font-medium mb-2">Common Expansion Paths</h3>
                <p className="text-gray-700">{commonPaths}</p>
              </div>
            )}

            {featureRequestsArray.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Feature Requests & Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {featureRequestsArray.map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
