import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import FileUploader from "@/components/dashboard/FileUploader";
import { 
  LayoutDashboard, PieChart as PieChartIcon, BarChart2, Users, 
  MapPin, Zap, TrendingUp, Calendar, Filter, Download, FileText 
} from "lucide-react";
import { ExecutiveSummary } from "@/components/dashboard/manager/ExecutiveSummary";
import { PipelineOverview } from "@/components/dashboard/manager/PipelineOverview";
import { TeamPerformance } from "@/components/dashboard/manager/TeamPerformance";
import { MarketAnalysis } from "@/components/dashboard/manager/MarketAnalysis";
import { StrategicSignals } from "@/components/dashboard/manager/StrategicSignals";
import { ForecastProjection } from "@/components/dashboard/manager/ForecastProjection";
import { Link } from "react-router-dom";

// Define the data type for clarity
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
  create_date?: string;
  industry?: string;
  geo?: string;
};

// Probability mapping for deal stages
const stageProbability: Record<string, number> = {
  "Discovery": 0.2,
  "Qualification": 0.5,
  "Implementation": 0.8,
  "Closed Won": 1,
  "Closed Lost": 0
};

// Date ranges for filtering
const dateRanges = [
  { label: "Last 30 Days", value: "30days" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Last 6 Months", value: "6months" },
  { label: "Year to Date", value: "ytd" },
  { label: "All Time", value: "all" }
];

const ManagerDashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for filters
  const [dateRange, setDateRange] = useState("all");
  const [selectedTerritory, setSelectedTerritory] = useState("all");
  const [selectedDealSize, setSelectedDealSize] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedDealStage, setSelectedDealStage] = useState("all");
  
  // Derived state
  const [filteredData, setFilteredData] = useState<CRMData[]>([]);
  
  // Territory/Geo options derived from data
  const territories = ["all", ...Array.from(new Set(crmData.map(item => item.geo || "Unknown")))];
  
  // Industries derived from data
  const industries = ["all", ...Array.from(new Set(crmData.map(item => item.industry || "Unknown")))];
  
  // Deal stages derived from data
  const dealStages = ["all", ...Array.from(new Set(crmData.map(item => item.deal_stage)))];
  
  const handleFileProcessed = (crmSheet: any[]) => {
    setIsLoading(true);
    
    if (crmSheet.length) {
      // Ensure JSON data is preserved as strings
      const processedCrmData = crmSheet.map(row => ({
        ...row,
        signals: typeof row.signals === 'string' ? row.signals : JSON.stringify(row.signals),
        actions: typeof row.actions === 'string' ? row.actions : JSON.stringify(row.actions),
        nba: typeof row.nba === 'string' ? row.nba : JSON.stringify(row.nba)
      }));
      
      setCrmData(processedCrmData);
      setFilteredData(processedCrmData);
      setFileUploaded(true);
      
      toast({
        title: "Data loaded successfully",
        description: `Loaded ${processedCrmData.length} records for analysis`,
      });
    } else {
      toast({
        title: "Error processing file",
        description: "Please check your file format and try again",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };
  
  // Apply filters when any filter changes
  useEffect(() => {
    if (!crmData.length) return;
    
    let result = [...crmData];
    
    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateRange) {
        case "30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "quarter":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6months":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "ytd":
          cutoffDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      result = result.filter(item => {
        const closeDate = new Date(item.close_date);
        return closeDate >= cutoffDate;
      });
    }
    
    // Apply territory/geo filter
    if (selectedTerritory !== "all") {
      result = result.filter(item => (item.geo || "Unknown") === selectedTerritory);
    }
    
    // Apply deal size filter
    if (selectedDealSize !== "all") {
      switch (selectedDealSize) {
        case "small":
          result = result.filter(item => item.deal_amount < 50000);
          break;
        case "medium":
          result = result.filter(item => item.deal_amount >= 50000 && item.deal_amount < 200000);
          break;
        case "large":
          result = result.filter(item => item.deal_amount >= 200000 && item.deal_amount < 500000);
          break;
        case "enterprise":
          result = result.filter(item => item.deal_amount >= 500000);
          break;
      }
    }
    
    // Apply industry filter
    if (selectedIndustry !== "all") {
      result = result.filter(item => (item.industry || "Unknown") === selectedIndustry);
    }
    
    // Apply deal stage filter
    if (selectedDealStage !== "all") {
      result = result.filter(item => item.deal_stage === selectedDealStage);
    }
    
    setFilteredData(result);
  }, [crmData, dateRange, selectedTerritory, selectedDealSize, selectedIndustry, selectedDealStage]);

  // Export functionality
  const exportDashboardAsPDF = () => {
    // In a real implementation, this would generate a PDF
    console.log("Exporting dashboard as PDF");
    toast({
      title: "Export initiated",
      description: "Your dashboard export is being prepared (demo functionality)"
    });
  };
  
  const exportAsCSV = () => {
    // In a real implementation, this would generate a CSV
    console.log("Exporting data as CSV");
    toast({
      title: "Export initiated",
      description: "Your data export is being prepared (demo functionality)"
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manager/CRO Dashboard</h1>
        <div className="flex gap-2 items-center">
          {fileUploaded && (
            <>
              <Button variant="outline" onClick={exportDashboardAsPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={exportAsCSV}>
                <FileText className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </>
          )}
          <Link to="/">
            <Button variant="ghost" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
      
      {!fileUploaded ? (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Upload your company data</h2>
            <FileUploader onFileProcessed={handleFileProcessed} />
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </div>
        </div>
      ) : (
        <>
          {/* Filters Section */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="font-medium">Filters:</div>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Territory/Geo" />
                  </SelectTrigger>
                  <SelectContent>
                    {territories.map((territory) => (
                      <SelectItem key={territory} value={territory}>
                        {territory === "all" ? "All Territories" : territory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedDealSize} onValueChange={setSelectedDealSize}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Deal Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">{"< $50K"}</SelectItem>
                    <SelectItem value="medium">$50K - $200K</SelectItem>
                    <SelectItem value="large">$200K - $500K</SelectItem>
                    <SelectItem value="enterprise">{"> $500K"}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry === "all" ? "All Industries" : industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedDealStage} onValueChange={setSelectedDealStage}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Deal Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {dealStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage === "all" ? "All Stages" : stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 gap-6">
            {/* Executive Summary Section */}
            <ExecutiveSummary data={filteredData} stageProbability={stageProbability} />
            
            {/* Dashboard Navigation Tabs */}
            <Tabs defaultValue="pipeline" className="space-y-4">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="pipeline" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" /> Pipeline
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Team
                </TabsTrigger>
                <TabsTrigger value="market" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Market
                </TabsTrigger>
                <TabsTrigger value="signals" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Signals
                </TabsTrigger>
                <TabsTrigger value="forecast" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Forecast
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pipeline" className="space-y-4">
                <PipelineOverview data={filteredData} />
              </TabsContent>
              
              <TabsContent value="team" className="space-y-4">
                <TeamPerformance data={filteredData} />
              </TabsContent>
              
              <TabsContent value="market" className="space-y-4">
                <MarketAnalysis data={filteredData} />
              </TabsContent>
              
              <TabsContent value="signals" className="space-y-4">
                <StrategicSignals data={filteredData} />
              </TabsContent>
              
              <TabsContent value="forecast" className="space-y-4">
                <ForecastProjection data={filteredData} stageProbability={stageProbability} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;
