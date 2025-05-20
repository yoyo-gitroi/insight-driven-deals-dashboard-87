
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Flag, CheckCircle } from "lucide-react";

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
    },
    {
      type: "Prepare",
      description: "Create tailored proposal highlighting key use cases",
      priority: "medium"
    }
  ];

  const highPriorityActions = actions.filter(action => action.priority === "high");

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Priority Actions
        </CardTitle>
        <CardDescription>
          Recommended next steps to accelerate deals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Priority chart */}
          <div className="col-span-1">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'High Priority', value: priorityActions.high, fill: '#FF9800' },
                    { name: 'Medium Priority', value: priorityActions.medium, fill: '#FFC107' },
                    { name: 'Low Priority', value: priorityActions.low, fill: '#2196F3' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Action list */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-medium mb-4">High Priority Actions</h3>
            <div className="space-y-3">
              {highPriorityActions.map((action, index) => (
                <Card key={index} className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 bg-amber-500">{action.type}</Badge>
                        <p className="text-sm">{action.description}</p>
                      </div>
                      <Button size="sm" variant="outline" className="flex gap-1">
                        <CheckCircle className="h-4 w-4" /> Mark Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {highPriorityActions.length === 0 && (
                <p className="text-sm text-muted-foreground">No high priority actions at this time.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCenter;
