
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { 
  extractObjectionTypes, 
  extractResolutionStatus, 
  extractUpsellOpportunities,
  extractPriorityActions,
  extractConfidenceData,
  extractDealStages,
  processSignalTypeData,
  extractActionTypes 
} from "@/lib/utils";

// Define the props interface
export interface AEInsightsProps {
  crmData: any[];
  selectedAE: string;
}

const AEInsights: React.FC<AEInsightsProps> = ({ crmData, selectedAE }) => {
  const [activeTab, setActiveTab] = useState("signal");

  // Extract data for visualizations
  const signalTypeData = processSignalTypeData(crmData);
  const objectionTypes = extractObjectionTypes(crmData);
  const resolutionStatus = extractResolutionStatus(crmData);
  const upsellOpportunities = extractUpsellOpportunities(crmData);
  const priorityActions = extractPriorityActions(crmData);
  const confidenceData = extractConfidenceData(crmData);
  const dealStages = extractDealStages(crmData);
  const actionTypes = extractActionTypes(crmData);

  // Calculate summary metrics
  const totalDeals = crmData.length;
  const uniqueAccounts = new Set(crmData.map(deal => deal.company_name)).size;
  const totalObjections = objectionTypes.reduce((sum, type) => sum + type.value, 0);
  const totalOpportunities = signalTypeData.find(item => item.name === "Opportunities")?.value || 0;
  
  // For resolved objection counts
  const resolvedCount = resolutionStatus.resolved || 0;
  const partiallyResolvedCount = resolutionStatus.partiallyResolved || 0;
  const inProgressCount = resolutionStatus.inProgress || 0;
  const notResolvedCount = resolutionStatus.notResolved || 0;
  const totalResolutions = resolvedCount + partiallyResolvedCount + inProgressCount + notResolvedCount;
  
  // Summary metrics for action priorities
  const highPriorityCount = priorityActions.high || 0;
  const mediumPriorityCount = priorityActions.medium || 0;
  const totalPriorities = highPriorityCount + mediumPriorityCount;

  // Color definitions for consistent visualization
  const COLORS = {
    objections: "#FF6B6B",   // red
    opportunities: "#4CAF50", // green
    external: "#2196F3",      // blue
    confusion: "#9C27B0",     // purple
    highPriority: "#FF9800",  // orange
    mediumPriority: "#FFC107", // yellow
    lowPriority: "#2196F3",    // blue
    productFit: "#0EA5E9",    // bright blue
    pricing: "#FF9800",       // orange
    integration: "#9C27B0"    // purple
  };

  // Custom RADIAN calculation for pie chart labels
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Deals</p>
            <h3 className="text-2xl font-bold">{totalDeals}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Unique Accounts</p>
            <h3 className="text-2xl font-bold">{uniqueAccounts}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Objections</p>
            <h3 className="text-2xl font-bold">{totalObjections}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Opportunities</p>
            <h3 className="text-2xl font-bold">{totalOpportunities}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="signal" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="signal">Signal Analysis</TabsTrigger>
          <TabsTrigger value="deal">Deal Progression</TabsTrigger>
          <TabsTrigger value="objection">Objection Resolution</TabsTrigger>
          <TabsTrigger value="action">Action Center</TabsTrigger>
        </TabsList>

        {/* Signal Analysis Tab */}
        <TabsContent value="signal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Signal Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Signal Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={signalTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {signalTypeData.map((entry, index) => {
                          let color = "#8884d8";
                          if (entry.name === "Objections") color = COLORS.objections;
                          if (entry.name === "Opportunities") color = COLORS.opportunities;
                          if (entry.name === "External Factors") color = COLORS.external;
                          if (entry.name === "Confusion Points") color = COLORS.confusion;
                          
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Insight:</strong> {signalTypeData.length > 0 
                    ? `${signalTypeData[0].name} represent the highest proportion of signals detected.`
                    : "No signal data available for analysis."}
                </p>
              </CardContent>
            </Card>

            {/* 2. Objection Types Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Objection Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={objectionTypes}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {objectionTypes.map((entry, index) => {
                          let color = "#8884d8";
                          if (entry.name.toLowerCase().includes('integration')) color = COLORS.integration;
                          if (entry.name.toLowerCase().includes('product fit')) color = COLORS.productFit;
                          if (entry.name.toLowerCase().includes('pricing')) color = COLORS.pricing;
                          
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Insight:</strong> {objectionTypes.length > 0 
                    ? `${objectionTypes[0].name} is the most common objection type, requiring focused enablement materials.`
                    : "No objection data available for analysis."}
                </p>
              </CardContent>
            </Card>

            {/* 8. Signal Confidence Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Signal Confidence Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confidenceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {confidenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Insight:</strong> {confidenceData.length > 0
                    ? `${confidenceData[0].name} confidence signals make up the largest segment, indicating ${confidenceData[0].name.toLowerCase()} reliability in signal detection.`
                    : "No confidence data available for analysis."}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deal Progression Tab */}
        <TabsContent value="deal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3. Deal Progression Timeline */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-medium">Deal Progression Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dealStages}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" name="Deals" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="avgDays" name="Avg Days in Stage" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Insight:</strong> {dealStages.length > 0 
                    ? `Deals spend the most time in the ${dealStages.sort((a, b) => b.avgDays - a.avgDays)[0].name} stage (${dealStages.sort((a, b) => b.avgDays - a.avgDays)[0].avgDays} days avg).`
                    : "No deal stage data available for analysis."}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Objection Resolution Tab */}
        <TabsContent value="objection">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 4. Objection Resolution Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Objection Resolution Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Resolved', value: resolvedCount, fill: '#4CAF50' },
                          { name: 'Partially Resolved', value: partiallyResolvedCount, fill: '#9C27B0' },
                          { name: 'In Progress', value: inProgressCount, fill: '#FFC107' },
                          { name: 'Not Resolved', value: notResolvedCount, fill: '#FF6B6B' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        dataKey="value"
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Objections</p>
                    <p className="text-lg font-bold">{totalResolutions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Resolution Rate</p>
                    <p className="text-lg font-bold">
                      {totalResolutions > 0 
                        ? `${Math.round((resolvedCount / totalResolutions) * 100)}%`
                        : '0%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. Upsell Opportunities Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Upsell Opportunities Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'High Priority', value: upsellOpportunities.high, fill: '#FF9800' },
                          { name: 'Medium Priority', value: upsellOpportunities.medium, fill: '#FFC107' },
                          { name: 'Low Priority', value: upsellOpportunities.low, fill: '#2196F3' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        label
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Opportunities</p>
                    <p className="text-lg font-bold">{upsellOpportunities.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">High Priority</p>
                    <p className="text-lg font-bold">
                      {upsellOpportunities.total > 0 
                        ? `${Math.round((upsellOpportunities.high / upsellOpportunities.total) * 100)}%`
                        : '0%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Action Center Tab */}
        <TabsContent value="action">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 6. Priority Actions Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Priority Actions Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'High Priority', value: highPriorityCount, fill: '#FF9800' },
                          { name: 'Medium Priority', value: mediumPriorityCount, fill: '#FFC107' },
                          { name: 'Low Priority', value: totalDeals - highPriorityCount - mediumPriorityCount, fill: '#2196F3' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        dataKey="value"
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>High priority actions</strong> require immediate attention to avoid deal closure risk.
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Medium priority actions</strong> should be planned within the next week.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Low priority actions</strong> can be scheduled when time permits.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 7. Action Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Action Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={actionTypes}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2196F3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Insight:</strong> {actionTypes.length > 0 
                    ? `"${actionTypes.sort((a, b) => b.value - a.value)[0].name}" is the most common action type, suggesting a focus on ${actionTypes.sort((a, b) => b.value - a.value)[0].name.toLowerCase()} strategies.`
                    : "No action type data available for analysis."}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AEInsights;
