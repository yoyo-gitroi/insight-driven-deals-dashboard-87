
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Flag } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ActionCenterProps {
  priorityActions: {
    high: number;
    medium: number;
    low: number;
    actions?: {
      type: string;
      description: string;
      priority: "high" | "medium" | "low";
    }[];
  };
}

const ActionCenter: React.FC<ActionCenterProps> = ({ priorityActions }) => {
  // Sample actions if none provided
  const actions = priorityActions.actions || [
    {
      type: "Educate",
      description: "Schedule product demo focusing on integration capabilities",
      priority: "high"
    },
    {
      type: "Reframe",
      description: "Address pricing objection by highlighting ROI calculation",
      priority: "high"
    },
    {
      type: "Follow Up",
      description: "Check in on stakeholder feedback from technical review",
      priority: "medium"
    }
  ];

  const highPriorityActions = actions.filter(action => action.priority === "high");
  
  // Calculate percentages for the progress bars
  const totalActions = priorityActions.high + priorityActions.medium + priorityActions.low;
  const highPercentage = totalActions > 0 ? (priorityActions.high / totalActions) * 100 : 0;
  const mediumPercentage = totalActions > 0 ? (priorityActions.medium / totalActions) * 100 : 0;
  const lowPercentage = totalActions > 0 ? (priorityActions.low / totalActions) * 100 : 0;
  
  return (
    <Card className="border-t-4 border-t-indigo-600 shadow-sm">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Flag className="h-5 w-5 text-indigo-600" />
          Priority Actions
        </CardTitle>
        <CardDescription>
          Recommended next steps to accelerate deals
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Priority distribution visualization */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Priority Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs mb-1">
              <span>High Priority</span>
              <span className="font-medium">{highPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={highPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
            
            <div className="flex justify-between text-xs mb-1">
              <span>Medium Priority</span>
              <span className="font-medium">{mediumPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={mediumPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-amber-500" />
            
            <div className="flex justify-between text-xs mb-1">
              <span>Low Priority</span>
              <span className="font-medium">{lowPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={lowPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
          </div>
        </div>
        
        {/* Action list */}
        <div>
          <h3 className="font-medium mb-4 text-gray-700">High Priority Actions</h3>
          <div className="space-y-3">
            {highPriorityActions.map((action, index) => (
              <Card key={index} className="bg-amber-50 border-amber-200 hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2 bg-amber-500">{action.type}</Badge>
                      <p className="text-sm text-gray-700">{action.description}</p>
                    </div>
                    <Button size="sm" variant="outline" className="flex gap-1 mt-1 border-amber-300 text-amber-700 hover:bg-amber-100">
                      <CheckCircle className="h-4 w-4" /> Mark Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {highPriorityActions.length === 0 && (
              <div className="p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-sm text-muted-foreground">No high priority actions at this time.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCenter;
