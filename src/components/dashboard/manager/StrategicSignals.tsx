
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Sunburst,
  Treemap,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
} from "recharts";
import { safeJsonParse } from "@/lib/utils";

interface StrategicSignalsProps {
  data: any[];
}

const COLORS = [
  "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c",
  "#d0ed57", "#ffc658", "#ff8042", "#ff6361", "#bc5090"
];

const StrategicSignals: React.FC<StrategicSignalsProps> = ({ data }) => {
  // Process objections data for sunburst chart
  const extractObjectionsForSunburst = () => {
    const objectionTypes: Record<string, any> = {};
    
    data.forEach(deal => {
      try {
        const signalsData = safeJsonParse(deal.signals, {});
        
        // Extract signals array
        const signals = signalsData.signals || [];
        if (!Array.isArray(signals)) return;
        
        signals.forEach(signal => {
          // Check if this signal has objection data
          if (signal.signal_type?.includes('Objection::')) {
            // Extract the objection type after the ::
            const objType = signal.signal_type.split('::')[1] || 'Unknown';
            
            // Create or update this objection type
            if (!objectionTypes[objType]) {
              objectionTypes[objType] = {
                name: objType,
                children: [
                  { name: 'Resolved', size: 0, color: '#4ade80' },
                  { name: 'Partially Resolved', size: 0, color: '#facc15' },
                  { name: 'Not Resolved', size: 0, color: '#f87171' }
                ]
              };
            }
            
            // Determine resolution status
            if (signal.objection_analysis?.resolution_status) {
              const status = signal.objection_analysis.resolution_status.toLowerCase();
              
              if (status.includes('resolved') && !status.includes('partially')) {
                objectionTypes[objType].children[0].size++;
              } else if (status.includes('partially')) {
                objectionTypes[objType].children[1].size++;
              } else {
                objectionTypes[objType].children[2].size++;
              }
            } else {
              // Default to not resolved if no status is provided
              objectionTypes[objType].children[2].size++;
            }
          }
        });
      } catch (error) {
        console.error("Error processing signals for sunburst:", error);
      }
    });
    
    // Convert to array structure for sunburst
    return {
      name: 'Objections',
      children: Object.values(objectionTypes)
    };
  };
  
  const objectionSunburstData = extractObjectionsForSunburst();
  
  // Process signal confidence matrix data
  const extractSignalConfidenceMatrix = () => {
    const signalTypeData: Record<string, Record<string, { count: number, sum: number }>> = {};
    const dealStages = [...new Set(data.map(deal => deal.deal_stage))].filter(Boolean);
    
    data.forEach(deal => {
      try {
        const signalsData = safeJsonParse(deal.signals, {});
        const dealStage = deal.deal_stage || 'Unknown';
        
        // Extract signals array
        const signals = signalsData.signals || [];
        if (!Array.isArray(signals)) return;
        
        signals.forEach(signal => {
          if (signal.signal_type) {
            // Simplify the signal type (get the main category)
            let signalType = signal.signal_type;
            if (signalType.includes('::')) {
              signalType = signalType.split('::')[0];
            }
            
            // Initialize the signal type if not exists
            if (!signalTypeData[signalType]) {
              signalTypeData[signalType] = {};
              dealStages.forEach(stage => {
                signalTypeData[signalType][stage] = { count: 0, sum: 0 };
              });
            }
            
            // Initialize the deal stage for this signal if not exists
            if (!signalTypeData[signalType][dealStage]) {
              signalTypeData[signalType][dealStage] = { count: 0, sum: 0 };
            }
            
            // Add the confidence data
            const confidence = signal.confidence || 0;
            signalTypeData[signalType][dealStage].count++;
            signalTypeData[signalType][dealStage].sum += confidence;
          }
        });
      } catch (error) {
        console.error("Error processing signals for confidence matrix:", error);
      }
    });
    
    // Convert to array structure for heatmap
    const matrixData: any[] = [];
    
    Object.entries(signalTypeData).forEach(([signalType, stages]) => {
      const row: any = { signalType };
      
      Object.entries(stages).forEach(([stage, data]) => {
        row[stage] = data.count > 0 ? Math.round(data.sum / data.count) : 0;
      });
      
      matrixData.push(row);
    });
    
    return matrixData;
  };
  
  const confidenceMatrixData = extractSignalConfidenceMatrix();
  
  // Process opportunity signals for gauge chart
  const extractOpportunitySignals = () => {
    const opportunityCounts: Record<string, { high: number, medium: number, low: number }> = {};
    
    data.forEach(deal => {
      try {
        const signalsData = safeJsonParse(deal.signals, {});
        
        // Extract signals array
        const signals = signalsData.signals || [];
        if (!Array.isArray(signals)) return;
        
        signals.forEach(signal => {
          if (signal.signal_type?.includes('Expansion::')) {
            // Extract the opportunity type
            const oppType = signal.signal_type.split('::')[1] || 'Other';
            
            // Initialize this opportunity type if not exists
            if (!opportunityCounts[oppType]) {
              opportunityCounts[oppType] = { high: 0, medium: 0, low: 0 };
            }
            
            // Determine customer receptiveness
            if (signal.customer_receptiveness) {
              const receptiveness = signal.customer_receptiveness.toLowerCase();
              
              if (receptiveness.includes('high')) {
                opportunityCounts[oppType].high++;
              } else if (receptiveness.includes('medium')) {
                opportunityCounts[oppType].medium++;
              } else {
                opportunityCounts[oppType].low++;
              }
            }
          }
        });
      } catch (error) {
        console.error("Error processing signals for opportunity gauge:", error);
      }
    });
    
    // Convert to array for visualization
    return Object.entries(opportunityCounts).map(([type, counts]) => ({
      name: type,
      high: counts.high,
      medium: counts.medium,
      low: counts.low,
      total: counts.high + counts.medium + counts.low
    }));
  };
  
  const opportunityData = extractOpportunitySignals();
  
  // Custom tooltip for the sunburst
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          {data.size && <p className="text-sm">{`Count: ${data.size}`}</p>}
          {data.value && <p className="text-sm">{`Value: ${data.value}`}</p>}
        </div>
      );
    }
    return null;
  };
  
  // Generate scatter data for confidence visualization
  const generateScatterData = () => {
    const result: any[] = [];
    
    data.forEach(deal => {
      try {
        const signalsData = safeJsonParse(deal.signals, {});
        const dealStage = deal.deal_stage || 'Unknown';
        
        // Extract signals array
        const signals = signalsData.signals || [];
        if (!Array.isArray(signals)) return;
        
        signals.forEach(signal => {
          if (signal.confidence) {
            let signalType = signal.signal_type || 'Unknown';
            // Clean up signal type for display
            if (signalType.includes('::')) {
              signalType = signalType.split('::')[0];
            }
            
            result.push({
              x: Math.random() * 100, // Random position for demonstration
              y: signal.confidence,
              z: deal.deal_amount || 5000, // Deal amount or default
              dealStage,
              signalType,
              name: deal.company_name || 'Unknown Company'
            });
          }
        });
      } catch (error) {
        console.error("Error generating scatter data:", error);
      }
    });
    
    return result;
  };
  
  const scatterData = generateScatterData();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Strategic Signals</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Objections Sunburst</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <Sunburst
                  data={objectionSunburstData}
                  dataKey="size"
                  nameKey="name"
                >
                  <Tooltip content={<CustomTooltip />} />
                </Sunburst>
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
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="category" 
                    dataKey="signalType" 
                    name="Signal Type" 
                    allowDuplicatedCategory={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Confidence" 
                    domain={[0, 100]}
                    label={{ value: 'Confidence', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[50, 500]} 
                    name="Deal Size" 
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Signals" 
                    data={scatterData} 
                    fill="#8884d8"
                  >
                    {scatterData.map((entry, index) => {
                      // Color by signal type
                      const typeIndex = [
                        'Objection', 'Expansion', 'Confusion', 'External'
                      ].indexOf(entry.signalType);
                      
                      const fillColor = COLORS[typeIndex !== -1 ? typeIndex : index % COLORS.length];
                      
                      return <Cell key={`cell-${index}`} fill={fillColor} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Opportunity Signals Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={opportunityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="high" 
                  name="High Receptiveness" 
                  stackId="a" 
                  fill="#4ade80" 
                />
                <Bar 
                  dataKey="medium" 
                  name="Medium Receptiveness" 
                  stackId="a" 
                  fill="#facc15" 
                />
                <Bar 
                  dataKey="low" 
                  name="Low Receptiveness" 
                  stackId="a" 
                  fill="#f87171" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicSignals;
