
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { FileBarChart } from "lucide-react";
import FileUploader from "@/components/dashboard/FileUploader";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ExecutiveSummary from "@/components/dashboard/manager/ExecutiveSummary";
import PipelineOverview from "@/components/dashboard/manager/PipelineOverview";
import TeamPerformance from "@/components/dashboard/manager/TeamPerformance";
import MarketAnalysis from "@/components/dashboard/manager/MarketAnalysis";
import StrategicSignals from "@/components/dashboard/manager/StrategicSignals";
import Forecast from "@/components/dashboard/manager/Forecast";

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

const ManagerDashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [activeSection, setActiveSection] = useState("summary");
  const [dateFilter, setDateFilter] = useState<[Date, Date] | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<string[]>([]);
  const [stageFilter, setStageFilter] = useState<string[]>([]);

  const handleFileProcessed = (crmSheet: any[]) => {
    if (crmSheet.length) {
      // Ensure JSON data is preserved as strings
      const processedCrmData = crmSheet.map(row => ({
        ...row,
        signals: typeof row.signals === 'string' ? row.signals : JSON.stringify(row.signals),
        actions: typeof row.actions === 'string' ? row.actions : JSON.stringify(row.actions),
        nba: typeof row.nba === 'string' ? row.nba : JSON.stringify(row.nba)
      }));
      
      setCrmData(processedCrmData);
      setFileUploaded(true);
      
      toast({
        title: "Data loaded successfully",
        description: `${processedCrmData.length} records loaded into the Manager Dashboard`,
      });
    } else {
      toast({
        title: "Error processing file",
        description: "Please check your file format and try again",
        variant: "destructive"
      });
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "summary":
        return <ExecutiveSummary data={crmData} />;
      case "pipeline":
        return <PipelineOverview data={crmData} />;
      case "team":
        return <TeamPerformance data={crmData} />;
      case "market":
        return <MarketAnalysis data={crmData} />;
      case "signals":
        return <StrategicSignals data={crmData} />;
      case "forecast":
        return <Forecast data={crmData} />;
      default:
        return <ExecutiveSummary data={crmData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manager/CRO Dashboard</h1>
        </div>
        
        {!fileUploaded ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <FileBarChart className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h2 className="text-xl font-medium">Upload your company data</h2>
                <p className="text-muted-foreground">Upload your CRM data to visualize executive insights</p>
              </div>
              <FileUploader onFileProcessed={handleFileProcessed} />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <ToggleGroup type="single" value={activeSection} onValueChange={(value) => value && setActiveSection(value)} className="justify-start">
                <ToggleGroupItem value="summary" aria-label="Executive Summary">Executive Summary</ToggleGroupItem>
                <ToggleGroupItem value="pipeline" aria-label="Pipeline Overview">Pipeline</ToggleGroupItem>
                <ToggleGroupItem value="team" aria-label="Team Performance">Team</ToggleGroupItem>
                <ToggleGroupItem value="market" aria-label="Market Analysis">Market</ToggleGroupItem>
                <ToggleGroupItem value="signals" aria-label="Strategic Signals">Signals</ToggleGroupItem>
                <ToggleGroupItem value="forecast" aria-label="Forecast & Projection">Forecast</ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {renderActiveSection()}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
