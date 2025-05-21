
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DealAccelerationRisk, StrategicNextActions } from "@/utils/dataProcessor";

interface GTMStrategyProps {
  riskData: DealAccelerationRisk;
  strategicActions: StrategicNextActions;
}

const GTMStrategy: React.FC<GTMStrategyProps> = ({ riskData, strategicActions }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">GTM Strategy</h1>
        <p className="text-sm text-gray-600">Strategic recommendations based on signal patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acceleration Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Acceleration Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskData["Top 4 Acceleration Opportunities"].map((item, idx) => (
              <div key={idx} className="pb-3 border-b last:border-0">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">{item.opportunity}</h3>
                  <Badge className={item.impact === "High" ? "bg-green-500" : "bg-blue-500"}>
                    {item.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm">Next Steps: {item.next_steps}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Risk Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskData["Top 4 Risk Factors"].map((item, idx) => (
              <div key={idx} className="pb-3 border-b last:border-0">
                <div className="mb-1">
                  <h3 className="font-medium">{item.risk_type}</h3>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-600">Warning Signs:</span> {item.early_warning_signs}</p>
                  <p><span className="text-gray-600">Mitigation:</span> {item.mitigation_playbooks}</p>
                </div>
              </div>
            ))}
            <div>
              <p className="text-sm font-medium mt-2">Prioritization Framework:</p>
              <p className="text-sm">{riskData.Prioritization Framework}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Next Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Next Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Prioritized Actions for Sales Leadership</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                {strategicActions["Top 5 Prioritized Actions for Sales Leadership"].map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Process Improvements</h3>
                <p className="text-sm">{strategicActions["Process Improvements"]}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Training & Coaching Plans</h3>
                <p className="text-sm">{strategicActions["Training & Coaching Plans"]}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Measurement Framework</h3>
                <p className="text-sm">{strategicActions["Measurement Framework"]}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Executive Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Account Executive Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Top Performing AEs</h3>
              <div className="space-y-3">
                {/* This would use real data in a production environment */}
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Bhaskar Sunkara</h4>
                    <Badge className="bg-green-500">70% Win Rate</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Avg. Deal Size:</span> $250k
                    </div>
                    <div>
                      <span className="text-gray-600">Cycle Time:</span> 60 days
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Randy Boysen</h4>
                    <Badge className="bg-green-500">60% Win Rate</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Avg. Deal Size:</span> $180k
                    </div>
                    <div>
                      <span className="text-gray-600">Cycle Time:</span> 75 days
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Lower Performing AEs</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Gomini Shreya</h4>
                    <Badge className="bg-yellow-500">55% Win Rate</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Avg. Deal Size:</span> $150k
                    </div>
                    <div>
                      <span className="text-gray-600">Cycle Time:</span> 90 days
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Yashaswi Pathak</h4>
                    <Badge className="bg-yellow-500">50% Win Rate</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Avg. Deal Size:</span> $120k
                    </div>
                    <div>
                      <span className="text-gray-600">Cycle Time:</span> 100 days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Training Needs Identified</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>All AEs: Enhanced training on advanced integration options and addressing integration objections head-on.</li>
              <li>Low-Performing AEs: Targeted coaching on articulating the product's value proposition, driving executive engagement, and negotiating pricing.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GTMStrategy;
