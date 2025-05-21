
import React from "react";
import { toast } from "@/hooks/use-toast";
import FileUploader from "@/components/dashboard/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderComponent } from "@/components/ui/loader";
import { fetchGoogleSheetsData } from "@/utils/sheetsFetcher";

interface DataLoaderProps {
  onDataLoaded: (data: any[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1lHsZ2bB0KDq6_agl5FZMnJBW8xNkn_IYEzS_knuBIjI/";

const DataLoader: React.FC<DataLoaderProps> = ({ onDataLoaded, isLoading, setIsLoading }) => {
  const fetchDataFromGoogleSheets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGoogleSheetsData(GOOGLE_SHEETS_URL);
      if (data.length) {
        onDataLoaded(data);
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

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-screen">
        <LoaderComponent size="lg" text="Fetching data from Google Sheets..." />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-medium mb-4">Upload your company data</h2>
        <FileUploader onFileProcessed={onDataLoaded} />
        <div className="mt-6">
          <Button onClick={fetchDataFromGoogleSheets} className="flex items-center">
            Or Load Data from Google Sheets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataLoader;
