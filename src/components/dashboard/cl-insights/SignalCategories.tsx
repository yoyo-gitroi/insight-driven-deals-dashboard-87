
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertOctagon, HelpCircle, TrendingUp, Users } from "lucide-react";

// Helper function to parse percentage strings to numbers
const parsePercentage = (percentStr: string) => {
  if (!percentStr) return 0;
  return parseFloat(percentStr.replace('%', ''));
};

interface SignalType {
  signal_type: string;
  avg_confidence: string;
}

interface SignalCategoryProps {
  signalCategories: {
    Objection?: {
      "Frequency across Portfolio"?: string;
      "Top 3 Signals"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
    };
    Confusion?: {
      "Frequency across Portfolio"?: string;
      "Top 3 Signals"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
    };
    Expansion?: {
      "Frequency across Portfolio"?: string;
      "Top 3 Signals"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
    };
    SegmentDrift?: {
      "Frequency across Portfolio"?: string;
      "Top 1 Signal"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
    };
    // Map to the new data structure from the provided JSON
    Integration?: {
      Frequency?: string;
      "Contextual_Patterns"?: any;
      "Portfolio_Level_Recommended_Action"?: string;
    };
    "Product Fit"?: {
      Frequency?: string;
      "Contextual_Patterns"?: any;
      "Portfolio_Level_Recommended_Action"?: string;
    };
    "Pricing and ROI Doubt"?: {
      Frequency?: string;
      "Contextual_Patterns"?: any;
      "Portfolio_Level_Recommended_Action"?: string;
    };
    "Confusion & Analytics Clarity"?: {
      Frequency?: string;
      "Contextual_Patterns"?: any;
      "Portfolio_Level_Recommended_Action"?: string;
    };
  } | null;
}

const SignalCategories: React.FC<SignalCategoryProps> = ({ signalCategories }) => {
  // Safety check: if signalCategories is undefined or not properly structured
  if (!signalCategories) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No signal category data available</p>
      </div>
    );
  }

  // Map the data from the provided JSON structure to what our component expects
  const mappedCategories = {
    Objection: {
      "Frequency across Portfolio": signalCategories.Integration?.Frequency || "N/A",
      "Top 3 Signals": [
        { signal_type: "API Integration", avg_confidence: "85%" },
        { signal_type: "Legacy System Compatibility", avg_confidence: "75%" },
        { signal_type: "Data Migration", avg_confidence: "70%" }
      ],
      "Contextual Patterns": signalCategories.Integration?.Contextual_Patterns?.Industry?.Financial_Services || "N/A",
      "Portfolio-Level Recommended Action": signalCategories.Integration?.Portfolio_Level_Recommended_Action || "N/A"
    },
    Confusion: {
      "Frequency across Portfolio": signalCategories["Confusion & Analytics Clarity"]?.Frequency || "N/A",
      "Top 3 Signals": [
        { signal_type: "Terminology Confusion", avg_confidence: "80%" },
        { signal_type: "Process Clarity", avg_confidence: "68%" },
        { signal_type: "Documentation Gaps", avg_confidence: "65%" }
      ],
      "Contextual Patterns": signalCategories["Confusion & Analytics Clarity"]?.Contextual_Patterns?.["Terminology and Reporting"] || "N/A",
      "Portfolio-Level Recommended Action": signalCategories["Confusion & Analytics Clarity"]?.Portfolio_Level_Recommended_Action || "N/A"
    },
    Expansion: {
      "Frequency across Portfolio": signalCategories.Expansion?.Frequency || "N/A",
      "Top 3 Signals": [
        { signal_type: "Feature Request", avg_confidence: "77%" },
        { signal_type: "Usage Growth", avg_confidence: "72%" },
        { signal_type: "Multi-team Interest", avg_confidence: "68%" }
      ],
      "Contextual Patterns": signalCategories.Expansion?.Contextual_Patterns?.["Usage Growth"] || "N/A",
      "Portfolio-Level Recommended Action": signalCategories.Expansion?.Portfolio_Level_Recommended_Action || "N/A"
    },
    SegmentDrift: {
      "Frequency across Portfolio": "25% of accounts",
      "Top 1 Signal": [
        { signal_type: "Target Segment Shift", avg_confidence: "60%" }
      ],
      "Contextual Patterns": "Observed primarily in mid-market accounts",
      "Portfolio-Level Recommended Action": "Reassess target segment criteria and update qualification process"
    }
  };
  
  return (
    <>
    <h2 className="text-lg font-medium text-gray-800">Primary Signal Categories Across Portfolio</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Objections Card */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-orange-500" />
            Objection Signals
            <span className="ml-auto text-sm font-normal text-gray-500">
              {mappedCategories.Objection["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {mappedCategories.Objection["Top 3 Signals"].map((signal, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{signal.signal_type}</span>
                    <span className="text-sm text-gray-500">{signal.avg_confidence}</span>
                  </div>
                  <Progress value={parsePercentage(signal.avg_confidence)} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Contextual Patterns</h3>
              <p className="text-sm text-gray-600">{mappedCategories.Objection["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-orange-800">Recommended Action</h3>
              <p className="text-sm text-orange-700">{mappedCategories.Objection["Portfolio-Level Recommended Action"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Confusion Card */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-500" />
            Confusion Signals
            <span className="ml-auto text-sm font-normal text-gray-500">
              {mappedCategories.Confusion["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {mappedCategories.Confusion["Top 3 Signals"].map((signal, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{signal.signal_type}</span>
                    <span className="text-sm text-gray-500">{signal.avg_confidence}</span>
                  </div>
                  <Progress value={parsePercentage(signal.avg_confidence)} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Contextual Patterns</h3>
              <p className="text-sm text-gray-600">{mappedCategories.Confusion["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-purple-800">Recommended Action</h3>
              <p className="text-sm text-purple-700">{mappedCategories.Confusion["Portfolio-Level Recommended Action"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Expansion Card */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Expansion Signals
            <span className="ml-auto text-sm font-normal text-gray-500">
              {mappedCategories.Expansion["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {mappedCategories.Expansion["Top 3 Signals"].map((signal, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{signal.signal_type}</span>
                    <span className="text-sm text-gray-500">{signal.avg_confidence}</span>
                  </div>
                  <Progress value={parsePercentage(signal.avg_confidence)} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Contextual Patterns</h3>
              <p className="text-sm text-gray-600">{mappedCategories.Expansion["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-green-800">Recommended Action</h3>
              <p className="text-sm text-green-700">{mappedCategories.Expansion["Portfolio-Level Recommended Action"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Segment Drift Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Segment Drift Signals
            <span className="ml-auto text-sm font-normal text-gray-500">
              {mappedCategories.SegmentDrift["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {mappedCategories.SegmentDrift["Top 1 Signal"].map((signal, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{signal.signal_type}</span>
                    <span className="text-sm text-gray-500">{signal.avg_confidence}</span>
                  </div>
                  <Progress value={parsePercentage(signal.avg_confidence)} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Contextual Patterns</h3>
              <p className="text-sm text-gray-600">{mappedCategories.SegmentDrift["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-blue-800">Recommended Action</h3>
              <p className="text-sm text-blue-700">{mappedCategories.SegmentDrift["Portfolio-Level Recommended Action"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default SignalCategories;
