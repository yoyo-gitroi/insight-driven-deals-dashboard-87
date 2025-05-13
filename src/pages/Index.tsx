
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

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
          <div className="pt-4">
            <Link to="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
