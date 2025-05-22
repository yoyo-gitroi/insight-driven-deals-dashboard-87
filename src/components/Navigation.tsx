
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PieChart } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5 text-primary" />
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          AI-Powered GTM Platform
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="default" size="sm" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
