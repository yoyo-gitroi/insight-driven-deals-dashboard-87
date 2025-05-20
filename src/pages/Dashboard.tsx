
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import ObjectionCharts from "@/components/dashboard/ObjectionCharts";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

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
  cl_insights?: any;
};

const Dashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("all");
  const [developerMode, setDeveloperMode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [dashboardView, setDashboardView] = useState<"AE" | "CL_Insight">("AE");

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

  // Handle view mode change
  const handleViewModeChange = (value: string) => {
    setDashboardView(value as "AE" | "CL_Insight");
  };

  const renderCLInsightDashboard = () => {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-4">CL Insight Dashboard</h2>
          <p className="text-gray-500">
            This dashboard shows data from the cl_insights column in the uploaded data.
          </p>
          
          {crmData.some(item => item.cl_insights) ? (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Available CL Insights</h3>
              {/* This would be replaced with actual visualizations using cl_insights data */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {crmData
                  .filter(item => item.cl_insights)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium">{item.company_name}</h4>
                      <p className="text-sm text-gray-600">
                        CL Insights data available
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 p-6 bg-yellow-50 rounded-md">
              <p className="text-amber-800">
                No CL Insights data found in the uploaded file. Please ensure your data includes a 'cl_insights' column.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Pass the view mode and change handler to Navigation */}
      <Navigation 
        viewMode={dashboardView} 
        onViewModeChange={handleViewModeChange} 
      />
      
      <div className="container mx-auto p-4 flex-1">
        <div className="flex justify-between mb-6"> 
           <h1 className="text-3xl font-bold">AI-Powered GTM Platform</h1>  
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
            {dashboardView === "AE" ? (
              // Show AE Dashboard when AE is selected
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
            ) : (
              // Show CL Insight Dashboard when CL_Insight is selected
              renderCLInsightDashboard()
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
