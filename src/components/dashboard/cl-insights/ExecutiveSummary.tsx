
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, BarChart2, AlertTriangle } from "lucide-react";

interface ExecutiveSummaryProps {
  executiveSummary: {
    "Key Findings": string[];
    "Aggregate Health Metrics": {
      "Average Win Probability": string;
      "Combined ARR Health": string;
      "Pipeline Coverage vs. Target": string;
    };
    "Strategic Context": {
      "Market Forces": string;
      "External Events": string;
    };
    "Critical Red Flags": string[];
  };
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ executiveSummary }) => {
  return (
    <div className="space-y-6">
      {/* Health Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
              <BarChart2 className="h-5 w-5" />
              Win Probability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1">
              <p className="text-3xl font-bold text-blue-900">{executiveSummary["Aggregate Health Metrics"]["Average Win Probability"]}</p>
              <p className="text-sm text-blue-700 mt-2">Strong in early stage, risky at integration/budget phase</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
              <TrendingUp className="h-5 w-5" />
              ARR Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1">
              <p className="text-xl font-bold text-emerald-900 leading-tight">Strong Early, At Risk Later</p>
              <p className="text-sm text-emerald-700 mt-2">Integration & budget concerns affecting late-stage deals</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              Pipeline Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1">
              <p className="text-xl font-bold text-amber-900 leading-tight">Insufficient Data</p>
              <p className="text-sm text-amber-700 mt-2">Recommend integrating financial system data for accuracy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Key Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {executiveSummary["Key Findings"].map((finding, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700">{finding}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Strategic Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Strategic Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Market Forces</h3>
              <p className="text-gray-700">{executiveSummary["Strategic Context"]["Market Forces"]}</p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">External Events</h3>
              <p className="text-gray-700">{executiveSummary["Strategic Context"]["External Events"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Red Flags */}
      <Card className="border-red-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Red Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {executiveSummary["Critical Red Flags"].map((flag, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-700">{flag}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
