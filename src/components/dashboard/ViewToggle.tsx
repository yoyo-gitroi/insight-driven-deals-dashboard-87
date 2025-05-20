
import React from "react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  activeView: "ae" | "company";
  onToggle: (view: "ae" | "company") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onToggle }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg shadow-sm w-fit">
      <Button
        variant={activeView === "ae" ? "default" : "ghost"}
        className={`px-4 py-1.5 ${activeView === "ae" ? "bg-primary text-white" : "text-muted-foreground bg-transparent"}`}
        onClick={() => onToggle("ae")}
      >
        AE View
      </Button>
      <Button
        variant={activeView === "company" ? "default" : "ghost"}
        className={`px-4 py-1.5 ${activeView === "company" ? "bg-primary text-white" : "text-muted-foreground bg-transparent"}`}
        onClick={() => onToggle("company")}
      >
        Company View
      </Button>
    </div>
  );
};

export default ViewToggle;
