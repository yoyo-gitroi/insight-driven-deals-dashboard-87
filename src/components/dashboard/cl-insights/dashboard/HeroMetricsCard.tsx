
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle, DollarSign, Clock } from "lucide-react";

const HeroMetricsCard = () => {
  // Sample metrics - in a real application, these would come from props or a data source
  const metrics = {
    portfolioHealthScore: "72",
    pipelineAtRisk: "$2.4M",
    revenueAcceleration: "$3.7M",
    criticalDealsCount: 4
  };

  return (
    <Card className="shadow-md border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Portfolio Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-3 rounded-lg">
            <div className="text-xs text-indigo-600 font-medium">Health Score</div>
            <div className="text-2xl font-bold text-indigo-700">{metrics.portfolioHealthScore}<span className="text-sm font-normal">/100</span></div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Pipeline at Risk
            </div>
            <div className="text-2xl font-bold text-red-700">{metrics.pipelineAtRisk}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-green-600 font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Revenue Acceleration
            </div>
            <div className="text-2xl font-bold text-green-700">{metrics.revenueAcceleration}</div>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Critical Deals
            </div>
            <div className="text-2xl font-bold text-amber-700">{metrics.criticalDealsCount}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroMetricsCard;
