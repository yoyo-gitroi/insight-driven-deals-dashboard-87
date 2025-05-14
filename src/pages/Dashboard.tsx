
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";

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

const Dashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileProcessed = (crmSheet: any[]) => {
    if (crmSheet.length) {
      setIsUploading(true);
      // Simulate processing delay for better UX
      setTimeout(() => {
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
        setIsUploading(false);
        toast({
          title: "Data successfully loaded",
          description: `${processedCrmData.length} records imported and ready to analyze`,
          variant: "default"
        });
      }, 1500);
    } else {
      toast({
        title: "Error processing file",
        description: "Please check your file format and try again",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setFileUploaded(false);
    setCrmData([]);
    setAeList([]);
    setSelectedAE("all");
    toast({
      title: "Dashboard reset",
      description: "You can now upload a new dataset",
      variant: "default"
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-900">AI-Powered GTM Platform</h1>
        
        {fileUploaded && (
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload New Data
          </Button>
        )}
      </div>
      
      {!fileUploaded ? (
        <Card className="bg-gradient-to-br from-blue-50 to-white shadow-sm border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text-blue-900">Upload Your CRM Data</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-gray-600">
              Upload your company's CRM export to generate AI-driven insights and action recommendations.
            </p>
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-blue-200 shadow-inner">
              <FileUploader onFileProcessed={handleFileProcessed} />
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <FileUp className="h-4 w-4" />
                  <span>Supported formats: XLSX, CSV (max 20MB)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>Pro tip:</strong> Ensure your CRM export includes deal names, stages, amounts, and owner information 
                for the most comprehensive analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AEDashboard 
          crmData={crmData}
          aeList={aeList}
          selectedAE={selectedAE}
          setSelectedAE={setSelectedAE}
        />
      )}
      
      {isUploading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-700 font-medium">Processing your data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
