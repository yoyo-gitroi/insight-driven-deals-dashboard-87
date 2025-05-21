
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
    Objection: {
      "Frequency across Portfolio": string;
      "Top 3 Signals": SignalType[];
      "Contextual Patterns": string;
      "Portfolio-Level Recommended Action": string;
    };
    Confusion: {
      "Frequency across Portfolio": string;
      "Top 3 Signals": SignalType[];
      "Contextual Patterns": string;
      "Portfolio-Level Recommended Action": string;
    };
    Expansion: {
      "Frequency across Portfolio": string;
      "Top 3 Signals": SignalType[];
      "Contextual Patterns": string;
      "Portfolio-Level Recommended Action": string;
    };
    SegmentDrift: {
      "Frequency across Portfolio": string;
      "Top 1 Signal": SignalType[];
      "Contextual Patterns": string;
      "Portfolio-Level Recommended Action": string;
    };
  };
}

const SignalCategories: React.FC<SignalCategoryProps> = ({ signalCategories }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Primary Signal Categories Across Portfolio</h2>
      
      {/* Objections Card */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-orange-500" />
            Objection Signals
            <span className="ml-auto text-sm font-normal text-gray-500">
              {signalCategories.Objection["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {signalCategories.Objection["Top 3 Signals"].map((signal, idx) => (
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
              <p className="text-sm text-gray-600">{signalCategories.Objection["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-orange-800">Recommended Action</h3>
              <p className="text-sm text-orange-700">{signalCategories.Objection["Portfolio-Level Recommended Action"]}</p>
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
              {signalCategories.Confusion["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {signalCategories.Confusion["Top 3 Signals"].map((signal, idx) => (
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
              <p className="text-sm text-gray-600">{signalCategories.Confusion["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-purple-800">Recommended Action</h3>
              <p className="text-sm text-purple-700">{signalCategories.Confusion["Portfolio-Level Recommended Action"]}</p>
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
              {signalCategories.Expansion["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {signalCategories.Expansion["Top 3 Signals"].map((signal, idx) => (
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
              <p className="text-sm text-gray-600">{signalCategories.Expansion["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-green-800">Recommended Action</h3>
              <p className="text-sm text-green-700">{signalCategories.Expansion["Portfolio-Level Recommended Action"]}</p>
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
              {signalCategories.SegmentDrift["Frequency across Portfolio"]}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {signalCategories.SegmentDrift["Top 1 Signal"].map((signal, idx) => (
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
              <p className="text-sm text-gray-600">{signalCategories.SegmentDrift["Contextual Patterns"]}</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-blue-800">Recommended Action</h3>
              <p className="text-sm text-blue-700">{signalCategories.SegmentDrift["Portfolio-Level Recommended Action"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalCategories;
