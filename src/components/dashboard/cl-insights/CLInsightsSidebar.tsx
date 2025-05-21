
import React from "react";
import { cn } from "@/lib/utils";

interface CLInsightsSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const CLInsightsSidebar: React.FC<CLInsightsSidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: "executive-summary", label: "Executive Summary" },
    { id: "signal-detection", label: "Signal Detection" },
    { id: "pattern-analysis", label: "Pattern Analysis" },
    { id: "icp-evolution", label: "ICP Evolution & Personas" },
    { id: "gtm-strategy", label: "GTM Strategy" },
    { id: "trends-actionables", label: "Trends & Actionables" }
  ];

  return (
    <div className="w-56 bg-[#0f172a] text-white rounded-lg p-4">
      <div className="mb-6">
        <h2 className="font-bold text-lg">GTM Intel</h2>
        <p className="text-xs text-gray-400">GTM Intelligence Engine</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeView === item.id 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:bg-blue-800/30 hover:text-white"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CLInsightsSidebar;
