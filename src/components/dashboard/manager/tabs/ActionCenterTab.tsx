
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Flag } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie
} from "recharts";

interface ActionCenterTabProps {
  actionCenterData: any[];
  priorityActionsData: any;
}

const ActionCenterTab: React.FC<ActionCenterTabProps> = ({ actionCenterData, priorityActionsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={actionCenterData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Count" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Action Priority List */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Actions</CardTitle>
        </CardHeader>
        <CardContent className="h-80 overflow-auto">
          <div className="space-y-4">
            {actionCenterData.map((action) => (
              <div 
                key={action.name}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{action.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {action.value} action{action.value !== 1 ? 's' : ''} required
                  </p>
                </div>
                <Badge 
                  variant={action.value > 5 ? "default" : "outline"}
                  className={action.value > 5 ? "bg-amber-500" : ""}
                >
                  {action.value > 5 ? "High" : "Normal"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Priority Actions Overview */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Priority Actions Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'High Priority', value: priorityActionsData.high, fill: '#F97316' },
                    { name: 'Medium Priority', value: priorityActionsData.medium, fill: '#FCD34D' }
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
            
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <h4 className="text-lg font-medium">Action Priority Summary</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  High priority actions require immediate attention to avoid potential deal blockers.
                  Medium priority actions should be planned within the next week.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="text-amber-600 font-medium">High</div>
                  <div className="text-2xl font-bold">{priorityActionsData.high}</div>
                  <div className="text-xs text-amber-600">Urgent Actions</div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                  <div className="text-yellow-600 font-medium">Medium</div>
                  <div className="text-2xl font-bold">{priorityActionsData.medium}</div>
                  <div className="text-xs text-yellow-600">Scheduled Actions</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionCenterTab;
