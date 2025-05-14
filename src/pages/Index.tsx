
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { LayoutDashboard, FileBarChart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome to AI-Powered GTM Platform</h1>
          <p className="text-xl text-gray-600">
            Optimize your go-to-market strategy with advanced AI insights
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                AE Dashboard
              </Button>
            </Link>
            <Link to="/manager-dashboard">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <FileBarChart className="h-5 w-5" />
                Manager/CRO Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
