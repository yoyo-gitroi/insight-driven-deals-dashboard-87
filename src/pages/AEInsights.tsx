
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Legend, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, FunnelChart, Funnel, LabelList } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data - in a real application this would come from your backend
const sampleData = {
  quotaAttainment: 78,
  pipelineCoverage: 2.3,
  winRate: { current: 34, previous: 32 },
  avgDealSize: { ae: 48500, team: 42000 },
  avgSalesCycle: { days: 42, trend: "down" },

  pipelineStages: [
    { name: "Prospecting", value: 850000, count: 24, expectedConversion: 30 },
    { name: "Qualified", value: 620000, count: 18, expectedConversion: 60 },
    { name: "Demo", value: 480000, count: 12, expectedConversion: 75 },
    { name: "Proposal", value: 320000, count: 8, expectedConversion: 85 },
    { name: "Negotiation", value: 180000, count: 4, expectedConversion: 90 },
    { name: "Closed Won", value: 150000, count: 3, expectedConversion: 100 }
  ],

  dealProgress: [
    { month: "Jan", closed: 82000, forecast: 90000, quota: 100000 },
    { month: "Feb", closed: 95000, forecast: 95000, quota: 100000 },
    { month: "Mar", closed: 115000, forecast: 115000, quota: 100000 },
    { month: "Apr", closed: 72000, forecast: 105000, quota: 100000 },
    { month: "May", closed: 0, forecast: 110000, quota: 100000 },
    { month: "Jun", closed: 0, forecast: 120000, quota: 100000 }
  ],

  objections: [
    { type: "Price Objection", count: 14, winRate: 65, trend: "up" },
    { type: "Product Fit", count: 8, winRate: 72, trend: "stable" },
    { type: "Technical Issues", count: 6, winRate: 45, trend: "down" },
    { type: "Competition", count: 9, winRate: 58, trend: "stable" },
    { type: "Timeline", count: 4, winRate: 80, trend: "up" }
  ],

  accountEngagement: [
    { account: "Acme Corp", engagement: 85, dealSize: 120000, probability: 75 },
    { account: "Globex", engagement: 65, dealSize: 85000, probability: 60 },
    { account: "Initech", engagement: 42, dealSize: 150000, probability: 35 },
    { account: "Wayne Enterprises", engagement: 91, dealSize: 200000, probability: 80 },
    { account: "Stark Industries", engagement: 73, dealSize: 175000, probability: 65 },
    { account: "Umbrella Corp", engagement: 58, dealSize: 95000, probability: 50 }
  ],

  nextActions: [
    { priority: "High", account: "Initech", action: "Follow up on proposal", daysInactive: 7 },
    { priority: "High", account: "Globex", action: "Schedule technical deep dive", daysInactive: 5 },
    { priority: "Medium", account: "Wayne Enterprises", action: "Prepare expansion proposal", daysInactive: 3 },
    { priority: "Medium", account: "Stark Industries", action: "Connect with new stakeholder", daysInactive: 2 },
    { priority: "Low", account: "Umbrella Corp", action: "Send case study materials", daysInactive: 1 }
  ]
};

const AEInsights = () => {
  // State for filters and active AE
  const [dateRange, setDateRange] = useState("this-quarter");
  const [selectedAE, setSelectedAE] = useState("all");
  const [aeList, setAEList] = useState(["John Doe", "Jane Smith", "Alex Johnson", "All AEs"]);

  // Custom colors for charts
  const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
  const STAGES_COLORS = ["#a78bfa", "#818cf8", "#60a5fa", "#2dd4bf", "#4ade80", "#34d399"];

  return (
    <div className="p-6 max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">AE Insights Dashboard</h1>
          <p className="text-muted-foreground">Analytics and performance metrics to improve sales effectiveness</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedAE} onValueChange={setSelectedAE}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All AEs</SelectItem>
              {aeList.map(ae => ae !== "All AEs" && (
                <SelectItem key={ae} value={ae.toLowerCase().replace(" ", "-")}>
                  {ae}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Quota Attainment</CardTitle>
            <CardDescription>Current Progress</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{sampleData.quotaAttainment}%</div>
            <Progress value={sampleData.quotaAttainment} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Pipeline Coverage</CardTitle>
            <CardDescription>Current vs Required</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{sampleData.pipelineCoverage}x</span>
              <span className={`ml-2 text-xs ${sampleData.pipelineCoverage > 3 ? "text-green-500" : sampleData.pipelineCoverage > 2 ? "text-amber-500" : "text-red-500"}`}>
                {sampleData.pipelineCoverage > 3 ? "Healthy" : sampleData.pipelineCoverage > 2 ? "Adequate" : "At Risk"}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Win Rate</CardTitle>
            <CardDescription>vs Previous Period</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{sampleData.winRate.current}%</span>
              <span className={`ml-2 text-xs ${sampleData.winRate.current > sampleData.winRate.previous ? "text-green-500" : sampleData.winRate.current < sampleData.winRate.previous ? "text-red-500" : "text-amber-500"}`}>
                {sampleData.winRate.current > sampleData.winRate.previous ? "↑" : sampleData.winRate.current < sampleData.winRate.previous ? "↓" : "→"} 
                {Math.abs(sampleData.winRate.current - sampleData.winRate.previous)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Avg Deal Size</CardTitle>
            <CardDescription>vs Team Average</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">${(sampleData.avgDealSize.ae / 1000).toFixed(0)}k</span>
              <span className={`ml-2 text-xs ${sampleData.avgDealSize.ae > sampleData.avgDealSize.team ? "text-green-500" : "text-red-500"}`}>
                {sampleData.avgDealSize.ae > sampleData.avgDealSize.team ? "↑" : "↓"} 
                {Math.abs(Math.round((sampleData.avgDealSize.ae / sampleData.avgDealSize.team - 1) * 100))}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Sales Cycle</CardTitle>
            <CardDescription>Average Days</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{sampleData.avgSalesCycle.days} days</span>
              <span className={`ml-2 text-xs ${sampleData.avgSalesCycle.trend === "down" ? "text-green-500" : "text-red-500"}`}>
                {sampleData.avgSalesCycle.trend === "down" ? "↓ Improving" : "↑ Increasing"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="progress">Deal Progression</TabsTrigger>
          <TabsTrigger value="objections">Objection Analysis</TabsTrigger>
          <TabsTrigger value="engagement">Account Engagement</TabsTrigger>
          <TabsTrigger value="actions">Next Best Actions</TabsTrigger>
        </TabsList>
        
        {/* Pipeline Visualization Tab */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Funnel</CardTitle>
              <CardDescription>Deal flow and conversion rates across stages</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer className="h-full" config={{}}>
                <FunnelChart width={700} height={380}>
                  <Funnel
                    dataKey="value"
                    data={sampleData.pipelineStages}
                    isAnimationActive
                  >
                    <LabelList
                      position="right"
                      fill="#000"
                      stroke="none"
                      dataKey="name"
                    />
                    <LabelList
                      position="right"
                      fill="#666"
                      stroke="none"
                      dataKey="count"
                      formatter={(value: any) => `${value} deals`}
                      offset={60}
                    />
                    <LabelList
                      position="right"
                      fill="#666"
                      stroke="none"
                      dataKey="value"
                      formatter={(value: any) => `$${(value/1000).toFixed(0)}k`}
                      offset={110}
                    />
                    {sampleData.pipelineStages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STAGES_COLORS[index % STAGES_COLORS.length]} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleData.pipelineStages.filter((_, index) => index < 3).map((stage, index) => (
              <Card key={index}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm">{stage.name} Warning</CardTitle>
                  <CardDescription className="text-xs">Deals at risk</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-amber-500 font-medium">
                    {Math.floor(stage.count * 0.3)} deals stuck over 30 days
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Deal Progression Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deal Progression Over Time</CardTitle>
              <CardDescription>Closed deals and forecast vs quota</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer className="h-full" config={{}}>
                <BarChart
                  width={700}
                  height={380}
                  data={sampleData.dealProgress}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip formatter={(value) => `$${(value as number/1000).toFixed(0)}k`} />
                  <Legend />
                  <Bar dataKey="closed" name="Closed" fill="#10B981" />
                  <Bar dataKey="forecast" name="Forecast" fill="#60A5FA" />
                  <Bar dataKey="quota" name="Quota" fill="#F59E0B" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Objection Analysis Tab */}
        <TabsContent value="objections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Objection Distribution</CardTitle>
                <CardDescription>Frequency of different objection types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer className="h-full" config={{}}>
                  <PieChart width={300} height={280}>
                    <Pie
                      data={sampleData.objections}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sampleData.objections.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Objection Win Rate</CardTitle>
                <CardDescription>Success rate after each objection type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer className="h-full" config={{}}>
                  <BarChart
                    width={350}
                    height={280}
                    data={sampleData.objections}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" tick={{fontSize: 10}} interval={0} />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <RechartsTooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="winRate" name="Win Rate" fill="#3B82F6">
                      {sampleData.objections.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.winRate > 70 ? "#10B981" : entry.winRate > 50 ? "#F59E0B" : "#EF4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Objection Handling Playbook</CardTitle>
              <CardDescription>Recommended talking points for common objections</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="price">
                <TabsList>
                  <TabsTrigger value="price">Price</TabsTrigger>
                  <TabsTrigger value="product">Product Fit</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="competition">Competition</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="price" className="mt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Price Objection Response</h4>
                    <p>Focus on value delivered rather than cost. Highlight ROI metrics from similar customers.</p>
                    <p className="text-sm text-muted-foreground">Try: "I understand budget is a concern. Let's look at what current customers have achieved in terms of ROI..."</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="product" className="mt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Product Fit Response</h4>
                    <p>Address specific use cases and flexibility of the platform. Share relevant case studies.</p>
                  </div>
                </TabsContent>
                
                {/* Other tabs would follow the same pattern */}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Engagement Matrix</CardTitle>
              <CardDescription>Deal size vs engagement level with probability indicators</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {/* This would be a scatter plot in a real implementation */}
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    The scatter plot visualization would show accounts positioned by engagement level (x-axis) 
                    and deal size (y-axis), with dot sizes representing close probability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Engaged Accounts</CardTitle>
                <CardDescription>Highest engagement score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.accountEngagement
                    .sort((a, b) => b.engagement - a.engagement)
                    .slice(0, 3)
                    .map((account, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{account.account}</div>
                          <div className="text-sm text-muted-foreground">
                            ${(account.dealSize/1000).toFixed(0)}k • {account.probability}% probability
                          </div>
                        </div>
                        <div className="text-lg font-bold">{account.engagement}%</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Low Engagement Risks</CardTitle>
                <CardDescription>Accounts needing attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.accountEngagement
                    .sort((a, b) => a.engagement - b.engagement)
                    .slice(0, 3)
                    .map((account, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{account.account}</div>
                          <div className="text-sm text-muted-foreground">
                            ${(account.dealSize/1000).toFixed(0)}k • {account.probability}% probability
                          </div>
                        </div>
                        <div className="text-lg font-bold text-amber-500">{account.engagement}%</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Next Best Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prioritized Actions</CardTitle>
              <CardDescription>Recommended next steps based on deal status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleData.nextActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      action.priority === "High" ? "bg-red-100 text-red-700" : 
                      action.priority === "Medium" ? "bg-amber-100 text-amber-700" : 
                      "bg-green-100 text-green-700"
                    }`}>
                      {action.priority}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{action.account}</div>
                      <div className="text-sm">{action.action}</div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {action.daysInactive} {action.daysInactive === 1 ? 'day' : 'days'} inactive
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Pattern analysis from successful deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Multi-stakeholder engagement pattern</h4>
                    <p className="text-sm text-muted-foreground">
                      Your deals with 3+ engaged stakeholders close 45% faster. Consider adding more contacts to Initech and Globex opportunities.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Product demo timing</h4>
                    <p className="text-sm text-muted-foreground">
                      Deals with advanced demos in the first 14 days have 2.3x higher win rates. Accelerate demos for Wayne Enterprises.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Goals Tracker</CardTitle>
                <CardDescription>Progress toward custom targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Q2 New Logo Target (6/10)</span>
                      <span className="text-sm">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Enterprise Deal Goal (2/3)</span>
                      <span className="text-sm">66%</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Expansion Revenue ($180k/$250k)</span>
                      <span className="text-sm">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
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
