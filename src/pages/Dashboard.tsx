import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AEDashboard from "@/components/dashboard/AEDashboard";
import CLInsightsDashboard from "@/components/dashboard/CLInsightsDashboard";
import DataLoader from "@/components/dashboard/DataLoader";
import DashboardControls from "@/components/dashboard/DashboardControls";
import { processRawData, extractUniqueAEs, type CRMData } from "@/utils/dataProcessor";
import Navigation from "@/components/Navigation";

// The predefined static data for demo/development
const DEMO_GTM_INSIGHTS = {
  "Portfolio-Level_GTM_Intelligence_Insights": {
    // ... content from the provided data JSON
    // This is the sample/demo data that will be used if no real data is provided
    "1_Executive_Summary": {
      "Key_Findings": [
        "Integration Objections Dominate Across Portfolio: Over 70% of deals report integration-related concerns, particularly with legacy systems, fragmented data sources, and demands for multi-cloud or API-based ingestion.",
        "Product Fit Concerns Reflect Diverse Industry and Scale Needs: Objections tied to product fit vary by sector—complex B2B/B2C mixes (HubSpot), small-mid market simplification demands (Amadeus, Chatham Bars Inn), and unique operational models (Cognizant services).",
        "Emerging Expansion Signals in Most Accounts: 6 out of 10 companies show clear upsell/expansion interest, often linked to multi-region rollout (TheGuarantors), organizational adoption plans (Amadeus), or feature growth (Billtrust).",
        "Confusion and Reporting Terminology Hinder Adoption: Multiple accounts (BigBasket, Billtrust, Helen of Troy) have recurring confusion about metric definitions, onboarding timelines, and analytics outputs, slowing momentum.",
        "Pricing and ROI Skepticism Constrains Deal Velocity Primarily in Mid-Market and Cost-Sensitive Segments (ecoATM, Chatham Bars Inn).",
        "Deal Velocity & Win Probability Vary by Account Complexity and Stakeholder Alignment: Velocity ranges from slightly slower (~-17% Skipify, BigBasket) to significantly faster (+20% Priceline). Win probabilities correlate with executive sponsorship and resolution of integration/product fit concerns.",
        "Stakeholder Gaps Limit Progress: Missing roles include procurement, finance, IT security, executive sponsors, and business unit leaders, with recommendations to engage early for risk mitigation."
      ],
      "Strategic_Context": [
        "Market Acceleration in AI/LLM-Powered Analytics: AI-driven insights and automation are driving adoption across financial services, travel, retail/ecomm, and SaaS, with customer demand for rapid time-to-value and integrated workflows.",
        "Legacy and Fragmented Tech Stacks Create Multi-Vendor Complexity: Customers rely on tools like Power BI, Snowflake, Salesforce, Domo, Kafka, internal ETLs, and bespoke platforms leading to integration friction and technical objections.",
        "Industry Vertical Nuances Shape Adoption Barriers: Hospitality customers emphasize budget and direct industry references; enterprise SaaS accounts focus on product fit with complex B2B/B2C models; IT services firms require cross-unit adoption and scalable insights.",
        "Competitive Pressure from Hyperscalers and Incumbents: Pilots with Google, People.ai, and internal tooling create competitive evaluation pressures, demanding clear differentiation in integration ease, automation, and actionability.",
        "Economic/Timing Constraints Influence Bandwidth: Year-end cycles, budget commitments, and resource limitations affect timeline adherence and require flexible, asynchronous engagement models."
      ],
      "Critical_Red_Flags": [
        "Unresolved Integration blockers in key technical accounts (BigBasket, Yatra) threaten timeline and adoption.",
        "ROI and pricing objections in cost-sensitive clients (ecoATM, Chatham Bars Inn) slow progression significantly.",
        "Stakeholder misalignment or missing roles, notably in security compliance (Amadeus) and procurement (Iron Mountain).",
        "Product fit skepticism, especially around handling diverse data mixes and complex workflows (HubSpot, Helen of Troy).",
        "Emerging signs of competitive evaluation fatigue or delays in decision making due to parallel pilots (Iron Mountain, HubSpot)."
      ]
    },
    // ... the rest of the data structure would go here
    // Omitted for brevity, but would include all sections from the provided JSON
  }
};

const Dashboard = () => {
  const location = useLocation();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);
  const [aeList, setAeList] = useState<string[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("all");
  const [developerMode, setDeveloperMode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [dashboardData, setDashboardData] = useState<any>(DEMO_GTM_INSIGHTS);
  const [isLoading, setIsLoading] = useState(
    location.state && (location.state as any).isLoading === true
  );
  const [dashboardView, setDashboardView] = useState<"AE" | "CL_Insight">("AE");

  useEffect(() => {
    // Check if we need to automatically fetch data (coming from the home page)
    if (location.state && (location.state as any).isLoading === true) {
      // This will be handled by the DataLoader component
      // We're just keeping the isLoading state
    }
  }, [location.state]);

  const handleFileProcessed = (crmSheet: any[]) => {
    const processedCrmData = processRawData(crmSheet);
   
    // If we have additional data in the second sheet, use it for the dashboard
    if (crmSheet.length > 1 && crmSheet[1]) {
      setDashboardData(crmSheet[1]);
    }
    
    console.log("processedCrmData", processedCrmData);
    if (processedCrmData.length) {
      setCrmData(processedCrmData);
      
      // Extract unique AE list from owner field
      const uniqueAEs = extractUniqueAEs(processedCrmData);
      setAeList(uniqueAEs);
      
      setFileUploaded(true);  
      
      // Success toast notification
      toast({
        title: "Data imported successfully",
        description: `Loaded ${processedCrmData.length} deals from the file`,
        variant: "default"
      });
    } else {
      toast({
        title: "Error processing file",
        description: "Please check your file format and try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navigation />
      <div className="container mx-auto p-4 sm:p-6 flex-1">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> 
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Aura AI-Powered GTM Platform
          </h1>  
          <div className="w-full sm:w-auto">
            {fileUploaded && (
              <DashboardControls 
                dashboardView={dashboardView}
                setDashboardView={setDashboardView}
                viewMode={viewMode}
                setViewMode={setViewMode}
                developerMode={developerMode}
                setDeveloperMode={setDeveloperMode}
              />
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
          {!fileUploaded ? (
            <DataLoader 
              onDataLoaded={handleFileProcessed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <>
              {dashboardView === "AE" ? (
                <AEDashboard 
                  crmData={crmData}
                  aeList={aeList}
                  selectedAE={selectedAE}
                  setSelectedAE={setSelectedAE}
                  developerMode={developerMode}
                  viewMode={viewMode}
                />
              ) : (
                <CLInsightsDashboard crmData={crmData} data={dashboardData} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
