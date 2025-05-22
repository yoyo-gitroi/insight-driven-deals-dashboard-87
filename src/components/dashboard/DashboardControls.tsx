
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ListFilter, LayoutGrid, Code, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardControlsProps {
  dashboardView: "AE" | "CL_Insight";
  setDashboardView: React.Dispatch<React.SetStateAction<"AE" | "CL_Insight">>;
  viewMode: "table" | "cards";
  setViewMode: React.Dispatch<React.SetStateAction<"table" | "cards">>;
  developerMode: boolean;
  setDeveloperMode: React.Dispatch<React.SetStateAction<boolean>>;
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
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard View</span>
            <Badge variant="secondary" className="ml-1">
              {dashboardView === "AE" ? "AE" : "CL Insights"}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDashboardView("AE")}>
            AE Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDashboardView("CL_Insight")}>
            CL Insights
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dashboardView === "AE" && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
          className="relative"
          title={viewMode === "table" ? "Switch to Card View" : "Switch to Table View"}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant={developerMode ? "default" : "outline"}
        size="icon"
        onClick={() => setDeveloperMode(!developerMode)}
        className={`relative ${developerMode ? "bg-indigo-600" : ""}`}
        title="Toggle Developer Mode"
      >
        <Code className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DashboardControls;
