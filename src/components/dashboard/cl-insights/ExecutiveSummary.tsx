
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExecutiveSummaryProps {
  executiveSummary: any;
  signalCategories: any;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ executiveSummary, signalCategories }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-medium">Key Findings</h3>
            <ul className="list-disc pl-5 space-y-2">
              {executiveSummary["Key Findings"].map((finding: string, index: number) => (
                <li key={index} className="text-sm">{finding}</li>
              ))}
            </ul>
            <div className="mt-4">
              <h3 className="font-medium">Health Metrics</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Win Probability</p>
                  <p className="font-medium">{executiveSummary["Aggregate Health Metrics"]["Average Win Probability"]}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">ARR Health</p>
                  <p className="text-xs">{executiveSummary["Aggregate Health Metrics"]["Combined ARR Health"].substring(0, 60)}...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* High-Impact Signal Cards */}
        <Card>
          <CardHeader>
            <CardTitle>High-Impact Signal Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-green-500 pl-3 py-1 bg-green-50 rounded-r-md">
              <div className="flex justify-between">
                <Badge className="bg-green-500">Expansion</Badge>
                <Badge variant="outline">Evaluation</Badge>
              </div>
              <p className="text-sm my-2">"We'll roll this out to the APAC team next quarter."</p>
              <p className="text-xs text-gray-500">— CIO, TheGuarantors</p>
              <div className="text-xs text-blue-600 mt-1">detect_expansion_opportunity()</div>
            </div>
            
            <div className="border-l-4 border-red-500 pl-3 py-1 bg-red-50 rounded-r-md">
              <div className="flex justify-between">
                <Badge className="bg-red-500">Tech Objection</Badge>
                <Badge variant="outline">Discovery</Badge>
              </div>
              <p className="text-sm my-2">"Researchers are in remote locations with limited connectivity."</p>
              <p className="text-xs text-gray-500">— Research Director</p>
              <div className="text-xs text-blue-600 mt-1">detect_connectivity_concern()</div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-3 py-1 bg-blue-50 rounded-r-md">
              <div className="flex justify-between">
                <Badge className="bg-blue-500">Buy-In</Badge>
                <Badge variant="outline">Demo</Badge>
              </div>
              <p className="text-sm my-2">"That would streamline our chapter operations significantly."</p>
              <p className="text-xs text-gray-500">— Chapter Coordinator</p>
              <div className="text-xs text-blue-600 mt-1">flag_enthusiasm()</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Urgent Follow-Ups Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Urgent Follow-Ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-medium">EcoReach Foundation</h3>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-medium">TechAlumni Network</h3>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-medium">GlobalLawyers Network</h3>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
              <div className="flex justify-between items-center pb-2">
                <h3 className="font-medium">VeteransBridge Alliance</h3>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Critical Red Flags */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Critical Red Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {executiveSummary["Critical Red Flags"].map((flag: string, index: number) => (
                <li key={index} className="text-sm bg-red-50 p-3 rounded-md">
                  {flag}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Funnel Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel Risk Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm">Objections before buy-in moments</p>
                <p className="text-sm font-medium">38% (high impact)</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "38%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm">Confusion about Chapters vs. Groups</p>
                <p className="text-sm font-medium">25% (medium)</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm">Expansion quotes never followed up</p>
                <p className="text-sm font-medium">45% (high impact)</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm">Interest quotes lacking CRM next step</p>
                <p className="text-sm font-medium">28% (medium)</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "28%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
