
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { ArrowRight, BarChart2, PieChart, Zap } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Welcome to AI-Powered GTM Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Optimize your go-to-market strategy with advanced AI insights and data-driven recommendations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <PieChart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Advanced Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visualize your sales data with interactive charts and metrics</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Zap className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Insights</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get actionable insights to improve your sales strategy</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <BarChart2 className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect to your data sources for real-time insights</p>
            </div>
          </div>

          <div className="pt-8">
            <Button size="lg" onClick={handleGoToDashboard} className="px-8 py-6 text-lg group hover:translate-y-[-2px] transition-transform">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
