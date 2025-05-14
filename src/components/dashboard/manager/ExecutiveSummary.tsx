
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, Pie, 
  Cell, 
  ResponsiveContainer, 
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip
} from "recharts";

// Example data for executive summary visualizations
const goalProgressData = [
  { name: 'Pipeline Goal', value: 85 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];
const RADIAN = Math.PI / 180;

// Custom label for the pie chart
const renderCustomizedLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  innerRadius, 
  outerRadius, 
  percent,
  value,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Deal distribution by size
const dealSizeData = [
  { name: 'Enterprise', value: 1200000 },
  { name: 'Mid-Market', value: 800000 },
  { name: 'SMB', value: 450000 },
];

// Region performance data
const regionData = [
  { name: 'North America', value: 2000000 },
  { name: 'EMEA', value: 1500000 },
  { name: 'APAC', value: 900000 },
  { name: 'LATAM', value: 600000 },
];

// Performance against quarterly target
const quarterlyTargetData = [
  {
    name: 'Q3 Target',
    uv: 85, // percentage achieved
    fill: '#8884d8',
  }
];

// Win rate data
const winRateBySegment = [
  { name: 'Enterprise', rate: 65 },
  { name: 'Mid-Market', rate: 72 },
  { name: 'SMB', rate: 58 },
];

const ExecutiveSummary = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Deal Size Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealSizeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dealSizeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Region Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Q3 Target Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  barSize={20} 
                  data={quarterlyTargetData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="uv"
                    cornerRadius={5}
                  />
                  <Legend iconSize={10} verticalAlign="bottom" height={30} />
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                    fill="#333"
                  >
                    {quarterlyTargetData[0].uv}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Win Rate by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {winRateBySegment.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{segment.name}</span>
                    <span className="text-sm font-mono">{segment.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{
                        width: `${segment.rate}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 mt-2 rounded-full bg-green-500"></div>
                <span>Pipeline grew by 18% quarter-over-quarter</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 mt-2 rounded-full bg-green-500"></div>
                <span>Enterprise segment win rate improved by 7 points</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 mt-2 rounded-full bg-amber-500"></div>
                <span>EMEA deals taking 15% longer to close than average</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 mt-2 rounded-full bg-red-500"></div>
                <span>SMB segment showing 5% decrease in conversion rate</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 mt-2 rounded-full bg-green-500"></div>
                <span>Deal velocity improved 12% for deals over $100k</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
