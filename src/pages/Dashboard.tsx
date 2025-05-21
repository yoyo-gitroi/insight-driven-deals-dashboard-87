import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import ObjectionCharts from "@/components/dashboard/ObjectionCharts";
import CLInsightsDashboard from "@/components/dashboard/CLInsightsDashboard";
import DataLoader from "@/components/dashboard/DataLoader";
import DashboardControls from "@/components/dashboard/DashboardControls";
import { processRawData, extractUniqueAEs, type CRMData } from "@/utils/dataProcessor";

const Dashboard = () => {
  const location = useLocation();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("all");
  const [developerMode, setDeveloperMode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between"> 
         <h1 className="text-3xl font-bold mb-6">AI-Powered GTM Platform</h1>  
         <div className="flex space-x-4">
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
      
      {!fileUploaded ? (
        <DataLoader 
          onDataLoaded={handleFileProcessed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        <>
          {dashboardView === "AE" ? (
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
            <CLInsightsDashboard />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
