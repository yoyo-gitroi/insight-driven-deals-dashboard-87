
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import ObjectionCharts from "@/components/dashboard/ObjectionCharts";
import { Button } from "@/components/ui/button";
import { LoaderComponent } from "@/components/ui/loader";
import { fetchGoogleSheetsData } from "@/utils/sheetsFetcher";

type CRMData = {
  sr_no?: number;
  company_name?: string;
  size?: string;
  deal_name?: string;
  deal_stage?: string;
  deal_amount?: number;
  owner?: string;
  close_date?: string;
  nba?: string;
  signals?: string;
  actions?: string;
  transcripts?: string;
  industry?: string;
  contact_title?: string;
  geo?: string;
};

const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1lHsZ2bB0KDq6_agl5FZMnJBW8xNkn_IYEzS_knuBIjI/";

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
      fetchDataFromGoogleSheets();
    }
  }, [location.state]);

  const fetchDataFromGoogleSheets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGoogleSheetsData(GOOGLE_SHEETS_URL);
      if (data.length) {
        handleFileProcessed(data);
      } else {
        toast({
          title: "No data found",
          description: "No data was found in the Google Sheet.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      toast({
        title: "Error fetching data",
        description: "Failed to load data from Google Sheets. Please try uploading manually.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileProcessed = (crmSheet: any[]) => {
    if (crmSheet.length) {
      console.log("Raw data received:", crmSheet);
      
      // Map the Google Sheets column names to the expected field names
      const processedCrmData = crmSheet.map(row => {
        return {
          sr_no: row['s.no'] || row.sr_no,
          company_name: row['Company Name'] || row.company_name,
          size: row['Size'] || row.size,
          deal_name: row['Deal Name'] || row.deal_name,
          deal_stage: row['Deal Stage'] || row.deal_stage,
          deal_amount: parseFloat(row['Deal Amount']) || row.deal_amount,
          owner: row['Owner'] || row.owner,
          close_date: row['Close Date'] || row.close_date,
          nba: row['nba'] || row.nba,
          signals: row['signals'] || row.signals,
          actions: row['actions'] || row.actions,
          transcripts: row['transcripts'] || row.transcripts,
          industry: row['Industry'] || row.industry,
          contact_title: row['Contact Title'] || row.contact_title,
          geo: row['Geo'] || row.geo
        };
      });
      
      console.log("Processed data:", processedCrmData);
      setCrmData(processedCrmData);
      
      // Extract unique AE list from owner field
      const uniqueAEs = [...new Set(processedCrmData.map(row => row.owner))].filter(Boolean);
      console.log("AE List:", uniqueAEs);
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

  const renderDashboardToggle = () => (
    <div className="flex space-x-1 bg-gray-200 p-1 rounded-md">
      <Button
        onClick={() => setDashboardView("AE")}
        className={`text-sm ${dashboardView === "AE" ? "bg-blue-600 text-white" : "bg-transparent text-black"}`}
      >
        AE
      </Button>
      <Button
        onClick={() => setDashboardView("CL_Insight")} 
        className={`text-sm ${dashboardView === "CL_Insight" ? "bg-blue-600 text-white" : "bg-transparent text-black"}`}
      >
        CL_Insight
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-screen">
        <LoaderComponent size="lg" text="Fetching data from Google Sheets..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between"> 
         <h1 className="text-3xl font-bold mb-6">AI-Powered GTM Platform</h1>  
         <div className="flex space-x-4">
           {fileUploaded && (
             <>
               {renderDashboardToggle()}
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
             </>
           )}
         </div>
      </div>
      
      {!fileUploaded ? (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Upload your company data</h2>
            <FileUploader onFileProcessed={handleFileProcessed} />
            <div className="mt-6">
              <Button onClick={fetchDataFromGoogleSheets} className="flex items-center">
                Or Load Data from Google Sheets
              </Button>
            </div>
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
