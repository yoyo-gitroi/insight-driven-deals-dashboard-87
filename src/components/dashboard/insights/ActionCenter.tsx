
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
    }
  ];

  const highPriorityActions = actions.filter(action => action.priority === "high");
  
  // Calculate percentages for visualization
  const total = priorityActions.high + priorityActions.medium + priorityActions.low;
  const highPercentage = total > 0 ? Math.round((priorityActions.high / total) * 100) : 0;
  const mediumPercentage = total > 0 ? Math.round((priorityActions.medium / total) * 100) : 0;
  const lowPercentage = total > 0 ? Math.round((priorityActions.low / total) * 100) : 0;

  return (
    <Card className="mt-6 border-t-4 border-t-indigo-600 shadow-sm">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-indigo-600" />
          Priority Actions
        </CardTitle>
        <CardDescription>
          Recommended next steps to accelerate deals
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Priority chart - 3 columns */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="font-medium mb-4 text-center text-gray-700">Priority Distribution</h3>
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={180}>
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
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Percentage metrics for clarity */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-semibold">High</div>
                <div className="text-sm">{highPercentage}%</div>
              </div>
              <div>
                <div className="font-semibold">Medium</div>
                <div className="text-sm">{mediumPercentage}%</div>
              </div>
              <div>
                <div className="font-semibold">Low</div>
                <div className="text-sm">{lowPercentage}%</div>
              </div>
            </div>
          </div>

          {/* Action list - 9 columns */}
          <div className="col-span-1 md:col-span-9">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCenter;
