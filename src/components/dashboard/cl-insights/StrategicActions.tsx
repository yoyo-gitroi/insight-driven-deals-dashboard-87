
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, ListChecks } from "lucide-react";

interface StrategicActionsProps {
  strategicActions: {
    "Top 5 Prioritized Actions for Sales Leadership": string[];
    "Process Improvements": string;
    "Training & Coaching Plans": string;
    "Measurement Framework": string;
  };
  contentRecommendations: {
    "Case Studies": string[];
    "Content Gaps by Objection Type": string;
    "New Content Ideas Tied to Portfolio Signals": string;
  };
}

const StrategicActions: React.FC<StrategicActionsProps> = ({ strategicActions, contentRecommendations }) => {
  return (
    <div className="space-y-6">
      {/* Strategic Actions Card */}
      <Card className="border-indigo-100">
        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-600" />
                Strategic Actions
              </CardTitle>
              <CardDescription>Prioritized next steps for sales leadership</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-4">Top 5 Prioritized Actions</h3>
              <ol className="space-y-3">
                {strategicActions["Top 5 Prioritized Actions for Sales Leadership"].map((action, index) => (
                  <li key={index} className="flex items-start gap-3 bg-indigo-50/50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{action}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Process Improvements
                </h3>
                <p className="text-sm text-gray-700">{strategicActions["Process Improvements"]}</p>
              </div>
              
              <div className="border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Training & Coaching
                </h3>
                <p className="text-sm text-gray-700">{strategicActions["Training & Coaching Plans"]}</p>
              </div>
              
              <div className="border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Measurement Framework
                </h3>
                <p className="text-sm text-gray-700">{strategicActions["Measurement Framework"]}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Recommendations Card */}
      <Card className="border-green-100">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Content & Collateral Recommendations
              </CardTitle>
              <CardDescription>Resource needs identified from conversation signals</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Case Studies Needed</h3>
              <div className="flex flex-wrap gap-2">
                {contentRecommendations["Case Studies"].map((caseStudy, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                    {caseStudy}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Content Gaps by Objection</h3>
                <p className="text-sm text-gray-700">{contentRecommendations["Content Gaps by Objection Type"]}</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">New Content Ideas</h3>
                <p className="text-sm text-gray-700">{contentRecommendations["New Content Ideas Tied to Portfolio Signals"]}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicActions;
