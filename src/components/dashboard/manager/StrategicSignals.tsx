
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractObjectionTypes, extractConfidenceData, extractActionTypes, safeJsonParse } from "@/lib/utils";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Scatter
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

interface StrategicSignalsProps {
  data: CRMData[];
}

const COLORS = [
  "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", 
  "#a4de6c", "#d0ed57", "#ffc658", "#ff8042", 
  "#ff6361", "#bc5090", "#58508d"
];

const StrategicSignals: React.FC<StrategicSignalsProps> = ({ data }) => {
  // Extract objection types
  const objectionsWithSignals = data.filter(deal => deal.signals);
  const objectionTypes = extractObjectionTypes(objectionsWithSignals);
  
  // Extract confidence data
  const confidenceData = extractConfidenceData(objectionsWithSignals);
  
  // Extract action types
  const dealsWithActions = data.filter(deal => deal.actions);
  const actionTypes = extractActionTypes(dealsWithActions);
  
  // Process signal types for distribution
  const signalTypeData = data.reduce((acc, deal) => {
    try {
      const signals = safeJsonParse(deal.signals, { signals: [] });
      const signalsArray = signals.signals || [];
      
      signalsArray.forEach((signal: any) => {
        if (signal.signal_type) {
          let type = 'Other';
          
          if (signal.signal_type.includes('Objection')) {
            type = 'Objection';
          } else if (signal.signal_type.includes('Expansion') || signal.signal_type.includes('Opportunity')) {
            type = 'Opportunity';
          } else if (signal.signal_type.includes('Confusion')) {
            type = 'Confusion Point';
          } else if (signal.signal_type.includes('External')) {
            type = 'External Factor';
          }
          
          acc[type] = (acc[type] || 0) + 1;
        }
      });
    } catch (e) {
      console.error('Error processing signal type data:', e);
    }
    
    return acc;
  }, {} as Record<string, number>);
  
  const signalTypeArray = Object.entries(signalTypeData).map(([name, value]) => ({
    name,
    value
  }));
  
  // Signal correlation data (simulated)
  const signalCorrelationData = [
    { name: 'Pricing Objection', dealCount: 15, conversionRate: 40, confidenceScore: 65 },
    { name: 'Feature Request', dealCount: 12, conversionRate: 75, confidenceScore: 80 },
    { name: 'Competitive Concern', dealCount: 18, conversionRate: 35, confidenceScore: 55 },
    { name: 'Implementation Timeline', dealCount: 10, conversionRate: 60, confidenceScore: 72 },
    { name: 'Security Requirement', dealCount: 8, conversionRate: 50, confidenceScore: 68 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Strategic Signals</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Objection Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={objectionTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {objectionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} instances`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Signal Confidence Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={confidenceData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {confidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      value="Confidence Levels"
                      position="center"
                      className="text-lg font-medium"
                    />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} signals`, 'Count']} />
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
            <CardTitle>Signal Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={signalTypeArray}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {signalTypeArray.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Action Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={actionTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {actionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Signal Correlation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={signalCorrelationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip formatter={(value, name) => {
                  if (name === 'conversionRate') return [`${value}%`, 'Conversion Rate'];
                  if (name === 'dealCount') return [`${value} deals`, 'Deal Count'];
                  if (name === 'confidenceScore') return [`${value}%`, 'Confidence Score'];
                  return [value, name];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="dealCount" name="Deal Count" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="conversionRate" name="Conversion Rate" fill="#82ca9d" />
                <Scatter yAxisId="right" dataKey="confidenceScore" name="Confidence Score" fill="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicSignals;
