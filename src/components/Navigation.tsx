
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileBarChart } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">AI-Powered GTM Platform</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/dashboard">
          <Button 
            variant={location.pathname === "/dashboard" ? "default" : "outline"} 
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            AE Dashboard
          </Button>
        </Link>
        <Link to="/manager-dashboard">
          <Button 
            variant={location.pathname === "/manager-dashboard" ? "default" : "outline"} 
            className="flex items-center gap-2"
          >
            <FileBarChart className="h-4 w-4" />
            Manager/CRO Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
