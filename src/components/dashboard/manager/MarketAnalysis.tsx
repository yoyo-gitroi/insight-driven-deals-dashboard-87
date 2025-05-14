
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Treemap, 
} from "recharts";

type CRMData = {
  sr_no: number;
  company_name: string;
  size: string;
  deal_name: string;
  deal_stage: string;
  deal_amount: number;
  owner: string;
  close_date: string;
  nba: string;
  signals: string;
  actions: string;
  transcripts: string;
  industry?: string;
  geo?: string;
};

type MarketAnalysisProps = {
  data: CRMData[];
};

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ data }) => {
  // Process industry data for heatmap (represented as a stacked bar chart)
  const industries = Array.from(new Set(data.map(item => item.industry || "Unknown")));
  const stages = Array.from(new Set(data.map(item => item.deal_stage)));
  
  const industryData = industries.map(industry => {
    const result: Record<string, any> = { name: industry };
    
    stages.forEach(stage => {
      const dealsInStageAndIndustry = data.filter(
        deal => deal.deal_stage === stage && (deal.industry || "Unknown") === industry
      );
      result[stage] = dealsInStageAndIndustry.length;
      result[`${stage}Amount`] = dealsInStageAndIndustry.reduce((sum, deal) => sum + deal.deal_amount, 0);
    });
    
    return result;
  });
  
  // Geographic distribution data
  const geoData = Array.from(
    data.reduce((acc, deal) => {
      const geo = deal.geo || "Unknown";
      if (!acc.has(geo)) {
        acc.set(geo, {
          name: geo,
          value: 0,
          amount: 0
        });
      }
      
      const record = acc.get(geo)!;
      record.value += 1;
      record.amount += deal.deal_amount;
      
      return acc;
    }, new Map<string, { name: string; value: number; amount: number }>())
  ).map(([_, value]) => value);
  
  // Company size breakdown
  const sizeData = Array.from(
    data.reduce((acc, deal) => {
      const size = deal.size || "Unknown";
      if (!acc.has(size)) {
        acc.set(size, {
          name: size,
          value: 0,
          amount: 0
        });
      }
      
      const record = acc.get(size)!;
      record.value += 1;
      record.amount += deal.deal_amount;
      
      return acc;
    }, new Map<string, { name: string; value: number; amount: number }>())
  ).map(([_, value]) => value);
  
  // Generate random colors for visualizations
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Helper to format numbers
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  // Format treemap data for better visualization of geographic distribution
  const treeMapData = geoData.map((item, index) => ({
    name: item.name,
    size: item.amount,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Market Analysis</h2>
      
      {/* Industry Heatmap (Stacked Bar Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name: string) => {
                    if (name.includes("Amount")) {
                      return [formatCurrency(value as number), name.replace("Amount", " Value")];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                {stages.map((stage, index) => (
                  <Bar 
                    key={stage} 
                    dataKey={stage} 
                    stackId="a" 
                    fill={COLORS[index % COLORS.length]} 
                    name={stage}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treeMapData}
                dataKey="size"
                ratio={4/3}
                stroke="#fff"
                animationDuration={500}
              >
                {treeMapData.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={item.color} />
                ))}
              </Treemap>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Company Size Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Company Size Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sizeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sizeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (props && props.payload) {
                      const entry = sizeData.find(item => item.name === props.payload.name);
                      return [
                        `${value} deals ($${entry?.amount.toLocaleString()})`,
                        props.payload.name
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
