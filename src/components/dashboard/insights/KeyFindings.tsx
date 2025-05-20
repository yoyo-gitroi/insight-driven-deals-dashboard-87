
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Database, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeyFindingsProps {
  data: any[];
}

const KeyFindings: React.FC<KeyFindingsProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sample findings (in a real app, these would be extracted from the data)
  const findings = [
    {
      title: "Integration Timeline Concerns",
      description: "Technical stakeholders consistently express concerns about the integration timeline being too aggressive. Consider extending the implementation phase by 2-3 weeks.",
      icon: <Database className="h-6 w-6 text-blue-500" />
    },
    {
      title: "ROI Validation Required",
      description: "Financial decision makers need additional ROI validation. Provide case studies with similar companies showing measurable impact within the first 3 months.",
      icon: <TrendingUp className="h-6 w-6 text-green-500" />
    },
    {
      title: "New Stakeholder Influence",
      description: "IT Security teams have increased influence in the buying process. Prepare security documentation in advance to avoid late-stage objections.",
      icon: <Users className="h-6 w-6 text-purple-500" />
    }
  ];
  
  const nextFinding = () => {
    setActiveIndex((prev) => (prev + 1) % findings.length);
  };
  
  const prevFinding = () => {
    setActiveIndex((prev) => (prev - 1 + findings.length) % findings.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Key Findings</span>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              {activeIndex + 1} / {findings.length}
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={prevFinding}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={nextFinding}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[150px]">
          <div key={activeIndex} className="flex gap-4 animate-fade-in">
            <div className="bg-gray-100 p-3 rounded-full h-fit">
              {findings[activeIndex].icon}
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">{findings[activeIndex].title}</h3>
              <p className="text-muted-foreground">{findings[activeIndex].description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyFindings;
