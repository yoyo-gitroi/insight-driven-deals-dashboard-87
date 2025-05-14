
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
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

interface ForecastProps {
  data: CRMData[];
}

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  // Process close dates for projected timeline
  const closeDateMap = data.reduce((acc, deal) => {
    if (!deal.close_date) return acc;
    
    try {
      const date = new Date(deal.close_date);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      if (!acc[month]) {
        acc[month] = {
          month,
          discovery: 0,
          discoveryValue: 0,
          qualification: 0,
          qualificationValue: 0,
          implementation: 0,
          implementationValue: 0,
          total: 0,
          totalValue: 0,
          date: date,
        };
      }
      
      acc[month].total += 1;
      acc[month].totalValue += deal.deal_amount || 0;
      
      const stage = (deal.deal_stage || '').toLowerCase();
      if (stage === 'discovery') {
        acc[month].discovery += 1;
        acc[month].discoveryValue += deal.deal_amount || 0;
      } else if (stage === 'qualification') {
        acc[month].qualification += 1;
        acc[month].qualificationValue += deal.deal_amount || 0;
      } else if (stage === 'implementation') {
        acc[month].implementation += 1;
        acc[month].implementationValue += deal.deal_amount || 0;
      }
    } catch (e) {
      console.error('Error processing close date', e);
    }
    
    return acc;
  }, {} as Record<string, any>);
  
  // Convert to array and sort by date
  const timelineData = Object.values(closeDateMap)
    .sort((a, b) => a.date - b.date);
  
  // Generate projected pipeline data (extending actual data with projections)
  const currentMonth = new Date();
  const projectedMonths = 6;
  
  const projectedPipelineData = [...Array(projectedMonths)].map((_, i) => {
    const projDate = new Date(currentMonth);
    projDate.setMonth(currentMonth.getMonth() + i);
    const monthKey = projDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    // Use actual data if exists, otherwise project
    if (closeDateMap[monthKey]) {
      return {
        month: monthKey,
        actual: closeDateMap[monthKey].totalValue,
        projected: null
      };
    } else {
      // Simple projection logic (increases by ~10% each month)
      const lastActualMonth = timelineData[timelineData.length - 1];
      const baseValue = lastActualMonth ? lastActualMonth.totalValue : 1000000;
      return {
        month: monthKey,
        actual: null,
        projected: baseValue * Math.pow(1.1, i)
      };
    }
  });
  
  // Create risk assessment data
  const riskAssessmentData = data.map(deal => {
    // Calculate days to close (if close date exists)
    let daysToClose = 30; // Default
    if (deal.close_date) {
      const closeDate = new Date(deal.close_date);
      const today = new Date();
      daysToClose = Math.max(0, Math.round((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    }
    
    // Determine risk score (simulated, would come from signal analysis)
    const riskScore = Math.random() * 100;
    
    return {
      name: deal.deal_name || `Deal ${deal.sr_no}`,
      daysToClose,
      dealAmount: deal.deal_amount || 0,
      riskScore,
      stage: deal.deal_stage || 'Unknown'
    };
  });
  
  // Weighted pipeline forecast (simulated)
  const stageWeights: Record<string, number> = {
    discovery: 0.2,
    qualification: 0.5,
    implementation: 0.8,
    "closed won": 1.0,
    "closed lost": 0.0
  };
  
  const forecastData = timelineData.map(period => {
    const weightedValue = 
      (period.discoveryValue * (stageWeights.discovery || 0.2)) + 
      (period.qualificationValue * (stageWeights.qualification || 0.5)) + 
      (period.implementationValue * (stageWeights.implementation || 0.8));
    
    return {
      month: period.month,
      weightedForecast: weightedValue,
      actualValue: period.totalValue,
      forecastConfidence: 70 + Math.random() * 20 // Simulated confidence level
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Forecast & Projection</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Projected Close Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Deal Value']} />
                <Legend />
                <Area type="monotone" dataKey="discoveryValue" name="Discovery" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="qualificationValue" name="Qualification" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="implementationValue" name="Implementation" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Projected vs Actual Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={projectedPipelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => value ? [`$${value.toLocaleString()}`, 'Value'] : ['N/A', 'Value']} />
                <Legend />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                <Line type="monotone" dataKey="projected" name="Projected" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment by Deal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey="daysToClose" name="Days to Close" label={{ value: 'Days to Close', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis type="number" dataKey="dealAmount" name="Deal Amount" label={{ value: 'Deal Amount ($)', angle: -90, position: 'insideLeft' }} />
                  <ZAxis type="number" dataKey="riskScore" range={[20, 500]} name="Risk Score" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                    if (name === 'Deal Amount') return [`$${value.toLocaleString()}`, name];
                    return [value, name];
                  }} />
                  <Legend />
                  <Scatter name="Deal Risk" data={riskAssessmentData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weighted Pipeline Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  <Legend />
                  <Line type="monotone" dataKey="actualValue" name="Actual Value" stroke="#8884d8" />
                  <Line type="monotone" dataKey="weightedForecast" name="Weighted Forecast" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Forecast;
