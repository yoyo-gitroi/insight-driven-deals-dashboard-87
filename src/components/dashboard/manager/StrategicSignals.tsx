
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Scatter, ScatterChart,
  XAxis, YAxis, ZAxis, Sunburst, Treemap,
  CartesianGrid
} from "recharts";
import { safeJsonParse, extractObjectionTypes, extractResolutionStatus } from "@/lib/utils";

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

type StrategicSignalsProps = {
  data: CRMData[];
};

export const StrategicSignals: React.FC<StrategicSignalsProps> = ({ data }) => {
  // Extract objection types from signals
  const objectionData = extractObjectionTypes(data);
  
  // Process resolution status data
  const resolutionData = data.map(deal => {
    const resStatus = extractResolutionStatus([deal]);
    return {
      name: deal.company_name,
      resolved: resStatus.resolved,
      partiallyResolved: resStatus.partiallyResolved,
      inProgress: resStatus.inProgress,
      notResolved: resStatus.notResolved,
      total: resStatus.resolved + resStatus.partiallyResolved + resStatus.inProgress + resStatus.notResolved
    };
  }).filter(item => item.total > 0);

  // Aggregate resolution status across all deals
  const aggregatedResolution = {
    resolved: resolutionData.reduce((sum, item) => sum + item.resolved, 0),
    partiallyResolved: resolutionData.reduce((sum, item) => sum + item.partiallyResolved, 0),
    inProgress: resolutionData.reduce((sum, item) => sum + item.inProgress, 0),
    notResolved: resolutionData.reduce((sum, item) => sum + item.notResolved, 0)
  };
  
  // Extract signal confidence data
  const confidenceByDealStage: Record<string, Array<{ confidence: number, stage: string }>> = {};
  
  data.forEach(deal => {
    try {
      const signalsData = safeJsonParse(deal.signals);
      if (!signalsData) return;

      let signals = [];
      
      // Handle the different possible structures of signals data
      if (Array.isArray(signalsData)) {
        signals = signalsData;
      } else if (signalsData.signals && Array.isArray(signalsData.signals)) {
        signals = signalsData.signals;
      }
      
      signals.forEach(signal => {
        if (signal.confidence) {
          const signalType = signal.signal_type || "Unknown";
          if (!confidenceByDealStage[signalType]) {
            confidenceByDealStage[signalType] = [];
          }
          
          confidenceByDealStage[signalType].push({
            confidence: signal.confidence,
            stage: deal.deal_stage
          });
        }
        
        // Also check for confidence in resolution if available
        if (signal.objection_analysis?.confidence_in_resolution) {
          const signalType = "Objection Resolution";
          if (!confidenceByDealStage[signalType]) {
            confidenceByDealStage[signalType] = [];
          }
          
          confidenceByDealStage[signalType].push({
            confidence: signal.objection_analysis.confidence_in_resolution,
            stage: deal.deal_stage
          });
        }
      });
    } catch (e) {
      console.error("Error processing signal confidence:", e);
    }
  });
  
  // Process signal confidence data for the matrix visualization
  const signalTypes = Object.keys(confidenceByDealStage);
  const stages = Array.from(new Set(data.map(deal => deal.deal_stage)));
  
  const confidenceMatrix = signalTypes.map(type => {
    const result: Record<string, any> = { name: type };
    
    stages.forEach(stage => {
      const confidences = confidenceByDealStage[type]
        .filter(item => item.stage === stage)
        .map(item => item.confidence);
      
      const avg = confidences.length > 0
        ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
        : 0;
      
      result[stage] = Math.round(avg);
    });
    
    return result;
  });
  
  // Extract opportunity signals data
  const opportunitySignals = data.map(deal => {
    try {
      const signalsData = safeJsonParse(deal.signals);
      if (!signalsData) return null;
      
      let signals = [];
      
      if (Array.isArray(signalsData)) {
        signals = signalsData;
      } else if (signalsData.signals && Array.isArray(signalsData.signals)) {
        signals = signalsData.signals;
      }
      
      const opportunities = signals.filter(signal => 
        (signal.signal_type && signal.signal_type.toLowerCase().includes('opportunity')) ||
        (signal.customer_receptiveness)
      );
      
      return {
        name: deal.company_name,
        opportunities: opportunities.length,
        receptiveness: opportunities.reduce((sum, opp) => {
          const level = (opp.customer_receptiveness || '').toLowerCase();
          if (level.includes('high')) return sum + 3;
          if (level.includes('medium')) return sum + 2;
          if (level.includes('low')) return sum + 1;
          return sum;
        }, 0),
        dealSize: deal.deal_amount,
        stage: deal.deal_stage
      };
    } catch (e) {
      console.error("Error processing opportunity signals:", e);
      return null;
    }
  }).filter(Boolean);
  
  // Colors for visualizations
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const RESOLUTION_COLORS = {
    resolved: '#10b981',
    partiallyResolved: '#f59e0b',
    inProgress: '#3b82f6',
    notResolved: '#ef4444'
  };

  // Format sunburst data from objection types
  const sunburstData = {
    name: 'Objections',
    children: objectionData.map((obj, index) => ({
      name: obj.name,
      size: obj.value,
      color: COLORS[index % COLORS.length]
    }))
  };

  // Transform aggregated resolution data for pie chart
  const resolutionPieData = [
    { name: 'Resolved', value: aggregatedResolution.resolved, color: RESOLUTION_COLORS.resolved },
    { name: 'Partially Resolved', value: aggregatedResolution.partiallyResolved, color: RESOLUTION_COLORS.partiallyResolved },
    { name: 'In Progress', value: aggregatedResolution.inProgress, color: RESOLUTION_COLORS.inProgress },
    { name: 'Not Resolved', value: aggregatedResolution.notResolved, color: RESOLUTION_COLORS.notResolved }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Strategic Signals</h2>
      
      {/* Top Objections Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Top Objections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={objectionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {objectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} occurrences`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Resolution Status */}
      <Card>
        <CardHeader>
          <CardTitle>Objection Resolution Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {resolutionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} objections`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Signal Confidence Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Signal Confidence Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={150} data={confidenceMatrix}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {stages.map((stage, index) => (
                  <Radar
                    key={stage}
                    name={stage}
                    dataKey={stage}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.6}
                  />
                ))}
                <Legend />
                <Tooltip formatter={(value) => [`${value}% confidence`, '']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Opportunity Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Opportunity Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="opportunities" 
                  name="Opportunity Count" 
                  label={{ value: 'Opportunities', position: 'insideBottomRight', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="receptiveness" 
                  name="Receptiveness Score" 
                  label={{ value: 'Receptiveness', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis 
                  type="number" 
                  dataKey="dealSize" 
                  range={[100, 1000]} 
                  name="Deal Size" 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => {
                    if (name === "Deal Size") {
                      return [`$${Number(value).toLocaleString()}`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Scatter name="Companies" data={opportunitySignals} fill="#8884d8">
                  {opportunitySignals.map((entry, index) => {
                    // Map deal stages to colors
                    let color;
                    switch(entry.stage) {
                      case "Discovery": color = '#4f46e5'; break;
                      case "Qualification": color = '#8b5cf6'; break;
                      case "Implementation": color = '#06b6d4'; break;
                      case "Closed Won": color = '#10b981'; break;
                      case "Closed Lost": color = '#ef4444'; break;
                      default: color = '#6b7280';
                    }
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
