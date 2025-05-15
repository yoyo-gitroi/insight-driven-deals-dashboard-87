
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie
} from "recharts";

interface ObjectionResolutionTabProps {
  objectionResolutionData: any[];
  upsellOpportunitiesData: any;
}

const ObjectionResolutionTab: React.FC<ObjectionResolutionTabProps> = ({ 
  objectionResolutionData, 
  upsellOpportunitiesData 
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Objection Resolution Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Objection Resolution Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={objectionResolutionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resolution Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {objectionResolutionData.map((item) => (
          <Card key={item.name}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Badge className={`mb-2 ${
                  item.name === "Resolved" ? "bg-green-500" : 
                  item.name === "Partially Resolved" ? "bg-amber-500" :
                  item.name === "In Progress" ? "bg-blue-500" : 
                  "bg-red-500"
                }`}>
                  {item.name}
                </Badge>
                <p className="text-3xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">objections</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Upsell Opportunities Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Upsell Opportunities Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'High', value: upsellOpportunitiesData.high, fill: '#10B981' },
                      { name: 'Medium', value: upsellOpportunitiesData.medium, fill: '#F97316' },
                      { name: 'Low', value: upsellOpportunitiesData.low, fill: '#EF4444' }
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
            <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Badge className="mb-2 bg-blue-500">Total</Badge>
                    <p className="text-2xl font-bold">{upsellOpportunitiesData.total}</p>
                    <p className="text-xs text-muted-foreground">opportunities</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Badge className="mb-2 bg-green-500">Success</Badge>
                    <p className="text-2xl font-bold">{upsellOpportunitiesData.high}</p>
                    <p className="text-xs text-muted-foreground">high receptiveness</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Badge className="mb-2">Rate</Badge>
                    <p className="text-2xl font-bold">
                      {upsellOpportunitiesData.total ? 
                        Math.round((upsellOpportunitiesData.high / upsellOpportunitiesData.total) * 100) : 
                        0}%
                    </p>
                    <p className="text-xs text-muted-foreground">success rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectionResolutionTab;
