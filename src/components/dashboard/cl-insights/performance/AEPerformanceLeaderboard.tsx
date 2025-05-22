
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AE_METRICS } from "../../objections/objectionConstants";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AEPerformanceLeaderboard = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">AE Performance Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Top Performers */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Top Performers</h3>
            <div className="space-y-3">
              {AE_METRICS.topPerformers.map((ae, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{ae.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white text-gray-700 border">
                      {ae.dealSize}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {ae.velocity}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {ae.winRate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Needs Attention */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Needs Attention</h3>
            <div className="space-y-3">
              {AE_METRICS.needsAttention.map((ae, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium">{ae.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ae.issues.map((issue, i) => (
                      <Badge key={i} variant="outline" className="bg-white text-red-600 border-red-200">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AEPerformanceLeaderboard;
