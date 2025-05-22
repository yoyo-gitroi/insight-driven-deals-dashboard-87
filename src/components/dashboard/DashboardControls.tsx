
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
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-md">
        <Button
          onClick={() => setDashboardView("AE")}
          className={`text-sm ${dashboardView === "AE" ? "bg-blue-600 text-white" : "bg-transparent text-black"}`}
        >
          AE
        </Button>
        <Button
          onClick={() => setDashboardView("CL_Insight")}
          className={`text-sm ${dashboardView === "CL_Insight" ? "bg-blue-600 text-white" : "bg-transparent text-black"}`}
        >
          CL_Insight
        </Button>
      </div>
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-md">
        <Button
          className={`text-sm ${viewMode === "cards" ? "bg-blue-600 text-white" : "bg-transparent text-black"}`}
          onClick={() => setViewMode("cards")}
        >
          Card View
        </Button>
        <Button
          className={`text-sm ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-transparent text-black"}`}
          onClick={() => setViewMode("table")}
        >
          Table View
        </Button>
      </div>
      <div>
        <Button 
          className={
            developerMode
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }
          onClick={() => setDeveloperMode(!developerMode)}
        >
          Developer Mode
        </Button>
      </div>
    </div>
  );
};

export default DashboardControls;
