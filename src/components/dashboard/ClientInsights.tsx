
import React from "react";
import ViewToggle from "./ViewToggle";
import IntelligenceSummary from "./insights/IntelligenceSummary";
import KeyFindings from "./insights/KeyFindings";
import SignalDistribution from "./insights/SignalDistribution";
import PersonaInsights from "./insights/PersonaInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientInsightsProps {
  data: any;
}

const ClientInsights: React.FC<ClientInsightsProps> = ({ 
  data
}) => {
  const [activeView, setActiveView] = React.useState<"ae" | "company">("ae");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Insights Dashboard</h2>
        <ViewToggle activeView={activeView} onToggle={setActiveView} />
      </div>
      
      <IntelligenceSummary data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KeyFindings data={data} />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Opportunity Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  {/* Circular gauge visualization will go here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">76%</span>
                  </div>
                  <div className="absolute bottom-0 w-full text-center text-sm text-muted-foreground">
                    Strong opportunity based on stakeholder buy-in
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignalDistribution data={data} />
        <PersonaInsights data={data} />
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Critical Risk Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-red-500 px-4 py-3 bg-red-50 rounded">
              <h4 className="font-medium">Technical Integration Timeline</h4>
              <p className="text-sm text-muted-foreground">Customer has expressed concerns about meeting the Q1 integration deadline due to resource constraints</p>
            </div>
            <div className="border-l-4 border-red-500 px-4 py-3 bg-red-50 rounded">
              <h4 className="font-medium">Competing Internal Project</h4>
              <p className="text-sm text-muted-foreground">New digital transformation initiative may pull resources away from our implementation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientInsights;
