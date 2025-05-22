
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

const CoachingNeeds = () => {
  // Sample coaching needs data - in a real application, this would come from props or API
  const coachingNeeds = [
    {
      category: "Negotiation Skills",
      description: "Mid-market reps could improve discount structuring and packaging",
      examples: ["ecoATM", "Chatham Bars Inn"],
      priority: "high"
    },
    {
      category: "Solution Selling",
      description: "Addressing complex product fit with large enterprise clients",
      examples: ["Cognizant", "Amadeus"],
      priority: "high"
    },
    {
      category: "Technical Integration",
      description: "Enhancing ability to discuss API integration options",
      examples: ["BigBasket", "Yatra"],
      priority: "medium"
    },
    {
      category: "Executive Engagement",
      description: "Improving C-level interactions and value presentations",
      examples: ["Iron Mountain", "Mastercard"],
      priority: "medium"
    }
  ];

  // Function to get priority icon and color
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { icon: <AlertCircle className="h-5 w-5" />, color: 'text-red-500', bg: 'bg-red-50' };
      case 'medium':
        return { icon: <HelpCircle className="h-5 w-5" />, color: 'text-amber-500', bg: 'bg-amber-50' };
      default:
        return { icon: <CheckCircle className="h-5 w-5" />, color: 'text-green-500', bg: 'bg-green-50' };
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">Coaching Needs Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {coachingNeeds.map((need, index) => {
            const { icon, color, bg } = getPriorityInfo(need.priority);
            
            return (
              <div key={index} className={`p-4 rounded-lg ${bg} border border-${color.replace('text-', '')}-100`}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-1 ${color}`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{need.category}</h3>
                    <p className="text-sm text-gray-700 mt-1">{need.description}</p>
                    
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500">Example Accounts:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {need.examples.map((example, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 text-xs bg-white rounded-full border border-gray-200"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachingNeeds;
