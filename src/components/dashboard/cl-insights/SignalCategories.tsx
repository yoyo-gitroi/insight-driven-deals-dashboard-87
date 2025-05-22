
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertOctagon, HelpCircle, TrendingUp, Users } from "lucide-react";
import { SECTION_COLORS } from "../objections/objectionConstants";

// Helper function to parse percentage strings to numbers
const parsePercentage = (percentStr: string) => {
  if (!percentStr) return 0;
  
  // If it's already a number, return it
  if (typeof percentStr === 'number') return percentStr;
  
  // Try to extract percentage from string
  const match = percentStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

interface SignalType {
  signal_type?: string;
  avg_confidence?: string;
}

interface SignalCategoryProps {
  signalCategories: {
    Objection?: {
      "Frequency across Portfolio"?: string;
      frequency?: string;
      "Top 3 Signals"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
      insight?: string;
      patterns?: any;
      recommended_action?: string;
    };
    Confusion?: {
      "Frequency across Portfolio"?: string;
      frequency?: string;
      "Top 3 Signals"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
      insight?: string;
      patterns?: any;
      recommended_action?: string;
    };
    Expansion?: {
      "Frequency across Portfolio"?: string;
      frequency?: string;
      "Top 3 Signals"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
      insight?: string;
      patterns?: any;
      recommended_action?: string;
    };
    SegmentDrift?: {
      "Frequency across Portfolio"?: string;
      "Top 1 Signal"?: SignalType[];
      "Contextual Patterns"?: string;
      "Portfolio-Level Recommended Action"?: string;
    };
  };
}

const SignalCategories: React.FC<SignalCategoryProps> = ({ signalCategories }) => {
  // Safety check for undefined data
  if (!signalCategories) {
    return <div>No signal data available</div>;
  }

  const objection = signalCategories.Objection || {};
  const confusion = signalCategories.Confusion || {};
  const expansion = signalCategories.Expansion || {};
  const segmentDrift = signalCategories.SegmentDrift || {};
  
  // Create mock signals when not available
  const createMockSignals = (category: string) => {
    return [{
      signal_type: `${category} Type`,
      avg_confidence: "75%"
    }];
  };
  
  // Extract objection data with fallbacks
  const objectionFrequency = objection.frequency || objection["Frequency across Portfolio"] || "Data not available";
  const objectionInsight = objection.insight || "No insight data available";
  const objectionSignals = objection["Top 3 Signals"] || createMockSignals("Objection");
  const objectionAction = objection.recommended_action || objection["Portfolio-Level Recommended Action"] || "No recommendation available";
  
  // Extract confusion data with fallbacks
  const confusionFrequency = confusion.frequency || confusion["Frequency across Portfolio"] || "Data not available";
  const confusionInsight = confusion.insight || "No insight data available";
  const confusionSignals = confusion["Top 3 Signals"] || createMockSignals("Confusion");
  const confusionAction = confusion.recommended_action || confusion["Portfolio-Level Recommended Action"] || "No recommendation available";
  
  // Extract expansion data with fallbacks
  const expansionFrequency = expansion.frequency || expansion["Frequency across Portfolio"] || "Data not available";
  const expansionInsight = expansion.insight || "No insight data available";
  const expansionSignals = expansion["Top 3 Signals"] || createMockSignals("Expansion");
  const expansionAction = expansion.recommended_action || expansion["Portfolio-Level Recommended Action"] || "No recommendation available";

  return (
    <>
    <h2 className="text-lg font-medium text-gray-800">Primary Signal Categories Across Portfolio</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Objections Card */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.signals }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5" style={{ color: SECTION_COLORS.signals }} />
            Objection Signals
            <span className="ml-auto text-sm font-normal text-gray-500">
              {objectionFrequency}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-700">{objectionInsight}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Industry Patterns</h3>
              {objection.patterns && objection.patterns.Industry ? (
                <p className="text-sm text-gray-600">{objection.patterns.Industry}</p>
              ) : (
                <p className="text-sm text-gray-600">No pattern data available</p>
              )}
            </div>
            
            <div className="bg-orange-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-orange-800">Recommended Action</h3>
              <p className="text-sm text-orange-700">{objectionAction}</p>
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
              {confusionFrequency}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-700">{confusionInsight}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Industry Patterns</h3>
              {confusion.patterns && confusion.patterns.Industry ? (
                <p className="text-sm text-gray-600">{confusion.patterns.Industry}</p>
              ) : (
                <p className="text-sm text-gray-600">No pattern data available</p>
              )}
            </div>
            
            <div className="bg-purple-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-purple-800">Recommended Action</h3>
              <p className="text-sm text-purple-700">{confusionAction}</p>
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
              {expansionFrequency}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-700">{expansionInsight}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Company Size Patterns</h3>
              {expansion.patterns && expansion.patterns["Company Size"] ? (
                <p className="text-sm text-gray-600">{expansion.patterns["Company Size"]}</p>
              ) : (
                <p className="text-sm text-gray-600">No pattern data available</p>
              )}
            </div>
            
            <div className="bg-green-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1 text-green-800">Recommended Action</h3>
              <p className="text-sm text-green-700">{expansionAction}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Portfolio Insights Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Portfolio Signal Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Signal Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Objection Signals</span>
                  <span>70-90%</span>
                </div>
                <Progress value={80} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>Expansion Signals</span>
                  <span>~85%</span>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>Confusion Signals</span>
                  <span>~60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
            
            <div className="p-4 border border-blue-100 rounded-lg">
              <h3 className="font-medium mb-2">Key Takeaways</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Integration and product fit objections are most prevalent</li>
                <li>Strong expansion opportunities identified but low conversion</li>
                <li>Confusion about terminology impacts deal velocity</li>
                <li>Technical enablement is a critical priority</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default SignalCategories;
