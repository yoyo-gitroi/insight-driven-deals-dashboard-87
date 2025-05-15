
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Flag, Award } from "lucide-react";

interface KPISectionProps {
  kpiData: {
    totalDeals: number;
    totalObjections: number;
    highPriorityActions: number;
    successfulUpsells: number;
  };
}

const KPISection: React.FC<KPISectionProps> = ({ kpiData }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">Total Deals</span>
            </div>
            <p className="text-3xl font-bold">{kpiData.totalDeals}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Total Objections</span>
            </div>
            <p className="text-3xl font-bold">{kpiData.totalObjections}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Flag className="h-5 w-5 text-rose-500" />
              <span className="font-medium">High Priority</span>
            </div>
            <p className="text-3xl font-bold">{kpiData.highPriorityActions}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-green-500" />
              <span className="font-medium">Successful Upsells</span>
            </div>
            <p className="text-3xl font-bold">{kpiData.successfulUpsells}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPISection;
