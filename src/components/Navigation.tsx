
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">AI-Powered GTM Platform</Link>
      </div>
      <div className="flex items-center gap-2">
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
