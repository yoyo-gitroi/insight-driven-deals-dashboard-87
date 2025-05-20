
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { fetchGoogleSheetsData } from "@/utils/sheetsFetcher";

const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1lHsZ2bB0KDq6_agl5FZMnJBW8xNkn_IYEzS_knuBIjI/";

const Index = () => {
  const navigate = useNavigate();
  
  const handleGoToDashboard = async () => {
    try {
      // Navigate to dashboard with loading state
      navigate("/dashboard", { state: { isLoading: true } });
      
      // No need to handle the data here as we'll fetch it in the Dashboard component
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data from Google Sheets. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome to AI-Powered GTM Platform</h1>
          <p className="text-xl text-gray-600">
            Optimize your go-to-market strategy with advanced AI insights
          </p>
          <div className="pt-4">
            <Button size="lg" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
