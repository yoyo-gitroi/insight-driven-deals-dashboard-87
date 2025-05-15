
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, AlertCircle, TrendingUp } from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar,
  RadialBarChart, RadialBar,
  ScatterChart, Scatter
} from "recharts";

// Color constants
const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8E9196'];

interface SignalAnalysisTabProps {
  signalTypeData: any[];
  objectionTypeData: any[];
  confidenceData: any[];
  dealValueBySignalData: any[];
}

const SignalAnalysisTab: React.FC<SignalAnalysisTabProps> = ({
  signalTypeData,
  objectionTypeData,
  confidenceData,
  dealValueBySignalData
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Signal Type Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartPie className="h-5 w-5" />
            Signal Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={signalTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {signalTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Objection Types Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Objection Types
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={objectionTypeData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value: number) => [value, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Count" fill="#D946EF" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Signal Confidence Gauge */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Signal Confidence Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              innerRadius={20} 
              outerRadius={140} 
              barSize={10} 
              data={confidenceData}
            >
              <RadialBar
                background
                dataKey="value"
                label={{ position: 'insideStart', fill: '#fff' }}
              />
              <Legend 
                iconSize={10} 
                layout="vertical" 
                verticalAlign="middle" 
                wrapperStyle={{ lineHeight: '40px' }}
              />
              <Tooltip formatter={(value: number) => [value, 'Count']} />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Deal Value by Signal Heat Map (Simplified as Scatter) */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Deal Value by Signal Type
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Index" unit="" />
              <YAxis type="number" dataKey="y" name="Deal Amount" unit="K" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                formatter={(value: number, name: string, props: any) => {
                  if (name === 'Deal Amount') return [`$${value * 1000}`, name];
                  return [value, name];
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border rounded shadow-sm">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p>Signal: {payload[0].payload.signalType}</p>
                        <p>Amount: ${payload[0].payload.value.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Deal Values" data={dealValueBySignalData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalAnalysisTab;
