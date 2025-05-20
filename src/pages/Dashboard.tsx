
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import ObjectionCharts from "@/components/dashboard/ObjectionCharts";
import { Button } from "@/components/ui/button";

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
};

const Dashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("all");
  const [developerMode, setDeveloperMode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const handleFileProcessed = (crmSheet: any[]) => {
    if (crmSheet.length) {
      console.log(crmSheet);
      // Ensure JSON data is preserved as strings
      const processedCrmData = crmSheet.map(row => ({
        ...row,
        signals: typeof row.signals === 'string' ? row.signals : JSON.stringify(row.signals),
        actions: typeof row.actions === 'string' ? row.actions : JSON.stringify(row.actions),
        nba: typeof row.nba === 'string' ? row.nba : JSON.stringify(row.nba)
      }));
      
      setCrmData(processedCrmData);
      
      // Extract unique AE list from owner field
      const uniqueAEs = [...new Set(crmSheet.map(row => row.owner))].filter(Boolean);
      setAeList(uniqueAEs);
      
      setFileUploaded(true);
      
      // Success toast notification
      toast({
        title: "Data imported successfully",
        description: `Loaded ${processedCrmData.length} deals from the file`,
        variant: "default"
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
      <div className="flex justify-between"> 
         <h1 className="text-3xl font-bold mb-6">AI-Powered GTM Platform</h1>  
         <div className="flex space-x-4">
           <div>
             <Button 
               className={viewMode === "cards" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}
               onClick={() => setViewMode("cards")}
             >
               Card View
             </Button>
             <Button 
               className={viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}
               onClick={() => setViewMode("table")}
             >
               Table View
             </Button>
           </div>
           <div onClick={() => setDeveloperMode(prev => !prev)}>
             <Button className={
               developerMode
                 ? "bg-green-600 text-white hover:bg-white hover:text-green-600"
                 : "bg-gray-200 text-black hover:bg-white hover:text-black"
             }>
               Developer Mode
             </Button>
           </div>
         </div>
      </div>
      
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
            developerMode={developerMode}
            viewMode={viewMode}
          />
          <div className="mt-8">
            <ObjectionCharts crmData={crmData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
