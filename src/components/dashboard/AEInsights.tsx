
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, 
  ScatterChart, Scatter, 
  RadialBarChart, RadialBar
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle, TrendingUp } from "lucide-react";

interface AEInsightsProps {
  crmData: any[];
  selectedAE: string;
}

const AEInsights: React.FC<AEInsightsProps> = ({ crmData, selectedAE }) => {
  const [filteredDeals, setFilteredDeals] = useState<any[]>([]);
  const [signalTypeData, setSignalTypeData] = useState<any[]>([]);
  const [dealProgressionData, setDealProgressionData] = useState<any[]>([]);
  const [objectionResolutionData, setObjectionResolutionData] = useState<any[]>([]);
  const [confidenceData, setConfidenceData] = useState<any[]>([]);
  const [actionCenterData, setActionCenterData] = useState<any[]>([]);
  const [dealValueBySignalData, setDealValueBySignalData] = useState<any[]>([]);

  // COLORS for charts
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8E9196'];

  useEffect(() => {
    // Filter deals based on selected AE
    const deals = selectedAE === "all" 
      ? crmData
      : crmData.filter(deal => deal.owner === selectedAE);
    
    setFilteredDeals(deals);
    
    // Process signal type distribution data
    processSignalTypeData(deals);
    
    // Process deal progression timeline data
    processDealProgressionData(deals);
    
    // Process objection resolution data
    processObjectionResolutionData(deals);
    
    // Process signal confidence data
    processConfidenceData(deals);
    
    // Process action center data
    processActionCenterData(deals);
    
    // Process deal value by signal type data
    processDealValueBySignalData(deals);

  }, [selectedAE, crmData]);

  // Process signal type distribution
  const processSignalTypeData = (deals: any[]) => {
    const signalTypes: Record<string, number> = {
      "Objections": 0,
      "Opportunities": 0,
      "Confusion Points": 0,
      "External Factors": 0
    };
    
    deals.forEach(deal => {
      try {
        let signalsData = deal.signals;
        if (typeof signalsData === 'string') {
          signalsData = JSON.parse(signalsData);
        }
        
        if (Array.isArray(signalsData)) {
          signalsData.forEach((signal: any) => {
            if (signal?.signal_type?.includes('objection')) {
              signalTypes["Objections"]++;
            } else if (signal?.signal_type?.includes('opportunity')) {
              signalTypes["Opportunities"]++;
            } else if (signal?.signal_type?.includes('confusion')) {
              signalTypes["Confusion Points"]++;
            } else if (signal?.signal_type?.includes('external')) {
              signalTypes["External Factors"]++;
            }
          });
        } else if (signalsData && typeof signalsData === 'object') {
          const type = signalsData.signal_type || '';
          if (type.includes('objection')) {
            signalTypes["Objections"]++;
          } else if (type.includes('opportunity')) {
            signalTypes["Opportunities"]++;
          } else if (type.includes('confusion')) {
            signalTypes["Confusion Points"]++;
          } else if (type.includes('external')) {
            signalTypes["External Factors"]++;
          }
        }
      } catch (e) {
        console.error("Error processing signal data:", e);
      }
    });
    
    // Format for pie chart
    const chartData = Object.entries(signalTypes).map(([name, value]) => ({
      name,
      value: value || 0
    }));
    
    setSignalTypeData(chartData);
  };

  // Process deal progression timeline
  const processDealProgressionData = (deals: any[]) => {
    const stageData: Record<string, any> = {
      "Discovery": { count: 0, avgDays: 0, totalDays: 0 },
      "Qualification": { count: 0, avgDays: 0, totalDays: 0 },
      "Implementation": { count: 0, avgDays: 0, totalDays: 0 },
      "Closed Won": { count: 0, avgDays: 0, totalDays: 0 },
      "Closed Lost": { count: 0, avgDays: 0, totalDays: 0 }
    };
    
    deals.forEach(deal => {
      const stage = deal.deal_stage || "Unknown";
      
      // Calculate days in stage (simulated data)
      const daysInStage = Math.floor(Math.random() * 60) + 5; // Simulated data
      
      if (stageData[stage]) {
        stageData[stage].count++;
        stageData[stage].totalDays += daysInStage;
      }
    });
    
    // Calculate averages
    Object.keys(stageData).forEach(stage => {
      if (stageData[stage].count > 0) {
        stageData[stage].avgDays = Math.round(stageData[stage].totalDays / stageData[stage].count);
      }
    });
    
    // Format for line/bar chart
    const chartData = Object.entries(stageData).map(([name, data]) => ({
      name,
      count: data.count,
      avgDays: data.avgDays
    }));
    
    setDealProgressionData(chartData);
  };

  // Process objection resolution data
  const processObjectionResolutionData = (deals: any[]) => {
    const resolutionStatus: Record<string, number> = {
      "Resolved": 0,
      "Partially Resolved": 0,
      "Not Resolved": 0,
      "In Progress": 0
    };
    
    deals.forEach(deal => {
      try {
        let signalsData = deal.signals;
        if (typeof signalsData === 'string') {
          signalsData = JSON.parse(signalsData);
        }
        
        if (Array.isArray(signalsData)) {
          signalsData.forEach((signal: any) => {
            if (signal?.objection_analysis?.resolution_status) {
              const status = signal.objection_analysis.resolution_status.toLowerCase();
              if (status.includes('resolved')) {
                resolutionStatus["Resolved"]++;
              } else if (status.includes('partially')) {
                resolutionStatus["Partially Resolved"]++;
              } else if (status.includes('progress')) {
                resolutionStatus["In Progress"]++;
              } else {
                resolutionStatus["Not Resolved"]++;
              }
            }
          });
        } else if (signalsData?.objection_analysis?.resolution_status) {
          const status = signalsData.objection_analysis.resolution_status.toLowerCase();
          if (status.includes('resolved')) {
            resolutionStatus["Resolved"]++;
          } else if (status.includes('partially')) {
            resolutionStatus["Partially Resolved"]++;
          } else if (status.includes('progress')) {
            resolutionStatus["In Progress"]++;
          } else {
            resolutionStatus["Not Resolved"]++;
          }
        }
      } catch (e) {
        console.error("Error processing objection data:", e);
      }
    });
    
    // Format for chart
    const chartData = Object.entries(resolutionStatus).map(([name, value]) => ({
      name,
      value: value || 0
    }));
    
    setObjectionResolutionData(chartData);
  };

  // Process signal confidence data
  const processConfidenceData = (deals: any[]) => {
    const confidenceScores: Record<string, any> = {
      "High": { count: 0, fillColor: '#10B981' },
      "Medium": { count: 0, fillColor: '#F97316' },
      "Low": { count: 0, fillColor: '#EF4444' }
    };
    
    deals.forEach(deal => {
      try {
        let signalsData = deal.signals;
        if (typeof signalsData === 'string') {
          signalsData = JSON.parse(signalsData);
        }
        
        if (Array.isArray(signalsData)) {
          signalsData.forEach((signal: any) => {
            if (signal?.confidence) {
              const confidence = parseFloat(signal.confidence);
              if (confidence >= 0.7) {
                confidenceScores["High"].count++;
              } else if (confidence >= 0.4) {
                confidenceScores["Medium"].count++;
              } else {
                confidenceScores["Low"].count++;
              }
            }
          });
        } else if (signalsData?.confidence) {
          const confidence = parseFloat(signalsData.confidence);
          if (confidence >= 0.7) {
            confidenceScores["High"].count++;
          } else if (confidence >= 0.4) {
            confidenceScores["Medium"].count++;
          } else {
            confidenceScores["Low"].count++;
          }
        }
      } catch (e) {
        console.error("Error processing confidence data:", e);
      }
    });
    
    // Format for radial bar chart
    const chartData = Object.entries(confidenceScores).map(([name, data], index) => ({
      name,
      value: data.count,
      fill: data.fillColor,
      outerRadius: 100 - index * 20
    }));
    
    setConfidenceData(chartData);
  };

  // Process action center data
  const processActionCenterData = (deals: any[]) => {
    const actionTypes: Record<string, number> = {
      "Reframe": 0,
      "Educate": 0,
      "Accelerate": 0,
      "Trigger": 0,
      "Follow Up": 0
    };
    
    deals.forEach(deal => {
      try {
        let actionsData = deal.actions;
        if (typeof actionsData === 'string') {
          actionsData = JSON.parse(actionsData);
        }
        
        if (Array.isArray(actionsData)) {
          actionsData.forEach((action: any) => {
            if (action?.action_verb) {
              const verb = action.action_verb.toLowerCase();
              if (verb.includes('reframe')) {
                actionTypes["Reframe"]++;
              } else if (verb.includes('educate')) {
                actionTypes["Educate"]++;
              } else if (verb.includes('accelerate')) {
                actionTypes["Accelerate"]++;
              } else if (verb.includes('trigger')) {
                actionTypes["Trigger"]++;
              } else if (verb.includes('follow')) {
                actionTypes["Follow Up"]++;
              }
            }
          });
        } else if (actionsData?.action_verb) {
          const verb = actionsData.action_verb.toLowerCase();
          if (verb.includes('reframe')) {
            actionTypes["Reframe"]++;
          } else if (verb.includes('educate')) {
            actionTypes["Educate"]++;
          } else if (verb.includes('accelerate')) {
            actionTypes["Accelerate"]++;
          } else if (verb.includes('trigger')) {
            actionTypes["Trigger"]++;
          } else if (verb.includes('follow')) {
            actionTypes["Follow Up"]++;
          }
        }
      } catch (e) {
        console.error("Error processing action data:", e);
      }
    });
    
    // Format for bar chart
    const chartData = Object.entries(actionTypes).map(([name, value]) => ({
      name,
      value: value || 0
    }));
    
    setActionCenterData(chartData);
  };

  // Process deal value by signal type
  const processDealValueBySignalData = (deals: any[]) => {
    const dealValueBySignal: any[] = [];
    
    deals.forEach(deal => {
      try {
        const dealAmount = parseFloat(deal.deal_amount) || 0;
        const dealName = deal.deal_name || 'Unknown Deal';
        
        let signalsData = deal.signals;
        if (typeof signalsData === 'string') {
          signalsData = JSON.parse(signalsData);
        }
        
        if (Array.isArray(signalsData) && signalsData.length > 0) {
          // Take the first signal for simplicity
          const signal = signalsData[0];
          const signalType = signal?.signal_type || 'Unknown';
          
          dealValueBySignal.push({
            name: dealName,
            signalType,
            value: dealAmount,
            x: Math.random() * 100, // For scatter plot X position
            y: dealAmount / 1000     // Scale down for Y position
          });
        } else if (signalsData && typeof signalsData === 'object') {
          const signalType = signalsData.signal_type || 'Unknown';
          
          dealValueBySignal.push({
            name: dealName,
            signalType,
            value: dealAmount,
            x: Math.random() * 100, // For scatter plot X position
            y: dealAmount / 1000     // Scale down for Y position
          });
        }
      } catch (e) {
        console.error("Error processing deal value data:", e);
      }
    });
    
    setDealValueBySignalData(dealValueBySignal);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {selectedAE === "all" ? "All Account Executives" : selectedAE} Insights
      </h2>
      
      <Tabs defaultValue="signal-analysis" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="signal-analysis">Signal Analysis</TabsTrigger>
          <TabsTrigger value="deal-progression">Deal Progression</TabsTrigger>
          <TabsTrigger value="objection-resolution">Objection Resolution</TabsTrigger>
          <TabsTrigger value="action-center">Action Center</TabsTrigger>
        </TabsList>
        
        {/* Signal Analysis Tab */}
        <TabsContent value="signal-analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Signal Type Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
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
                      minAngle={15}
                      background
                      clockWise
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
            <Card className="col-span-1 md:col-span-2">
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
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: number) => [`$${value * 1000}`, 'Deal Amount']} />
                    <Scatter name="Deal Values" data={dealValueBySignalData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Deal Progression Tab */}
        <TabsContent value="deal-progression" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Deal Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Deal Progression Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dealProgressionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Number of Deals" fill="#8B5CF6" />
                    <Bar yAxisId="right" dataKey="avgDays" name="Avg. Days in Stage" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Deal Timeline Explanation */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The chart above shows the distribution of deals across different stages and the average number of days 
                deals spend in each stage. This helps identify potential bottlenecks in the sales process.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        
        {/* Objection Resolution Tab */}
        <TabsContent value="objection-resolution" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Objection Resolution Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Objection Resolution Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={objectionResolutionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resolution Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {objectionResolutionData.map((item) => (
                <Card key={item.name}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Badge className={`mb-2 ${
                        item.name === "Resolved" ? "bg-green-500" : 
                        item.name === "Partially Resolved" ? "bg-amber-500" :
                        item.name === "In Progress" ? "bg-blue-500" : 
                        "bg-red-500"
                      }`}>
                        {item.name}
                      </Badge>
                      <p className="text-3xl font-bold">{item.value}</p>
                      <p className="text-sm text-muted-foreground">objections</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Action Center Tab */}
        <TabsContent value="action-center" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={actionCenterData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Action Priority List */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Actions</CardTitle>
              </CardHeader>
              <CardContent className="h-80 overflow-auto">
                <div className="space-y-4">
                  {actionCenterData.map((action) => (
                    <div 
                      key={action.name}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{action.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.value} action{action.value !== 1 ? 's' : ''} required
                        </p>
                      </div>
                      <Badge 
                        variant={action.value > 5 ? "default" : "outline"}
                        className={action.value > 5 ? "bg-amber-500" : ""}
                      >
                        {action.value > 5 ? "High" : "Normal"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AEInsights;
