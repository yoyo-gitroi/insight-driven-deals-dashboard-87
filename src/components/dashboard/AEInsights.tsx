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
import { 
  AlertCircle, AlertTriangle, CheckCircle, HelpCircle, 
  TrendingUp, ChartBar, Info, ChartPie, Award, Flag
} from "lucide-react";
import { 
  safeJsonParse, extractResolutionStatus, extractUpsellOpportunities, 
  extractPriorityActions, extractObjectionTypes, extractConfidenceData,
  extractActionTypes, extractDealStages, processSignalTypeData
} from "@/lib/utils";

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
  const [objectionTypeData, setObjectionTypeData] = useState<any[]>([]);
  const [priorityActionsData, setPriorityActionsData] = useState<any>({});
  const [upsellOpportunitiesData, setUpsellOpportunitiesData] = useState<any>({});
  const [kpiData, setKpiData] = useState<any>({
    totalDeals: 0,
    totalObjections: 0,
    highPriorityActions: 0,
    successfulUpsells: 0
  });
  const [totalNbaObjection, settotalNbaObjection]= useState(0);
  // COLORS for charts
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8E9196'];
  const CONFIDENCE_COLORS = {
    high: '#10B981',
    medium: '#F97316',
    low: '#EF4444'
  };

  useEffect(() => {
    // Filter deals based on selected AE
    const deals = selectedAE === "all" 
      ? crmData
      : crmData.filter(deal => deal.owner === selectedAE);
    
    console.log("Filtered deals:", deals.length);
    setFilteredDeals(deals);
    
    if (deals.length > 0) {
      console.log("Sample deal data:", deals[0]);
    }
    
    // Process signal type distribution data
    const signalTypeResult = processSignalTypeData(deals);
    console.log("Signal type data:", signalTypeResult);
    setSignalTypeData(signalTypeResult);
    
    // Process deal progression timeline data
    const dealProgressionResult = extractDealStages(deals);
    console.log("Deal progression data:", dealProgressionResult);
    setDealProgressionData(dealProgressionResult);
    
    // Process objection resolution data
    processObjectionResolutionData(deals);
    
    // Process signal confidence data
    const confidenceResult = extractConfidenceData(deals);
    console.log("Confidence data:", confidenceResult);
    setConfidenceData(confidenceResult);
    
    // Process action center data
    const actionCenterResult = extractActionTypes(deals);
    console.log("Action center data:", actionCenterResult);
    setActionCenterData(actionCenterResult);
    
    // Process deal value by signal type data
    processDealValueBySignalData(deals);
    
    // Process objection type data
    const objectionTypeResult = extractObjectionTypes(deals);
    console.log("Objection type data:", objectionTypeResult);
    setObjectionTypeData(objectionTypeResult);
    
    // Process priority actions data
    const priorityActionsResult = extractPriorityActions(deals);
    console.log("Priority actions data:", priorityActionsResult);
    setPriorityActionsData(priorityActionsResult);
    
    // Process upsell opportunities data
    processUpsellOpportunitiesData(deals);
    
    //Calculate KPIs
    calculateKPIs(deals);



    //total Objections
    const totalObjections = deals.reduce((count, deal) => {
          // console.log("under deals",deal);
      
          const signals = JSON.parse(deal.signals).signals;
          // console.log("signals",signals);
          const objections = signals.filter(
            (signal) =>

              typeof signal.signal_type === "string" &&
              signal.signal_type.startsWith("Objection::")
            );
          console.log("yeh rha" , objections);

    return count + objections.length;
    }, 0);



    settotalNbaObjection(totalObjections);





  }, [selectedAE, crmData]);


  
  // Calculate top-level KPIs
  const calculateKPIs = (deals: any[]) => {
    // Total deals
    const totalDeals = deals.length;
    console.log("from" , deals)
    
   


   

    // Get objection resolution counts

    // const resolutionCounts = deals.reduce((acc, deal) => {
    //   const currentCounts = extractResolutionStatus([deal]);
    //   return {
    //     resolved: acc.resolved + currentCounts.resolved,
    //     partiallyResolved: acc.partiallyResolved + currentCounts.partiallyResolved,
    //     inProgress: acc.inProgress + currentCounts.inProgress,
    //     notResolved: acc.notResolved + currentCounts.notResolved
    //   };
    // }, { resolved: 0, partiallyResolved: 0, inProgress: 0, notResolved: 0 });
    
    // console.log("Resolution counts:", resolutionCounts);
    
    // const totalObjections = resolutionCounts.resolved + resolutionCounts.partiallyResolved + 
    //                         resolutionCounts.inProgress + resolutionCounts.notResolved;
    

    
    
  
  
  
                    
    // High priority actions
    const priorityActions = extractPriorityActions(deals);
    
    // Successful upsells
    const upsellOps = deals.reduce((acc, deal) => {
      const currentUpsells = extractUpsellOpportunities([deal]);
      return {
        total: acc.total + currentUpsells.total,
        high: acc.high + currentUpsells.high,
      };
    }, { total: 0, high: 0 });
    
    console.log("Upsell opportunities:", upsellOps);
    
    setKpiData({
      totalDeals,
      totalNbaObjection,
      highPriorityActions: priorityActions.high,
      successfulUpsells: upsellOps.high
    });
    
    console.log("KPI data:", {
      totalDeals,
      totalNbaObjection,
      highPriorityActions: priorityActions.high,
      successfulUpsells: upsellOps.high
    });
  };

  // Process objection resolution data - improved version
  const processObjectionResolutionData = (deals: any[]) => {
    // Aggregate all the objection resolution data
    console.log("process wali deals",deals);
    const totalResolutionStatus = deals.reduce((acc, deal) => {
      const currentCounts = extractResolutionStatus([deal]);
      return {
        resolved: acc.resolved + currentCounts.resolved,
        partiallyResolved: acc.partiallyResolved + currentCounts.partiallyResolved,
        inProgress: acc.inProgress + currentCounts.inProgress,
        notResolved: acc.notResolved + currentCounts.notResolved
      };
    }, { resolved: 0, partiallyResolved: 0, inProgress: 0, notResolved: 0 });
      console.log("Total resolution status:", totalResolutionStatus);
  
    
    // Format for chart
    const chartData = [
      { name: "Resolved", value: totalResolutionStatus.resolved },
      { name: "Partially Resolved", value: totalResolutionStatus.partiallyResolved }
     // { name: "In Progress", value: totalResolutionStatus.inProgress },
      //{ name: "Not Resolved", value: totalResolutionStatus.notResolved }
    ];
    
    setObjectionResolutionData(chartData);
  };

  // Process deal value by signal type
  const processDealValueBySignalData = (deals: any[]) => {
    const dealValueBySignal: any[] = [];
    
    deals.forEach(deal => {
      try {
        const dealAmount = parseFloat(deal.deal_amount) || 0;
        const dealName = deal.deal_name || 'Unknown Deal';
        
        const signalsData = safeJsonParse(deal.signals);
        let signalType = 'Unknown';
        
        // Check if it's an object with a 'signals' array inside
        if (signalsData?.signals && Array.isArray(signalsData.signals) && signalsData.signals.length > 0) {
          signalType = signalsData.signals[0]?.signal_type || 'Unknown';
        }
        // Check if it's a direct array of signals
        else if (Array.isArray(signalsData) && signalsData.length > 0) {
          signalType = signalsData[0]?.signal_type || 'Unknown';
        }
        // Direct single signal
        else if (signalsData && typeof signalsData === 'object') {
          signalType = signalsData.signal_type || 'Unknown';
        }
        
        dealValueBySignal.push({
          name: dealName,
          signalType,
          value: dealAmount,
          x: Math.random() * 100, // For scatter plot X position
          y: dealAmount / 1000     // Scale down for Y position
        });
      } catch (e) {
        console.error("Error processing deal value data:", e);
      }
    });
    
    console.log("Deal value by signal data:", dealValueBySignal);
    setDealValueBySignalData(dealValueBySignal);
  };

  // Process upsell opportunities data - improved version
  const processUpsellOpportunitiesData = (deals: any[]) => {
    const upsellOps = deals.reduce((acc, deal) => {
      const currentUpsells = extractUpsellOpportunities([deal]);
      return {
        total: acc.total + currentUpsells.total,
        high: acc.high + currentUpsells.high,
        medium: acc.medium + currentUpsells.medium,
        low: acc.low + currentUpsells.low
      };
    }, { total: 0, high: 0, medium: 0, low: 0 });
    
    console.log("Upsell opportunities data:", upsellOps);
    setUpsellOpportunitiesData(upsellOps);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {selectedAE === "all" ? "All Account Executives" : selectedAE} Insights
      </h2>
      
      {/* KPI Section 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">Total Deals</span>
              </div>
              <p className="text-3xl font-bold">{kpiData.totalDeals}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Total Objections</span>
              </div>
              <p className="text-3xl font-bold">{totalNbaObjection}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="h-5 w-5 text-rose-500" />
                <span className="font-medium">High Priority</span>
              </div>
              <p className="text-3xl font-bold">{kpiData.highPriorityActions}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-500" />
                <span className="font-medium">Successful Upsells</span>
              </div>
              <p className="text-3xl font-bold">{kpiData.successfulUpsells}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      */}
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
                  <ChartPie className="h-5 w-5" />
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

            {/* Objection Types Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Objection Types
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={objectionTypeData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={(value: number) => [value, 'Count']} />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="#D946EF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Signal Confidence Gauge */}
            {/* <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Signal Confidence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
    <Pie
      data={confidenceData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {confidenceData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip formatter={(value) => [value, 'Count']} />
    <Legend />
  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}

            {/* Deal Value by Signal Heat Map (Simplified as Scatter) */}
            {/* <Card className="col-span-1">
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
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      formatter={(value: number, name: string, props: any) => {
                        if (name === 'Deal Amount') return [`$${value * 1000}`, name];
                        return [value, name];
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded shadow-sm">
                              <p className="font-medium">{payload[0].payload.name}</p>
                              <p>Signal: {payload[0].payload.signalType}</p>
                              <p>Amount: ${payload[0].payload.value.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="Deal Values" data={dealValueBySignalData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
        
        {/* Deal Progression Tab */}
        <TabsContent value="deal-progression" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Deal Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" />
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
              <Info className="h-4 w-4" />
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
                <PieChart width={400} height={400}>
  <Pie
    data={objectionResolutionData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={120}
    fill="#8884d8"
    label
    >
    {objectionResolutionData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>

                </ResponsiveContainer>
              </CardContent>
            </Card>
               
            {/* Resolution Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Total Objections</span>
              </div>
              <p className="text-3xl font-bold">{totalNbaObjection}</p>
            </div>
          </CardContent>
        </Card>
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
            
            {/* Upsell Opportunities Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Upsell Opportunities Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'High', value: upsellOpportunitiesData.high, fill: '#10B981' },
                            { name: 'Medium', value: upsellOpportunitiesData.medium, fill: '#F97316' },
                            { name: 'Low', value: upsellOpportunitiesData.low, fill: '#EF4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                        </Pie>
                        <Tooltip formatter={(value: number) => [value, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <Badge className="mb-2 bg-blue-500">Total</Badge>
                          <p className="text-2xl font-bold">{upsellOpportunitiesData.total}</p>
                          <p className="text-xs text-muted-foreground">opportunities</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <Badge className="mb-2 bg-green-500">Success</Badge>
                          <p className="text-2xl font-bold">{upsellOpportunitiesData.high}</p>
                          <p className="text-xs text-muted-foreground">high receptiveness</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <Badge className="mb-2">Rate</Badge>
                          <p className="text-2xl font-bold">
                            {upsellOpportunitiesData.total ? 
                              Math.round((upsellOpportunitiesData.high / upsellOpportunitiesData.total) * 100) : 
                              0}%
                          </p>
                          <p className="text-xs text-muted-foreground">success rate</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            
            {/* Priority Actions Overview */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Priority Actions Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'High Priority', value: priorityActionsData.high, fill: '#F97316' },
                          { name: 'Medium Priority', value: priorityActionsData.medium, fill: '#FCD34D' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip formatter={(value: number) => [value, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="flex flex-col justify-center">
                    <div className="mb-4">
                      <h4 className="text-lg font-medium">Action Priority Summary</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        High priority actions require immediate attention to avoid potential deal blockers.
                        Medium priority actions should be planned within the next week.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <div className="text-amber-600 font-medium">High</div>
                        <div className="text-2xl font-bold">{priorityActionsData.high}</div>
                        <div className="text-xs text-amber-600">Urgent Actions</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                        <div className="text-yellow-600 font-medium">Medium</div>
                        <div className="text-2xl font-bold">{priorityActionsData.medium}</div>
                        <div className="text-xs text-yellow-600">Scheduled Actions</div>
                      </div>
                    </div>
                  </div>
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
