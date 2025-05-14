
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { safeJsonParse } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList,
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

interface TeamPerformanceProps {
  data: CRMData[];
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ data }) => {
  // Process data by AE
  const aePerformance = data.reduce((acc, deal) => {
    const owner = deal.owner || 'Unknown';
    
    if (!acc[owner]) {
      acc[owner] = {
        name: owner,
        totalDeals: 0,
        dealValue: 0,
        discovery: 0,
        qualification: 0,
        implementation: 0,
        closedWon: 0,
        objections: 0,
        resolvedObjections: 0
      };
    }
    
    acc[owner].totalDeals += 1;
    acc[owner].dealValue += deal.deal_amount || 0;
    
    // Count deals by stage
    const stage = (deal.deal_stage || '').toLowerCase();
    if (stage === 'discovery') {
      acc[owner].discovery += 1;
    } else if (stage === 'qualification') {
      acc[owner].qualification += 1;
    } else if (stage === 'implementation') {
      acc[owner].implementation += 1;
    } else if (stage === 'closed won') {
      acc[owner].closedWon += 1;
    }
    
    // Process objections from signals
    try {
      const signals = safeJsonParse(deal.signals, {});
      const signalsArray = signals.signals || [];
      
      const objections = signalsArray.filter((signal: any) => 
        signal.signal_type && signal.signal_type.includes('Objection:')
      );
      
      acc[owner].objections += objections.length;
      
      const resolvedObjections = objections.filter((objection: any) => 
        objection.objection_analysis && 
        objection.objection_analysis.resolution_status && 
        objection.objection_analysis.resolution_status.toLowerCase() === 'resolved'
      );
      
      acc[owner].resolvedObjections += resolvedObjections.length;
    } catch (e) {
      console.error('Error processing signals for objections', e);
    }
    
    return acc;
  }, {} as Record<string, any>);
  
  // Convert to array for charts
  const aePerformanceArray = Object.values(aePerformance)
    .map(ae => ({
      ...ae,
      resolutionRate: ae.objections > 0 
        ? (ae.resolvedObjections / ae.objections) * 100 
        : 0
    }))
    .sort((a, b) => b.dealValue - a.dealValue);
  
  // Prepare simulated activity metrics
  const activityMetrics = Object.values(aePerformance).map(ae => {
    // Simulated meeting, email, and call counts
    const meetingCount = Math.floor(Math.random() * 30) + 10;
    const emailCount = Math.floor(Math.random() * 50) + 20;
    const callCount = Math.floor(Math.random() * 40) + 15;
    
    return {
      name: ae.name,
      meetingCount,
      communicationCount: emailCount + callCount,
      dealValue: ae.dealValue,
      totalActivity: meetingCount + emailCount + callCount
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Team Performance</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>AE Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={aePerformanceArray}
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(value: any, name: string) => {
                  if (name === 'dealValue') return [`$${value.toLocaleString()}`, 'Deal Value'];
                  if (name === 'totalDeals') return [value, 'Total Deals'];
                  if (name === 'resolutionRate') return [`${value.toFixed(1)}%`, 'Resolution Rate'];
                  return [value, name];
                }} />
                <Legend />
                <Bar dataKey="totalDeals" name="Total Deals" fill="#8884d8" />
                <Bar dataKey="implementation" name="Implementation" stackId="stage" fill="#82ca9d" />
                <Bar dataKey="qualification" name="Qualification" stackId="stage" fill="#ffc658" />
                <Bar dataKey="discovery" name="Discovery" stackId="stage" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AE Activity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 10,
                  left: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="meetingCount" name="Meetings" unit=" mtgs" />
                <YAxis type="number" dataKey="communicationCount" name="Communications" unit=" comms" />
                <ZAxis type="number" dataKey="dealValue" range={[50, 500]} name="Deal Value" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: any, name: any) => {
                  if (name === 'Deal Value') return [`$${value.toLocaleString()}`, name];
                  return [value, name];
                }} />
                <Legend />
                <Scatter name="AE Activity" data={activityMetrics} fill="#8884d8">
                  <LabelList dataKey="name" position="top" />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Objection Resolution Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Executive</TableHead>
                <TableHead>Total Deals</TableHead>
                <TableHead>Resolved Objections</TableHead>
                <TableHead>Total Objections</TableHead>
                <TableHead>Resolution Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aePerformanceArray.map((ae) => (
                <TableRow key={ae.name}>
                  <TableCell className="font-medium">{ae.name}</TableCell>
                  <TableCell>{ae.totalDeals}</TableCell>
                  <TableCell>{ae.resolvedObjections}</TableCell>
                  <TableCell>{ae.objections}</TableCell>
                  <TableCell>{ae.objections > 0 ? `${(ae.resolutionRate).toFixed(1)}%` : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPerformance;
