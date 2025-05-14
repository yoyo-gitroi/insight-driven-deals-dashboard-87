
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Book, 
  BarChart2, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { 
      name: "Overview", 
      path: "/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: "AE Playbook", 
      path: "/playbook", 
      icon: <Book className="h-5 w-5" /> 
    },
    { 
      name: "AE Insights", 
      path: "/insights", 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      name: "CMO Dashboard", 
      path: "/cmo", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: "Manager Dashboard", 
      path: "/manager", 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <h2 className="font-semibold text-lg">GTM Platform</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <TooltipProvider key={item.path} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={item.path} className="w-full">
                    <Button 
                      variant={isActive ? "default" : "ghost"} 
                      className={cn(
                        "w-full justify-start",
                        collapsed ? "px-2" : "px-4"
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span className="ml-2">{item.name}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            AI-Powered GTM Platform v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
