
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent } from "@/components/ui/card";

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
  industry?: string;
  contact_title?: string;
  geo?: string;
  execution_plan?: string;
};

const Dashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("all");

  const handleFileProcessed = (crmSheet: any[]) => {
    if (crmSheet.length) {
      // Process the data and extract execution_plan from nba
      const processedCrmData = crmSheet.map(row => {
        let executionPlan = "";
        
        // Try to extract execution_plan from the nba field
        if (row.nba) {
          try {
            // First try parsing it as JSON
            const nbaData = typeof row.nba === 'object' ? row.nba : JSON.parse(row.nba);
            
            // Check if the parsed data has nba_action.execution_plan structure
            if (nbaData?.nba_action?.execution_plan) {
              executionPlan = nbaData.nba_action.execution_plan;
            }
          } catch (e) {
            console.error("Error parsing NBA data:", e);
            // If JSON parsing fails, try to extract using regex as fallback
            if (typeof row.nba === 'string') {
              const match = row.nba.match(/"execution_plan"\s*:\s*"([^"]*)"/);
              if (match && match[1]) {
                executionPlan = match[1];
              }
            }
          }
        }

        return {
          ...row,
          signals: typeof row.signals === 'string' ? row.signals : JSON.stringify(row.signals),
          actions: typeof row.actions === 'string' ? row.actions : JSON.stringify(row.actions),
          nba: typeof row.nba === 'string' ? row.nba : JSON.stringify(row.nba),
          execution_plan: executionPlan
        };
      });
      
      setCrmData(processedCrmData);
      
      // Extract unique AE list from owner field
      const uniqueAEs = [...new Set(crmSheet.map(row => row.owner))].filter(Boolean);
      setAeList(uniqueAEs);
      
      setFileUploaded(true);
      
      console.log("Processed CRM data with execution plans:", processedCrmData);
    } else {
      toast({
        title: "Error processing file",
        description: "Please check your file format and try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI-Powered GTM Platform</h1>
      
      {!fileUploaded ? (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Upload your company data</h2>
            <FileUploader onFileProcessed={handleFileProcessed} />
          </CardContent>
        </Card>
      ) : (
        <>
          <AEDashboard 
            crmData={crmData}
            aeList={aeList}
            selectedAE={selectedAE}
            setSelectedAE={setSelectedAE}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
