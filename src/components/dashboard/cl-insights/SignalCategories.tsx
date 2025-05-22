
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Zap, Info, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SignalType {
  signal: string;
  context: string;
}

interface SignalCategoryData {
  Frequency?: string;
  "Frequency across Portfolio"?: string;
  "Top 3 Signals"?: SignalType[];
  Contextual_Patterns?: any;
  "Contextual Patterns"?: any;
  Portfolio_Level_Recommended_Action?: string;
  "Portfolio-Level Recommended Action"?: string;
}

interface SignalCategoriesProps {
  signalCategories: {
    Integration?: SignalCategoryData;
    "Product Fit"?: SignalCategoryData;
    Expansion?: SignalCategoryData;
    "Confusion & Analytics Clarity"?: SignalCategoryData;
    "Pricing and ROI Doubt"?: SignalCategoryData;
    [key: string]: SignalCategoryData | undefined;
  };
}

const SignalCategories: React.FC<SignalCategoriesProps> = ({ signalCategories }) => {
  if (!signalCategories) {
    return (
      <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-800" />
        <AlertDescription>No signal categories data available.</AlertDescription>
      </Alert>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "integration":
        return <Zap className="h-5 w-5 text-blue-600" />;
      case "product fit":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "expansion":
        return <BarChart2 className="h-5 w-5 text-green-600" />;
      case "pricing and roi doubt":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-purple-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "integration":
        return "bg-blue-50 border-blue-100";
      case "product fit":
        return "bg-amber-50 border-amber-100";
      case "expansion":
        return "bg-green-50 border-green-100";
      case "pricing and roi doubt":
        return "bg-red-50 border-red-100";
      case "confusion & analytics clarity":
        return "bg-purple-50 border-purple-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  const categories = Object.keys(signalCategories);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category) => {
        const categoryData = signalCategories[category];
        if (!categoryData) return null;

        // Handle different property naming conventions
        const frequency = categoryData.Frequency || categoryData["Frequency across Portfolio"] || "No frequency data";
        const contextualPatterns = categoryData.Contextual_Patterns || categoryData["Contextual Patterns"] || {};
        const recommendedAction = categoryData.Portfolio_Level_Recommended_Action || categoryData["Portfolio-Level Recommended Action"] || "No recommended action";

        return (
          <Card key={category} className={`${getCategoryColor(category)}`}>
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {getCategoryIcon(category)}
                    {category}
                  </CardTitle>
                  <CardDescription>
                    <Badge className="mt-2 font-normal">
                      {frequency}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {contextualPatterns && typeof contextualPatterns === 'object' && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Contextual Patterns</h4>
                    <div className="space-y-1">
                      {Object.keys(contextualPatterns).map((key) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}: </span>
                          {contextualPatterns[key] && typeof contextualPatterns[key] === 'object' ? (
                            <ul className="list-disc pl-5 mt-1">
                              {Object.entries(contextualPatterns[key]).map(([subKey, value]) => (
                                <li key={subKey} className="text-sm">
                                  <span className="font-medium">{subKey}:</span> {String(value)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span>{String(contextualPatterns[key])}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold mb-2">Recommended Action</h4>
                  <p className="text-sm">{recommendedAction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SignalCategories;
