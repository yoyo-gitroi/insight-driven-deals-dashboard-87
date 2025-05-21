
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { CRMData } from "@/utils/dataProcessor";

interface CLInsightsDashboardProps {
  crmData: CRMData[];
}

const CLInsightsDashboard: React.FC<CLInsightsDashboardProps> = ({ crmData }) => {
  // Import the new dashboard implementation
  const CLInsightsDashboardImpl = React.lazy(() => import("./cl-insights/CLInsightsDashboard"));

  return (
    <div className="w-full">
      <React.Suspense fallback={
        <Card className="w-full mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-medium text-gray-700 mb-2">Loading CL Insights Dashboard</h2>
              <p className="text-gray-500">Please wait while we load the dashboard components...</p>
            </div>
          </CardContent>
        </Card>
      }>
        <CLInsightsDashboardImpl crmData={crmData} />
      </React.Suspense>
    </div>
  );
};

export default CLInsightsDashboard;
