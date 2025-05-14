
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
};

interface MarketAnalysisProps {
  data: CRMData[];
}

const COLORS = [
  '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', 
  '#a4de6c', '#d0ed57', '#ffc658', '#ff8042', 
  '#ff6361', '#bc5090', '#58508d'
];

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ data }) => {
  // Company size breakdown
  const sizeBreakdown = data.reduce((acc, deal) => {
    const size = deal.size || 'Unknown';
    
    if (!acc[size]) {
      acc[size] = {
        name: size,
        dealCount: 0,
        totalValue: 0
      };
    }
    
    acc[size].dealCount += 1;
    acc[size].totalValue += deal.deal_amount || 0;
    
    return acc;
  }, {} as Record<string, any>);
  
  const sizeBreakdownArray = Object.values(sizeBreakdown)
    .map(item => ({
      ...item,
      averageValue: item.dealCount > 0 ? item.totalValue / item.dealCount : 0
    }))
    .sort((a, b) => b.dealCount - a.dealCount);
  
  // Industry heatmap data (simulated)
  const industryData = [
    { name: 'Technology', discovery: 10, qualification: 7, implementation: 4 },
    { name: 'Healthcare', discovery: 6, qualification: 5, implementation: 2 },
    { name: 'Finance', discovery: 8, qualification: 4, implementation: 3 },
    { name: 'Retail', discovery: 5, qualification: 3, implementation: 1 },
    { name: 'Manufacturing', discovery: 4, qualification: 2, implementation: 3 }
  ];
  
  // Geographic distribution (simulated)
  const geoData = [
    { name: 'North America', value: 45 },
    { name: 'Europe', value: 25 },
    { name: 'Asia Pacific', value: 18 },
    { name: 'Latin America', value: 8 },
    { name: 'Middle East', value: 4 }
  ];
  
  // Market opportunity data for treemap
  const marketOpportunityData = [
    { name: 'Enterprise SaaS', size: 5000000, color: '#8884d8' },
    { name: 'SMB Solutions', size: 2500000, color: '#83a6ed' },
    { name: 'AI Services', size: 4000000, color: '#8dd1e1' },
    { name: 'Data Analytics', size: 3000000, color: '#82ca9d' },
    { name: 'Security', size: 3500000, color: '#ffc658' }
  ];
  
  // Custom tooltip for industry heatmap
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataKey = payload[0].dataKey;
      const value = payload[0].value;
      
      let stageText = dataKey;
      if (typeof stageText === 'string') {
        if (stageText.includes('discovery')) {
          stageText = 'Discovery';
        } else if (stageText.includes('qualification')) {
          stageText = 'Qualification';
        } else if (stageText.includes('implementation')) {
          stageText = 'Implementation';
        }
      }
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md">
          <p className="font-semibold">{label}</p>
          <p>{`${stageText}: ${value} deals`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Custom treemap content
  const TreemapCustomContent = (props: any) => {
    const { x, y, width, height, name, size } = props;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{ fill: props.fill, stroke: '#fff', strokeWidth: 2 }}
        />
        {width > 50 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              fill="#fff"
              fontSize={14}
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
            >
              ${(Number(size) / 1000000).toFixed(1)}M
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Industry Deal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={industryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={customTooltip} />
                  <Legend />
                  <Bar dataKey="discovery" stackId="a" fill="#8884d8" />
                  <Bar dataKey="qualification" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="implementation" stackId="a" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Size Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sizeBreakdownArray}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'dealCount') return [value, 'Deal Count'];
                    if (name === 'averageValue') return [`$${Number(value).toLocaleString()}`, 'Avg Deal Value'];
                    return [value, name];
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="dealCount" name="Deal Count" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="averageValue" name="Avg Deal Value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Market Opportunity Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={marketOpportunityData}
                  dataKey="size"
                  aspectRatio={4/3}
                  stroke="#fff"
                  fill="#8884d8"
                  content={<TreemapCustomContent />}
                >
                  {marketOpportunityData.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={item.color} />
                  ))}
                </Treemap>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketAnalysis;
