
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface NavigationProps {
  viewMode?: string;
  onViewModeChange?: (value: string) => void;
}

const Navigation = ({ viewMode = "AE", onViewModeChange }: NavigationProps) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">AI-Powered GTM Platform</Link>
      </div>
      <div className="flex items-center gap-4">
        {onViewModeChange && (
          <div className="border rounded-md overflow-hidden bg-gray-100">
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => {
                if (value) onViewModeChange(value);
              }}
            >
              <ToggleGroupItem 
                value="AE" 
                className={`px-4 py-1 ${viewMode === "AE" ? "bg-blue-600 text-white" : "bg-gray-100 text-black"}`}
              >
                AE
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="CL_Insight" 
                className={`px-4 py-1 ${viewMode === "CL_Insight" ? "bg-blue-600 text-white" : "bg-gray-100 text-black"}`}
              >
                CL_Insight
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
        <Link to="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
