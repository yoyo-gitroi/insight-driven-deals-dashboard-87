
import React, { useState, useEffect } from "react";
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
};

type TranscriptData = {
  sr_no: number;
  transcripts: string;
  company_name: string;
  agenda: string;
  signals: string;
  actions: string;
  nba: string;
};

const Dashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [transcriptData, setTranscriptData] = useState<TranscriptData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("");

  const handleFileProcessed = (crmSheet: any[], transcriptSheet: any[]) => {
    if (crmSheet.length && transcriptSheet.length) {
      setCrmData(crmSheet);
      setTranscriptData(transcriptSheet);
      
      // Extract unique AE list from owner field
      const uniqueAEs = [...new Set(crmSheet.map(row => row.owner))].filter(Boolean);
      setAeList(uniqueAEs);
      
      setFileUploaded(true);
      toast({
        title: "File uploaded successfully",
        description: "Your data has been loaded into the dashboard"
      });
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
        <AEDashboard 
          crmData={crmData}
          transcriptData={transcriptData}
          aeList={aeList}
          selectedAE={selectedAE}
          setSelectedAE={setSelectedAE}
        />
      )}
    </div>
  );
};

export default Dashboard;
