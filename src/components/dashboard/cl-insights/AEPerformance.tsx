
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import { SECTION_COLORS } from "../objections/objectionConstants";

interface AEPerformanceProps {
  aePerformance: {
    insight?: string;
    "Top Performers"?: string;
    "Bottom Performers"?: string;
    "Engagement Metrics"?: string;
    "Forecast Accuracy and Quota Attainment"?: string;
    "Training Needs"?: string;
    "Training Needs Identified"?: string[] | string;
    "Top 3 AEs by Win Rate"?: {
      ae_name: string;
      win_rate: string;
      average_deal_size: string;
      average_cycle_time: string;
    }[];
    "Bottom 3 AEs by Win Rate"?: {
      ae_name: string;
      win_rate: string;
      average_deal_size: string;
      average_cycle_time: string;
    }[];
  };
}

const AEPerformance: React.FC<AEPerformanceProps> = ({ aePerformance = {} }) => {
  // Handle case where Training Needs Identified is a string instead of array
  const trainingNeeds = aePerformance["Training Needs"] || aePerformance["Training Needs Identified"] || [];
  const trainingNeedsArray = Array.isArray(trainingNeeds) 
    ? trainingNeeds 
    : typeof trainingNeeds === 'string' 
      ? [trainingNeeds] 
      : [];

  return (
    <div className="space-y-6">
      {/* AE Performance Overview */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.performance }}>
        <CardHeader>
          <CardTitle>Account Executive Performance Overview</CardTitle>
          <CardDescription>Analysis of sales performance and effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">{aePerformance.insight || "No performance insights available"}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  Top Performers
                </h3>
                <Badge className="bg-green-100 text-green-800">High Velocity</Badge>
              </div>
              <p className="text-gray-700">{aePerformance["Top Performers"] || "No top performer data available"}</p>
            </div>

            {/* Bottom Performers */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center">
                  <TrendingDown className="h-4 w-4 text-amber-600 mr-2" />
                  Performance Challenges
                </h3>
                <Badge className="bg-amber-100 text-amber-800">Needs Attention</Badge>
              </div>
              <p className="text-gray-700">{aePerformance["Bottom Performers"] || "No performance challenge data available"}</p>
            </div>

            {/* Engagement Metrics */}
            {aePerformance["Engagement Metrics"] && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Engagement Metrics</h3>
                <p className="text-gray-700">{aePerformance["Engagement Metrics"]}</p>
              </div>
            )}

            {/* Forecast Accuracy */}
            {aePerformance["Forecast Accuracy and Quota Attainment"] && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Forecast Accuracy</h3>
                <p className="text-gray-700">{aePerformance["Forecast Accuracy and Quota Attainment"]}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Training Needs */}
      <Card>
        <CardHeader className="bg-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Training & Development Needs
              </CardTitle>
              <CardDescription>Identified skill gaps and coaching requirements</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {trainingNeedsArray.length > 0 ? (
              trainingNeedsArray.map((need, index) => (
                <div key={index} className="bg-indigo-50/50 p-3 rounded-lg border-l-2 border-indigo-400">
                  <p className="text-gray-700">{need}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No specific training needs identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AE Rankings */}
      {(aePerformance["Top 3 AEs by Win Rate"] || aePerformance["Bottom 3 AEs by Win Rate"]) && (
        <Card>
          <CardHeader>
            <CardTitle>Account Executive Rankings</CardTitle>
            <CardDescription>Based on win rate, deal size, and cycle time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Top AEs Table */}
              {aePerformance["Top 3 AEs by Win Rate"] && aePerformance["Top 3 AEs by Win Rate"].length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-700">Top Performers</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Name</th>
                          <th className="py-2 px-4 border-b text-left">Win Rate</th>
                          <th className="py-2 px-4 border-b text-left">Avg. Deal Size</th>
                          <th className="py-2 px-4 border-b text-left">Cycle Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aePerformance["Top 3 AEs by Win Rate"].map((ae, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{ae.ae_name}</td>
                            <td className="py-2 px-4 border-b text-green-600 font-medium">{ae.win_rate}</td>
                            <td className="py-2 px-4 border-b">{ae.average_deal_size}</td>
                            <td className="py-2 px-4 border-b">{ae.average_cycle_time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bottom AEs Table */}
              {aePerformance["Bottom 3 AEs by Win Rate"] && aePerformance["Bottom 3 AEs by Win Rate"].length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-amber-700">Needs Improvement</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Name</th>
                          <th className="py-2 px-4 border-b text-left">Win Rate</th>
                          <th className="py-2 px-4 border-b text-left">Avg. Deal Size</th>
                          <th className="py-2 px-4 border-b text-left">Cycle Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aePerformance["Bottom 3 AEs by Win Rate"].map((ae, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{ae.ae_name}</td>
                            <td className="py-2 px-4 border-b text-amber-600 font-medium">{ae.win_rate}</td>
                            <td className="py-2 px-4 border-b">{ae.average_deal_size}</td>
                            <td className="py-2 px-4 border-b">{ae.average_cycle_time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AEPerformance;
