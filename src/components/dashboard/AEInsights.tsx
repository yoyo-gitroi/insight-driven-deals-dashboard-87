
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, CheckCircle, TrendingUp, 
  ChartBar, Info, ChartPie, Award, Flag
} from "lucide-react";
import { 
  safeJsonParse, extractResolutionStatus, extractUpsellOpportunities, 
  extractPriorityActions, extractObjectionTypes, extractConfidenceData,
  extractActionTypes, extractDealStages, processSignalTypeData
} from "@/lib/utils";
import AccountHealthCard from "./insights/AccountHealthCard";
import ObjectionBreakdown from "./insights/ObjectionBreakdown";
import ActionCenter from "./insights/ActionCenter";
import StakeholderInsights from "./insights/StakeholderInsights";

interface AEInsightsProps {
  crmData: any[];
  selectedAE: string;
}

const AEInsights: React.FC<AEInsightsProps> = ({ crmData, selectedAE }) => {
  const [filteredDeals, setFilteredDeals] = useState<any[]>([]);
  const [signalTypeData, setSignalTypeData] = useState<any[]>([]);
  const [dealProgressionData, setDealProgressionData] = useState<any[]>([]);
  const [objectionResolutionData, setObjectionResolutionData] = useState<any[]>([]);
  const [objectionTypeData, setObjectionTypeData] = useState<any[]>([]);
  const [priorityActionsData, setPriorityActionsData] = useState<any>({});
  const [upsellOpportunitiesData, setUpsellOpportunitiesData] = useState<any>({});
  const [kpiData, setKpiData] = useState<any>({
    totalDeals: 0,
    totalObjections: 0,
    highPriorityActions: 0,
    successfulUpsells: 0,
    averageDealSize: 0
  });

  // COLORS for charts
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8E9196'];
  const OBJECTION_COLORS = {
    'Product Fit': '#2196F3', // Blue
    'Integration': '#9C27B0', // Purple
    'Pricing': '#FF9800', // Orange
    'Stakeholder Buy-in': '#4CAF50', // Green
    'Other': '#8E9196' // Gray
  };

  useEffect(() => {
    // Filter deals based on selected AE
    const deals = selectedAE === "all" 
      ? crmData
      : crmData.filter(deal => deal.owner === selectedAE);
    
    setFilteredDeals(deals);
    
    if (deals.length > 0) {
      // Process signal type distribution data
      const signalTypeResult = processSignalTypeData(deals);
      setSignalTypeData(signalTypeResult);
      
      // Process deal progression timeline data
      const dealProgressionResult = extractDealStages(deals);
      setDealProgressionData(dealProgressionResult);
      
      // Process objection resolution data
      processObjectionResolutionData(deals);
      
      // Process objection type data
      const objectionTypeResult = extractObjectionTypes(deals);
      setObjectionTypeData(objectionTypeResult);
      
      // Process priority actions data
      const priorityActionsResult = extractPriorityActions(deals);
      setPriorityActionsData(priorityActionsResult);
      
      // Process upsell opportunities data
      processUpsellOpportunitiesData(deals);
      
      // Calculate KPIs
      calculateKPIs(deals);
    }
  }, [selectedAE, crmData]);

  // Process objection resolution data
  const processObjectionResolutionData = (deals: any[]) => {
    // Aggregate all the objection resolution data
    const totalResolutionStatus = deals.reduce((acc, deal) => {
      const currentCounts = extractResolutionStatus([deal]);
      return {
        resolved: acc.resolved + currentCounts.resolved,
        partiallyResolved: acc.partiallyResolved + currentCounts.partiallyResolved,
        inProgress: acc.inProgress + currentCounts.inProgress,
        notResolved: acc.notResolved + currentCounts.notResolved
      };
    }, { resolved: 0, partiallyResolved: 0, inProgress: 0, notResolved: 0 });
  
    // Format for chart
    const chartData = [
      { name: "Resolved", value: totalResolutionStatus.resolved, color: "#4CAF50" },
      { name: "Partially Resolved", value: totalResolutionStatus.partiallyResolved, color: "#9C27B0" },
      { name: "In Progress", value: totalResolutionStatus.inProgress, color: "#2196F3" },
      { name: "Not Resolved", value: totalResolutionStatus.notResolved, color: "#FF6B6B" }
    ];
    
    setObjectionResolutionData(chartData);
  };

  // Process upsell opportunities data
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
    
    setUpsellOpportunitiesData(upsellOps);
  };
  
  // Calculate top-level KPIs
  const calculateKPIs = (deals: any[]) => {
    // Total deals
    const totalDeals = deals.length;

    // Total Objections
    const totalObjections = deals.reduce((count, deal) => {
      try {
        const signals = JSON.parse(deal.signals).signals;
        const objections = Array.isArray(signals) ? signals.filter(
          (signal: any) => typeof signal.signal_type === "string" && 
          signal.signal_type.startsWith("Objection::")
        ) : [];
        return count + objections.length;
      } catch (e) {
        return count;
      }
    }, 0);
                    
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
    
    // Calculate average deal size
    const avgDealSize = deals.length > 0 
      ? deals.reduce((sum, deal) => sum + (parseFloat(deal.deal_amount) || 0), 0) / deals.length
      : 0;
    
    setKpiData({
      totalDeals,
      totalObjections,
      highPriorityActions: priorityActions.high,
      successfulUpsells: upsellOps.high,
      averageDealSize: avgDealSize
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        {selectedAE === "all" ? "All Account Executives" : selectedAE} Insights
      </h2>
      
      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AccountHealthCard 
          title="Total Deals"
          value={kpiData.totalDeals}
          icon={<CheckCircle className="h-5 w-5 text-primary" />}
          description="Active opportunities"
        />
        
        <AccountHealthCard 
          title="Total Objections"
          value={kpiData.totalObjections}
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          description="Across all deals"
          trend="neutral"
        />
        
        <AccountHealthCard 
          title="High Priority"
          value={kpiData.highPriorityActions}
          icon={<Flag className="h-5 w-5 text-rose-500" />}
          description="Actions needed"
          trend="up"
        />
        
        <AccountHealthCard 
          title="Avg Deal Size"
          value={`$${Math.round(kpiData.averageDealSize).toLocaleString()}`}
          icon={<Award className="h-5 w-5 text-green-500" />}
          description="Revenue opportunity"
          trend="up"
        />
      </div>
      
      <Tabs defaultValue="signal-analysis" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="signal-analysis">Signal Analysis</TabsTrigger>
          <TabsTrigger value="deal-progression">Deal Progression</TabsTrigger>
          <TabsTrigger value="objection-resolution">Objection Resolution</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholder Analysis</TabsTrigger>
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
                <CardDescription>
                  Breakdown of detected signals by category
                </CardDescription>
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
            <ObjectionBreakdown 
              objectionTypeData={objectionTypeData} 
              colorMapping={OBJECTION_COLORS}
            />
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
                <CardDescription>
                  Distribution of deals across stages and time spent in each stage
                </CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objection Resolution Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Objection Resolution Tracking
                </CardTitle>
                <CardDescription>
                  Current status of all detected objections
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                      {objectionResolutionData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Upsell Opportunities Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Upsell Opportunities Analysis
                </CardTitle>
                <CardDescription>
                  Identified expansion opportunities by priority
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="col-span-1">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'High', value: upsellOpportunitiesData.high, fill: '#FF9800' },
                            { name: 'Medium', value: upsellOpportunitiesData.medium, fill: '#FFC107' },
                            { name: 'Low', value: upsellOpportunitiesData.low, fill: '#2196F3' }
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
                  <div className="col-span-1 grid grid-cols-3 gap-2">
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
        
        {/* Stakeholder Analysis Tab */}
        <TabsContent value="stakeholders" className="space-y-6">
          <StakeholderInsights deals={filteredDeals} />
        </TabsContent>
      </Tabs>

      {/* Action Center - Always visible at the bottom */}
      <ActionCenter priorityActions={priorityActionsData} />
    </div>
  );
};

export default AEInsights;
