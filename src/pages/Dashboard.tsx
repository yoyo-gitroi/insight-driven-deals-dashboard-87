
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import CLInsightsDashboard from "@/components/dashboard/CLInsightsDashboard";
import DataLoader from "@/components/dashboard/DataLoader";
import DashboardControls from "@/components/dashboard/DashboardControls";
import { processRawData, extractUniqueAEs, type CRMData } from "@/utils/dataProcessor";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const location = useLocation();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("all");
  const [developerMode, setDeveloperMode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [data,setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(
    location.state && (location.state as any).isLoading === true
  );
  const [dashboardView, setDashboardView] = useState<"AE" | "CL_Insight">("AE");

  useEffect(() => {
    // Check if we need to automatically fetch data (coming from the home page)
    if (location.state && (location.state as any).isLoading === true) {
      // This will be handled by the DataLoader component
      // We're just keeping the isLoading state
    }
  }, [location.state]);

  const handleFileProcessed = (crmSheet: any[]) => {
    const processedCrmData = processRawData(crmSheet);
   
    setData(JSON.stringify(crmSheet[1]));
    console.log("processedCrmData", processedCrmData);
    if (processedCrmData.length) {
      setCrmData(processedCrmData);
      
      // Extract unique AE list from owner field
      const uniqueAEs = extractUniqueAEs(processedCrmData);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navigation />
      <div className="container mx-auto p-4 sm:p-6 flex-1">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> 
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Aura AI-Powered GTM Platform
          </h1>  
          <div className="w-full sm:w-auto">
            {fileUploaded && (
              <DashboardControls 
                dashboardView={dashboardView}
                setDashboardView={setDashboardView}
                viewMode={viewMode}
                setViewMode={setViewMode}
                developerMode={developerMode}
                setDeveloperMode={setDeveloperMode}
              />
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
          {!fileUploaded ? (
            <DataLoader 
              onDataLoaded={handleFileProcessed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <>
              {dashboardView === "AE" ? (
                <AEDashboard 
                  crmData={crmData}
                  aeList={aeList}
                  selectedAE={selectedAE}
                  setSelectedAE={setSelectedAE}
                  developerMode={developerMode}
                  viewMode={viewMode}
                />
              ) : (
                <CLInsightsDashboard crmData={crmData} data={data} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
