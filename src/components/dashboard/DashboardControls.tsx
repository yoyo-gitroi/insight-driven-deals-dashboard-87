
import React from "react";
import { Button } from "@/components/ui/button";

interface DashboardControlsProps {
  dashboardView: "AE" | "CL_Insight";
  setDashboardView: (view: "AE" | "CL_Insight") => void;
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
  developerMode: boolean;
  setDeveloperMode: (mode: boolean) => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  dashboardView,
  setDashboardView,
  viewMode,
  setViewMode,
  developerMode,
  setDeveloperMode
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="bg-muted rounded-lg p-1">
        <Button
          onClick={() => setDashboardView("AE")}
          variant={dashboardView === "AE" ? "default" : "ghost"}
          size="sm"
          className="text-sm"
        >
          AE Dashboard
        </Button>
        <Button
          onClick={() => setDashboardView("CL_Insight")}
          variant={dashboardView === "CL_Insight" ? "default" : "ghost"}
          size="sm"
          className="text-sm"
        >
          CL Insights
        </Button>
      </div>
      
      <div className="bg-muted rounded-lg p-1">
        <Button
          onClick={() => setViewMode("cards")}
          variant={viewMode === "cards" ? "default" : "ghost"}
          size="sm"
          className="text-sm"
        >
          Card View
        </Button>
        <Button
          onClick={() => setViewMode("table")}
          variant={viewMode === "table" ? "default" : "ghost"}
          size="sm"
          className="text-sm"
        >
          Table View
        </Button>
      </div>
      
      <Button 
        variant={developerMode ? "default" : "outline"}
        size="sm"
        onClick={() => setDeveloperMode(!developerMode)}
        className="text-sm"
      >
        {developerMode ? "Developer Mode: On" : "Developer Mode: Off"}
      </Button>
    </div>
  );
};

export default DashboardControls;
