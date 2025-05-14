
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area,
  ComposedChart, Scatter, ScatterChart, ZAxis
} from "recharts";
import { safeJsonParse, calculateConfidenceScore } from "@/lib/utils";

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

type ForecastProjectionProps = {
  data: CRMData[];
  stageProbability: Record<string, number>;
};

export const ForecastProjection: React.FC<ForecastProjectionProps> = ({ data, stageProbability }) => {
  // Group deals by close date
  const dealsByCloseDate = data.reduce((acc, deal) => {
    // Parse close date
    let closeDate;
    try {
      closeDate = new Date(deal.close_date);
      // Format as YYYY-MM-DD
      const formattedDate = closeDate.toISOString().split('T')[0];
      
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(deal);
    } catch (e) {
      console.error("Error parsing close date:", e);
    }
    return acc;
  }, {} as Record<string, CRMData[]>);
  
  // Process projected close timeline
  const timelineData = Object.entries(dealsByCloseDate)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, deals]) => {
      const discoveryAmount = deals.filter(d => d.deal_stage === "Discovery").reduce((sum, d) => sum + d.deal_amount, 0);
      const qualificationAmount = deals.filter(d => d.deal_stage === "Qualification").reduce((sum, d) => sum + d.deal_amount, 0);
      const implementationAmount = deals.filter(d => d.deal_stage === "Implementation").reduce((sum, d) => sum + d.deal_amount, 0);
      
      return {
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        Discovery: discoveryAmount,
        Qualification: qualificationAmount,
        Implementation: implementationAmount,
        total: discoveryAmount + qualificationAmount + implementationAmount
      };
    });
  
  // Extract risk assessment data
  const riskAssessmentData = data.map(deal => {
    // Calculate days to close
    const closeDate = new Date(deal.close_date);
    const today = new Date();
    const daysToClose = Math.max(0, Math.floor((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate confidence score based on signals
    const confidenceScore = calculateConfidenceScore(deal.signals);
    
    return {
      name: deal.company_name,
      daysToClose,
      dealAmount: deal.deal_amount,
      stage: deal.deal_stage,
      confidence: confidenceScore
    };
  });
  
  // Calculate weighted pipeline forecast for next 6 months
  const forecastMonths = [];
  const currentDate = new Date();
  for (let i = 0; i < 6; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setMonth(currentDate.getMonth() + i);
    forecastMonths.push(forecastDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }));
  }
  
  const forecastData = forecastMonths.map((month, index) => {
    // For this simplified version, we'll predict based on some assumptions
    const result: Record<string, any> = { name: month };
    
    // Base value from existing deals projected to close in this month
    const baseValue = data.reduce((sum, deal) => {
      const closeDate = new Date(deal.close_date);
      const forecastDate = new Date(currentDate);
      forecastDate.setMonth(currentDate.getMonth() + index);
      
      // Check if deal closes in this forecast month
      if (closeDate.getMonth() === forecastDate.getMonth() && 
          closeDate.getFullYear() === forecastDate.getFullYear()) {
        return sum + (deal.deal_amount * (stageProbability[deal.deal_stage] || 0));
      }
      return sum;
    }, 0);
    
    // Add some variance based on the month index
    const growthFactor = 1 + (index * 0.05); // 5% growth per month
    
    result.bestCase = Math.round(baseValue * growthFactor * 1.2); // 20% above weighted
    result.forecast = Math.round(baseValue * growthFactor);
    result.worstCase = Math.round(baseValue * growthFactor * 0.8); // 20% below weighted
    
    return result;
  });
  
  // Colors for deal stages
  const stageColors: Record<string, string> = {
    "Discovery": "#4f46e5",
    "Qualification": "#8b5cf6",
    "Implementation": "#06b6d4",
    "Closed Won": "#10b981",
    "Closed Lost": "#ef4444"
  };

  // Helper function to format currency
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Forecast & Projection</h2>
      
      {/* Projected Close Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Projected Close Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${(value/1000)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="Discovery" stackId="a" fill={stageColors["Discovery"]} />
                <Bar dataKey="Qualification" stackId="a" fill={stageColors["Qualification"]} />
                <Bar dataKey="Implementation" stackId="a" fill={stageColors["Implementation"]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Risk Assessment Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis 
                  type="number" 
                  dataKey="daysToClose" 
                  name="Days to Close" 
                  label={{ value: 'Days to Close', position: 'insideBottomRight', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="dealAmount" 
                  name="Deal Amount" 
                  tickFormatter={(value) => `$${(value/1000)}k`}
                  label={{ value: 'Deal Amount', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis 
                  type="number" 
                  dataKey="confidence" 
                  range={[100, 1000]} 
                  name="Confidence Score" 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => {
                    if (name === "Deal Amount") {
                      return [formatCurrency(value as number), name];
                    }
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-gray-200 p-2 shadow-sm rounded">
                          <p className="font-semibold">{data.name}</p>
                          <p>Deal Amount: {formatCurrency(data.dealAmount)}</p>
                          <p>Days to Close: {data.daysToClose}</p>
                          <p>Confidence: {data.confidence}%</p>
                          <p>Stage: {data.stage}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter name="Deals" data={riskAssessmentData} fill="#8884d8">
                  {riskAssessmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={stageColors[entry.stage] || "#6b7280"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Weighted Pipeline Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Weighted Pipeline Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={forecastData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value/1000)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="bestCase" 
                  fill="#10b981" 
                  stroke="#10b981"
                  fillOpacity={0.2}
                  name="Best Case"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Forecast"
                />
                <Area 
                  type="monotone" 
                  dataKey="worstCase" 
                  fill="#ef4444" 
                  stroke="#ef4444"
                  fillOpacity={0.2}
                  name="Worst Case"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
