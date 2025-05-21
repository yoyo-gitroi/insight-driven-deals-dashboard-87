
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const CLInsightsDashboard = () => {
  return (
    <div className="w-full">
      <Card className="w-full mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-medium text-gray-700 mb-2">CL Insights Dashboard</h2>
            <p className="text-gray-500">This area will be updated as you provide prompts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CLInsightsDashboard;
