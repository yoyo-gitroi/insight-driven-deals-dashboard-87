
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, TrendingUp } from "lucide-react";
import { SECTION_COLORS } from "../objections/objectionConstants";

interface KeyFinding {
  title: string;
  insight: string;
}

interface ExecutiveSummaryProps {
  executiveSummary: {
    "Key Findings": KeyFinding[];
    "Strategic Context": {
      title: string;
      insight: string;
    };
    "Critical Red Flags": {
      title: string;
      insight: string;
    };
    "Aggregate Health Metrics"?: {
      "Average Win Probability": string;
      "Combined ARR Health": string;
      "Pipeline Coverage vs. Target": string;
    };
  };
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ executiveSummary }) => {
  return (
    <div className="space-y-6">
      {/* Key Findings Card */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.executive }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: SECTION_COLORS.executive }} />
            Key Portfolio Findings
          </CardTitle>
          <CardDescription>Critical insights across the company portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {executiveSummary["Key Findings"] && executiveSummary["Key Findings"].map((finding, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{finding.title}</h3>
                <p className="text-gray-700">{finding.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Context Card */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.patterns }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" style={{ color: SECTION_COLORS.patterns }} />
            Strategic Context
          </CardTitle>
          <CardDescription>Market forces and external factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            {executiveSummary["Strategic Context"] && (
              <>
                <h3 className="text-lg font-medium mb-2">{executiveSummary["Strategic Context"].title}</h3>
                <p className="text-gray-700">{executiveSummary["Strategic Context"].insight}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Critical Red Flags Card */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.strategic }}>
        <CardHeader className="bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Critical Red Flags
              </CardTitle>
              <CardDescription>Urgent issues requiring attention</CardDescription>
            </div>
            <Badge className="bg-red-500">High Priority</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {executiveSummary["Critical Red Flags"] && (
            <div className="p-4 bg-red-50 border-l-2 border-red-500 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{executiveSummary["Critical Red Flags"].title}</h3>
              <p className="text-gray-700">{executiveSummary["Critical Red Flags"].insight}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Metrics Card (if available) */}
      {executiveSummary["Aggregate Health Metrics"] && (
        <Card>
          <CardHeader>
            <CardTitle>Aggregate Health Metrics</CardTitle>
            <CardDescription>Key performance indicators across the portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border p-4 rounded-lg bg-blue-50">
                <h3 className="text-sm font-medium mb-2">Average Win Probability</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {executiveSummary["Aggregate Health Metrics"]["Average Win Probability"]}
                </p>
              </div>
              
              <div className="border p-4 rounded-lg bg-green-50">
                <h3 className="text-sm font-medium mb-2">Combined ARR Health</h3>
                <p className="text-sm text-gray-700">
                  {executiveSummary["Aggregate Health Metrics"]["Combined ARR Health"]}
                </p>
              </div>
              
              <div className="border p-4 rounded-lg bg-amber-50">
                <h3 className="text-sm font-medium mb-2">Pipeline Coverage</h3>
                <p className="text-sm text-gray-700">
                  {executiveSummary["Aggregate Health Metrics"]["Pipeline Coverage vs. Target"]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExecutiveSummary;
