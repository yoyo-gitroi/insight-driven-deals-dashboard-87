
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, ListChecks } from "lucide-react";
import { SECTION_COLORS } from "../objections/objectionConstants";

interface StrategicActionsProps {
  strategicActions: {
    "Top 5 Prioritized Actions for Sales Leadership"?: string[];
    "top_prioritized_actions"?: string[];
    "Process Improvements"?: string;
    "process_improvements"?: string;
    "Training & Coaching Plans"?: string;
    "training_and_coaching_plans"?: string;
    "Measurement Framework"?: string;
    "measurement_framework"?: string;
  };
  contentRecommendations: {
    "Case Studies"?: string[];
    "needed"?: string;
    "Content Gaps by Objection Type"?: string;
    "Content Gaps"?: string;
    "New Content Ideas Tied to Portfolio Signals"?: string;
    "New Content Ideas"?: string;
  };
}

const StrategicActions: React.FC<StrategicActionsProps> = ({ strategicActions, contentRecommendations }) => {
  // Handle different data formats and provide fallbacks
  const prioritizedActions = strategicActions["Top 5 Prioritized Actions for Sales Leadership"] || 
                            strategicActions["top_prioritized_actions"] || [];
  
  const processImprovements = strategicActions["Process Improvements"] || 
                              strategicActions["process_improvements"] || "";
  
  const trainingPlans = strategicActions["Training & Coaching Plans"] || 
                        strategicActions["training_and_coaching_plans"] || "";
  
  const measurementFramework = strategicActions["Measurement Framework"] || 
                              strategicActions["measurement_framework"] || "";
  
  // Content recommendations
  const caseStudies = contentRecommendations["Case Studies"] || [];
  const contentNeeded = contentRecommendations["needed"] || "";
  const contentGaps = contentRecommendations["Content Gaps by Objection Type"] || 
                      contentRecommendations["Content Gaps"] || "";
  const contentIdeas = contentRecommendations["New Content Ideas Tied to Portfolio Signals"] || 
                      contentRecommendations["New Content Ideas"] || "";
  
  return (
    <div className="space-y-6">
      {/* Strategic Actions Card */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.strategic }}>
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
            {prioritizedActions.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-4">Top Prioritized Actions</h3>
                <ol className="space-y-3">
                  {prioritizedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-3 bg-indigo-50/50 p-3 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{action}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Process Improvements
                </h3>
                <p className="text-sm text-gray-700">{processImprovements}</p>
              </div>
              
              <div className="border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Training & Coaching
                </h3>
                <p className="text-sm text-gray-700">{trainingPlans}</p>
              </div>
              
              <div className="border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Measurement Framework
                </h3>
                <p className="text-sm text-gray-700">{measurementFramework}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Recommendations Card */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.content }}>
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
            {contentNeeded && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">{contentNeeded}</p>
              </div>
            )}

            {caseStudies.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Case Studies Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudies.map((caseStudy, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                      {caseStudy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentGaps && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Content Gaps</h3>
                  <p className="text-sm text-gray-700">{contentGaps}</p>
                </div>
              )}
              
              {contentIdeas && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">New Content Ideas</h3>
                  <p className="text-sm text-gray-700">{contentIdeas}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicActions;
