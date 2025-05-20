
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import ClientInsights from "@/components/dashboard/ClientInsights";
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("performance");
  const [companyList, setCompanyList] = useState<string[]>([]);

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
      
      // Extract unique company list from company_name field
      const uniqueCompanies = [...new Set(crmSheet.map(row => row.company_name))].filter(Boolean);
      setCompanyList(uniqueCompanies);
      
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
      <div className="flex justify-between mb-4"> 
         <h1 className="text-3xl font-bold">AI-Powered GTM Platform</h1>  
         <div className="flex space-x-4">
           <div className="flex rounded-md overflow-hidden">
             <Button 
               className={viewMode === "cards" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
               onClick={() => setViewMode("cards")}
             >
               Card View
             </Button>
             <Button 
               className={viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
               onClick={() => setViewMode("table")}
             >
               Table View
             </Button>
           </div>
           <Button
             onClick={() => setDeveloperMode(prev => !prev)}
             className={
               developerMode
                 ? "bg-green-600 text-white hover:bg-green-700"
                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
             }
           >
             Developer Mode
           </Button>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="performance">Performance Dashboard</TabsTrigger>
              <TabsTrigger value="insights">Client Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="mt-6">
              <AEDashboard 
                crmData={crmData}
                aeList={aeList}
                selectedAE={selectedAE}
                setSelectedAE={setSelectedAE}
                developerMode={developerMode}
                viewMode={viewMode}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="mt-6">
              <ClientInsights data={crmData} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
