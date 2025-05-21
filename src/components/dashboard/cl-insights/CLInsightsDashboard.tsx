
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { extractGTMIntelligenceData } from "@/utils/dataProcessor";
import CLInsightsSidebar from "./CLInsightsSidebar";
import ExecutiveSummary from "./ExecutiveSummary";
import SignalDetection from "./SignalDetection";
import PatternAnalysis from "./PatternAnalysis";
import ICPEvolution from "./ICPEvolution";
import GTMStrategy from "./GTMStrategy";
import TrendsActionables from "./TrendsActionables";
import type { CRMData, GTMIntelligenceData } from "@/utils/dataProcessor";

interface CLInsightsDashboardProps {
  crmData: CRMData[];
}

const CLInsightsDashboard: React.FC<CLInsightsDashboardProps> = ({ crmData }) => {
  const [activeView, setActiveView] = useState<string>("executive-summary");
  const [gtmData, setGtmData] = useState<GTMIntelligenceData | null>(null);

  useEffect(() => {
    const extractedData = extractGTMIntelligenceData(crmData);
    console.log("Extracted GTM data:", extractedData);
    setGtmData(extractedData);
  }, [crmData]);

  // Loading state
  if (!gtmData) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Loading GTM Intelligence Data</h2>
          <p className="text-gray-500 mb-2">
            If this takes too long, please ensure your sheet includes a column named "cl_insight" 
            with the GTM Intelligence JSON data.
          </p>
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex">
        <CLInsightsSidebar activeView={activeView} setActiveView={setActiveView} />
        
        <div className="flex-1 ml-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-sm">
                All Companies
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                All Categories
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                All Patterns
              </Button>
            </div>
          </div>

          {activeView === "executive-summary" && (
            <ExecutiveSummary data={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Executive Summary"]} />
          )}
          
          {activeView === "signal-detection" && (
            <SignalDetection 
              primarySignals={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Primary Signal Categories"]}
              stakeholders={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Stakeholder & Persona Insights"]}
            />
          )}
          
          {activeView === "pattern-analysis" && (
            <PatternAnalysis 
              patternData={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Pattern & Trend Analysis"]}
              riskData={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Deal Acceleration & Risk"]}
            />
          )}
          
          {activeView === "icp-evolution" && (
            <ICPEvolution 
              aeData={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Account Executive Performance"]}
              personaData={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Stakeholder & Persona Insights"]}
            />
          )}
          
          {activeView === "gtm-strategy" && (
            <GTMStrategy 
              riskData={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Deal Acceleration & Risk"]}
              strategicActions={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Strategic Next Actions"]}
            />
          )}
          
          {activeView === "trends-actionables" && (
            <TrendsActionables 
              patternData={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Pattern & Trend Analysis"]}
              primarySignals={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Primary Signal Categories"]}
              upsellData={gtmData.output["Portfolio-Level GTM Intelligence Report"]["Upsell & Expansion"]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CLInsightsDashboard;
