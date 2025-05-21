
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import CLInsightsDashboardImpl from "./cl-insights/CLInsightsDashboard";
import type { CRMData } from "@/utils/dataProcessor";

interface CLInsightsDashboardProps {
  crmData: CRMData[];
}

const CLInsightsDashboard: React.FC<CLInsightsDashboardProps> = ({ crmData }) => {
  return (
    <div className="w-full">
      <CLInsightsDashboardImpl crmData={crmData} />
    </div>
  );
};

export default CLInsightsDashboard;
