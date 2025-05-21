
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExecutiveSummary as ExecutiveSummaryType } from "@/utils/dataProcessor";

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryType;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
  const metricCards = [
    { title: "Emerging Personas", value: "4", change: "+2 from last quarter" },
    { title: "Signal Density", value: "4.1", change: "+0.3 from last quarter" },
    { title: "Missed Expansion", value: "45%", change: "High priority action" },
    { title: "New Stakeholders", value: "12", change: "+50% increase" }
  ];

  const urgentFollowUps = [
    { org: "EcoReach Foundation", type: "Expansion", status: "Middle VPs concern", today: true },
    { org: "TechAlumni Network", type: "Committee", status: "Presentation upcoming", today: true },
    { org: "GlobalLawyers Network", type: "Board", status: "Decision pending", today: true },
    { org: "VeteransBridge Alliance", type: "Privacy", status: "Control issues", today: true }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">GTM Signal Intelligence Report</h1>
      <p className="text-sm text-gray-600">Hivebrite's CRO-level insights from 30+ sales call transcripts and CRM data</p>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold">{card.value}</h3>
                <span className="text-xs text-green-600">{card.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Executive Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data["Key Findings"].map((finding, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm">{finding}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Urgent Follow-Ups */}
        <Card>
          <CardHeader>
            <CardTitle>Urgent Follow-Ups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentFollowUps.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.org}</p>
                  <p className="text-xs text-gray-600">{item.type} - {item.status}</p>
                </div>
                {item.today && (
                  <Badge className="bg-red-500">Today</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* High-Impact Signal Cards */}
      <Card>
        <CardHeader>
          <CardTitle>High-Impact Signal Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-green-500 p-3 rounded bg-white shadow">
              <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">Expansion Signal</Badge>
              <p className="italic text-sm mb-2">"We'll roll this out to the APAC team next quarter."</p>
              <p className="text-xs text-gray-600">— CIO</p>
              <div className="mt-2 bg-gray-50 p-1 rounded text-xs font-mono">detect_expansion_opportunity()</div>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="outline">Evaluation</Badge>
              </div>
            </div>
            
            <div className="border-l-4 border-red-500 p-3 rounded bg-white shadow">
              <Badge className="mb-2 bg-red-100 text-red-800 hover:bg-red-100">Tech Objection</Badge>
              <p className="italic text-sm mb-2">"Researchers are in remote locations with limited connectivity."</p>
              <p className="text-xs text-gray-600">— Research Director</p>
              <div className="mt-2 bg-gray-50 p-1 rounded text-xs font-mono">detect_connectivity_concern()</div>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="outline">Discovery</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Funnel Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel Risk Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Objections before buy-in moments</span>
                <span className="text-red-600 font-medium">38% (high impact)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: "38%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Confusion about Chapters vs. Groups</span>
                <span className="text-yellow-600 font-medium">25% (medium impact)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: "25%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Expansion quotes never followed up</span>
                <span className="text-red-600 font-medium">45% (high impact)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: "45%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Interest quotes lacking CRM next step</span>
                <span className="text-yellow-600 font-medium">28% (medium impact)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: "28%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
