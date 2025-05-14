
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  ChartPie,
  ChartBar,
  TrendingUp,
  Filter
} from "lucide-react";

interface InsightsViewProps {
  crmData: any[];
  selectedAE: string;
}

const InsightsView: React.FC<InsightsViewProps> = ({ crmData, selectedAE }) => {
  // Filter data based on selected AE
  const filteredData = useMemo(() => {
    return selectedAE === "all" 
      ? crmData
      : crmData.filter(deal => deal.owner === selectedAE);
  }, [crmData, selectedAE]);

  // Extract and analyze signals
  const signalAnalysis = useMemo(() => {
    const signalCounts: Record<string, number> = {};
    let totalDeals = 0;
    let totalDealValue = 0;
    let objectionCount = 0;
    let expansionCount = 0;
    
    filteredData.forEach(deal => {
      totalDeals++;
      totalDealValue += deal.deal_amount || 0;
      
      let signalData;
      try {
        if (typeof deal.signals === 'string' && deal.signals.trim()) {
          signalData = JSON.parse(deal.signals);
        } else {
          signalData = deal.signals;
        }
        
        if (signalData && signalData.signals && Array.isArray(signalData.signals)) {
          // Get the highest confidence signal
          const sortedSignals = [...signalData.signals].sort((a, b) => {
            return (b.confidence || 0) - (a.confidence || 0);
          });
          
          if (sortedSignals.length > 0) {
            const highestSignal = sortedSignals[0];
            const signalType = highestSignal.signal_type || 'Unknown';
            
            signalCounts[signalType] = (signalCounts[signalType] || 0) + 1;
            
            // Count objections and expansion opportunities
            if (signalType.toLowerCase().includes('objection')) {
              objectionCount++;
            } else if (signalType.toLowerCase().includes('expansion')) {
              expansionCount++;
            }
          }
        }
      } catch (error) {
        console.error("Error processing signal data:", error);
      }
    });
    
    return {
      signalCounts,
      totalDeals,
      totalDealValue,
      averageDealSize: totalDeals > 0 ? totalDealValue / totalDeals : 0,
      objectionCount,
      expansionCount
    };
  }, [filteredData]);

  // Prepare data for charts
  const signalPieChartData = useMemo(() => {
    return Object.entries(signalAnalysis.signalCounts).map(([name, value]) => {
      return { name, value };
    });
  }, [signalAnalysis]);

  // Deal stage distribution
  const dealStageData = useMemo(() => {
    const stageCounts: Record<string, number> = {};
    const stageValues: Record<string, number> = {};
    
    filteredData.forEach(deal => {
      const stage = deal.deal_stage || 'Unknown';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
      stageValues[stage] = (stageValues[stage] || 0) + (deal.deal_amount || 0);
    });
    
    return Object.entries(stageCounts).map(([name, count]) => {
      return {
        name,
        count,
        value: stageValues[name] || 0
      };
    }).sort((a, b) => {
      // Sort stages in typical sales funnel order (if possible)
      const stageOrder = [
        'Prospect', 'Lead', 'Discovery', 'Qualification',
        'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'
      ];
      
      const indexA = stageOrder.indexOf(a.name);
      const indexB = stageOrder.indexOf(b.name);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [filteredData]);

  // Colors for charts
  const COLORS = [
    "#9b87f5", // Primary Purple
    "#8B5CF6", // Vivid Purple
    "#0EA5E9", // Ocean Blue
    "#F97316", // Bright Orange
    "#D946EF", // Magenta Pink
    "#F2FCE2", // Soft Green
    "#FEF7CD", // Soft Yellow
    "#FEC6A1", // Soft Orange
    "#E5DEFF", // Soft Purple
  ];

  // Signal type colors
  const getSignalColor = (type: string) => {
    if (type.toLowerCase().includes('objection')) return "#ea384c"; // Red
    if (type.toLowerCase().includes('expansion')) return "#10b981"; // Green
    if (type.toLowerCase().includes('confusion')) return "#f97316"; // Orange
    if (type.toLowerCase().includes('persona')) return "#0ea5e9"; // Blue
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Insights View
          {selectedAE !== "all" && (
            <Badge variant="outline" className="ml-3">
              {selectedAE}
            </Badge>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing {filteredData.length} deals
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(signalAnalysis.totalDealValue)}</div>
            <div className="text-xs text-muted-foreground">
              Across {signalAnalysis.totalDeals} deals
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(signalAnalysis.averageDealSize)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500">
              Total Objections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signalAnalysis.objectionCount}</div>
            <div className="text-xs text-muted-foreground">
              {signalAnalysis.objectionCount > 0 
                ? Math.round((signalAnalysis.objectionCount / signalAnalysis.totalDeals) * 100) + '% of deals'
                : 'No objections'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Expansion Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signalAnalysis.expansionCount}</div>
            <div className="text-xs text-muted-foreground">
              {signalAnalysis.expansionCount > 0 
                ? Math.round((signalAnalysis.expansionCount / signalAnalysis.totalDeals) * 100) + '% of deals'
                : 'No opportunities'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartPie className="h-5 w-5 mr-2" />
              Signal Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ChartContainer config={{}} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={signalPieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {signalPieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getSignalColor(entry.name)} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} deals`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deal Stage Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBar className="h-5 w-5 mr-2" />
              Deal Stage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ChartContainer config={{}} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dealStageData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                    <Bar dataKey="count" name="Number of Deals" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Deal Value by Stage */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Deal Value by Stage
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ChartContainer config={{}} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dealStageData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 40,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => value >= 1000 ? `$${value / 1000}k` : `$${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value as number), 'Deal Value']}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Deal Value" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsView;
