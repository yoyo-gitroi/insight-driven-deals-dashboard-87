import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DealTable from "@/components/dashboard/DealTable";
import AEInsights from "@/components/dashboard/AEInsights";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { safeJsonParse } from "@/lib/utils";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, 
  ScatterChart, Scatter,
  RadialBarChart, RadialBar,
  Treemap
} from "recharts";
import { 
  AlertCircle, AlertTriangle, CheckCircle, HelpCircle, 
  TrendingUp, ChartBar, Info, ChartPie, Award, Flag,
  ArrowDown, ArrowUp, Filter, ChevronDown, ChevronUp, 
  BarChart2, Search, ListCheck
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { 
  extractResolutionStatus, extractUpsellOpportunities, 
  extractPriorityActions, extractObjectionTypes, extractConfidenceData,
  extractActionTypes, extractDealStages, processSignalTypeData
} from "@/lib/utils";

interface AEDashboardProps {
  crmData: any[];
  aeList: string[];
  selectedAE: string;
  setSelectedAE: (ae: string) => void;
}

// Fix for the arithmetic operation errors
const calculatePriorityActionsPercent = (high: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((high / total) * 100);
};

const AEDashboard: React.FC<AEDashboardProps> = ({ 
  crmData, 
  aeList, 
  selectedAE, 
  setSelectedAE 
}) => {
  const [tabView, setTabView] = useState<"ae" | "manager">("ae");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedSignalTypes, setSelectedSignalTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter deals based on selected AE
  const filteredDeals = selectedAE === "all"
    ? crmData
    : crmData.filter(deal => deal.owner === selectedAE);
    
  const toggleCardExpanded = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };
  
  // Function to handle search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Function to toggle filter visibility
  const toggleFilterVisibility = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Function to handle stage selection
  const handleStageSelect = (stage: string) => {
    setSelectedStages(prevStages =>
      prevStages.includes(stage)
        ? prevStages.filter(s => s !== stage)
        : [...prevStages, stage]
    );
  };
  
  // Function to handle signal type selection
  const handleSignalTypeSelect = (signalType: string) => {
    setSelectedSignalTypes(prevSignalTypes =>
      prevSignalTypes.includes(signalType)
        ? prevSignalTypes.filter(s => s !== signalType)
        : [...prevSignalTypes, signalType]
    );
  };
  
  // Function to clear all filters
  const clearAllFilters = () => {
    setSelectedStages([]);
    setSelectedSignalTypes([]);
    setSearchTerm("");
  };
  
  // Function to handle sort order change
  const handleSortOrderChange = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {tabView === "ae" ? "Account Executive Portal" : "Manager / CRO Dashboard"}
        </h2>
        
        <Tabs 
          value={tabView} 
          onValueChange={setTabView}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ae">AE View</TabsTrigger>
            <TabsTrigger value="manager">Manager/CRO View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tabView === "ae" && (
        <DealTable deals={filteredDeals} />
      )}
      
      {tabView === "manager" && (
        <>
          {/* CRO Dashboard Content - Enhanced UI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-purple-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('totalDeals')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-800 flex justify-between items-center">
                  <span>Total Deals</span>
                  {expandedCard === 'totalDeals' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{crmData.length}</div>
                <p className="text-xs text-purple-600 mt-1">Across all account executives</p>
                
                <Collapsible open={expandedCard === 'totalDeals'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Average Deal Value:</span> ${Math.round(crmData.reduce((sum, deal) => sum + (parseFloat(deal.deal_amount) || 0), 0) / Math.max(crmData.length, 1)).toLocaleString()}</p>
                      <p><span className="font-medium">Largest Deal:</span> ${Math.max(...crmData.map(deal => parseFloat(deal.deal_amount) || 0)).toLocaleString()}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('averageConfidence')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 flex justify-between items-center">
                  <span>Average Confidence</span>
                  {expandedCard === 'averageConfidence' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  {crmData.length > 0
                    ? `${Math.round(
                        crmData.reduce((sum, deal) => {
                          try {
                            const signals = typeof deal.signals === 'string' ? JSON.parse(deal.signals) : deal.signals;
                            if (signals && signals.signals && Array.isArray(signals.signals)) {
                              const highestConfidence = signals.signals.reduce((max, signal) => {
                                const confidence = signal.confidence || 0;
                                return Math.max(max, confidence);
                              }, 0);
                              return sum + highestConfidence;
                            }
                            return sum;
                          } catch (error) {
                            console.error("Error processing signals:", error);
                            return sum;
                          }
                        }, 0) / Math.max(crmData.length, 1)
                      )}%`
                    : "0%"}
                </div>
                <p className="text-xs text-green-600 mt-1">Based on AI signal confidence</p>
                
                <Collapsible open={expandedCard === 'averageConfidence'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Highest Confidence Deal:</span> {crmData.reduce((maxDeal, deal) => {
                        try {
                          const signals = typeof deal.signals === 'string' ? JSON.parse(deal.signals) : deal.signals;
                          if (signals && signals.signals && Array.isArray(signals.signals)) {
                            const highestConfidence = signals.signals.reduce((max, signal) => {
                              const confidence = signal.confidence || 0;
                              return Math.max(max, confidence);
                            }, 0);
                            
                            if (highestConfidence > (maxDeal.maxConfidence || 0)) {
                              return { deal: deal.deal_name, maxConfidence: highestConfidence };
                            }
                          }
                          return maxDeal;
                        } catch (error) {
                          console.error("Error processing signals:", error);
                          return maxDeal;
                        }
                      }, { deal: 'N/A', maxConfidence: 0 }).deal}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('priorityActions')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800 flex justify-between items-center">
                  <span>Priority Actions</span>
                  {expandedCard === 'priorityActions' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">
                  {crmData.length > 0
                    ? `${calculatePriorityActionsPercent(
                        crmData.filter(deal => {
                          try {
                            if (typeof deal.nba === 'string') {
                              const nba = JSON.parse(deal.nba);
                              return nba?.priority === 'high';
                            } else if (deal.nba && typeof deal.nba === 'object') {
                              return deal.nba?.priority === 'high';
                            }
                            return false;
                          } catch (error) {
                            console.error("Error processing NBA:", error);
                            return false;
                          }
                        }).length,
                        crmData.length
                      )}%`
                    : "0%"}
                </div>
                <p className="text-xs text-blue-600 mt-1">Deals needing immediate attention</p>
                
                <Collapsible open={expandedCard === 'priorityActions'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Total High Priority Deals:</span> {crmData.filter(deal => {
                        try {
                          if (typeof deal.nba === 'string') {
                            const nba = JSON.parse(deal.nba);
                            return nba?.priority === 'high';
                          } else if (deal.nba && typeof deal.nba === 'object') {
                            return deal.nba?.priority === 'high';
                          }
                          return false;
                        } catch (error) {
                          console.error("Error processing NBA:", error);
                          return false;
                        }
                      }).length}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleCardExpanded('averageDealAge')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800 flex justify-between items-center">
                  <span>Average Deal Age</span>
                  {expandedCard === 'averageDealAge' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">
                  {crmData.length > 0
                    ? `${Math.round(
                        crmData.reduce((sum, deal) => {
                          try {
                            const closeDate = new Date(deal.close_date);
                            const now = Date.now();
                            const diffInDays = (closeDate.getTime() - now) / (1000 * 3600 * 24);
                            return sum + diffInDays;
                          } catch (error) {
                            console.error("Error processing close date:", error);
                            return sum;
                          }
                        }, 0) / Math.max(crmData.length, 1)
                      )} days`
                    : "0 days"}
                </div>
                <p className="text-xs text-orange-600 mt-1">Time until deals are expected to close</p>
                
                <Collapsible open={expandedCard === 'averageDealAge'}>
                  <CollapsibleContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Oldest Deal:</span> {crmData.reduce((oldest, deal) => {
                        try {
                          const closeDate = new Date(deal.close_date);
                          if (closeDate > oldest.date) {
                            return { date: closeDate, name: deal.deal_name };
                          }
                          return oldest;
                        } catch (error) {
                          console.error("Error processing close date:", error);
                          return oldest;
                        }
                      }, { date: new Date(0), name: 'N/A' }).name}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deal Stage Distribution Chart */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Deal Stage Distribution</CardTitle>
                <CardDescription>Overview of deals in each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={extractDealStages(crmData)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {extractDealStages(crmData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Signal Type Analysis Chart */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Signal Type Analysis</CardTitle>
                <CardDescription>Distribution of different signal types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={processSignalTypeData(crmData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AEDashboard;
