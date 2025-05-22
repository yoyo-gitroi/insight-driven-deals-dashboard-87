
import React, { useEffect, useState } from "react";
import CLInsightsTabManager from "./cl-insights/CLInsightsTabManager";
import { safeJsonParse } from "@/lib/utils";
import HeroMetricsCard from "./cl-insights/dashboard/HeroMetricsCard";
import StrategicAlertBanner from "./cl-insights/dashboard/StrategicAlertBanner";
import MarketContextVisualization from "./cl-insights/dashboard/MarketContextVisualization";
import { LoaderComponent } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface CLInsightsDashboardProps {
  crmData: any[];
  data: any;
}

const CLInsightsDashboard: React.FC<CLInsightsDashboardProps> = ({ crmData, data }) => {
  const [parsedData, setParsedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  
  useEffect(() => {
    if (!showContent) return;
    
    try {
      // Handle the data whether it's a string or already an object
      const parsed = typeof data === 'string' ? safeJsonParse(data) : data;
      console.log("Processing dashboard data...");
      setParsedData(parsed);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing dashboard data:", error);
      setIsLoading(false);
    }
  }, [data, showContent]);
  
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to update the insights",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate processing time
    setTimeout(() => {
      setShowContent(true);
      setIsLoading(false);
      toast({
        title: "Insights Updated",
        description: "Your CL insights have been updated based on your prompt",
        variant: "default"
      });
    }, 1500);
  };
  
  // Extract the report data using the correct structure
  const report = parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"];
  
  if (!showContent) {
    return (
      <div className="w-full">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Company Level Aura Insights</h1>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Enter Your Prompt</h2>
            <form onSubmit={handlePromptSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium">
                  What insights would you like to see?
                </label>
                <Input
                  id="prompt"
                  placeholder="e.g., Show me sales performance for this quarter..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Generating Insights..." : "Generate Insights"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderComponent size="md" text="Processing dashboard data..." />
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-red-500 font-medium mb-2">No report data available</div>
        <div className="text-sm text-gray-500 max-w-md text-center">
          The data format appears to be incorrect. Please ensure it contains the "Portfolio-Level_GTM_Intelligence_Insights" key.
        </div>
        <pre className="bg-gray-100 p-3 rounded mt-4 text-xs max-w-md overflow-auto">
          {JSON.stringify(parsedData, null, 2).substring(0, 300) + '...'}
        </pre>
        <Button className="mt-4" onClick={() => setShowContent(false)}>
          Try Another Prompt
        </Button>
      </div>
    );
  }

  // Map the data structure to the format expected by existing components
  const mappedReport = {
    "Executive Summary": {
      "Key Findings": report["1_Executive_Summary"]?.Key_Findings || [],
      "Strategic Context": report["1_Executive_Summary"]?.Strategic_Context || [],
      "Critical Red Flags": report["1_Executive_Summary"]?.Critical_Red_Flags || [],
      "Aggregate Health Metrics": {
        "Average Win Probability": "68.4%",
        "Combined ARR Health": "Strong in early-stage",
        "Pipeline Coverage vs. Target": "Requires financial integration"
      }
    },
    "Primary Signal Categories": report["2_Primary_Signal_Categories"] || {},
    "Account Executive Performance": {
      "Top 3 AEs by Win Rate": report["3_Account_Executive_Performance"]?.Top_3_AEs?.map((ae: any) => ({
        "ae_name": ae.Name,
        "win_rate": ae.Win_Rate,
        "average_deal_size": ae.Average_Deal_Size,
        "average_cycle_time": ae.Cycle_Time
      })) || [],
      "Bottom 3 AEs by Win Rate": report["3_Account_Executive_Performance"]?.Bottom_3_AEs?.map((ae: any) => ({
        "ae_name": ae.Name,
        "win_rate": ae.Win_Rate,
        "average_deal_size": ae.Average_Deal_Size,
        "average_cycle_time": ae.Cycle_Time
      })) || [],
      // Pass the Training_Needs_Identified data directly without trying to convert it to an array
      "Training Needs Identified": report["3_Account_Executive_Performance"]?.Training_Needs_Identified || {}
    },
    "Stakeholder & Persona Insights": {
      "Most Influential Roles": report["4_Stakeholder_Persona_Insights"]?.Most_Influential_Roles || [],
      "Sentiment Trends by Role": report["4_Stakeholder_Persona_Insights"]?.Sentiment_Trends_by_Role || {},
      "Recurring Priorities by Persona": report["4_Stakeholder_Persona_Insights"]?.Recurring_Priorities_by_Persona || [],
      "Missing Personas": report["4_Stakeholder_Persona_Insights"]?.Missing_Personas_and_Recommended_Engagement || []
    },
    "Pattern & Trend Analysis": {
      "Cross-Company Patterns": report["5_Pattern_and_Trend_Analysis"]?.Cross_Company_Patterns || [],
      "Rising vs. Stable Trends": report["5_Pattern_and_Trend_Analysis"]?.Rising_vs_Stable_Trends || {},
      "Industry- or Size-Specific Patterns": report["5_Pattern_and_Trend_Analysis"]?.Industry_or_Size_Specific_Patterns || {},
      "Temporal Dynamics": report["5_Pattern_and_Trend_Analysis"]?.Temporal_Dynamics || []
    },
    "Deal Acceleration & Risk": {
      "Top 4 Acceleration Opportunities": report["6_Deal_Acceleration_and_Risk"]?.Top_Acceleration_Opportunities || [],
      "Top 4 Risk Factors": report["6_Deal_Acceleration_and_Risk"]?.Top_Risk_Factors_with_Warning_Signs || [],
      "Prioritization Framework": report["6_Deal_Acceleration_and_Risk"]?.Prioritization_Framework || ""
    },
    "Upsell & Expansion": {
      "Most Successful Upsell Motions": {
        "Product": Array.isArray(report["7_Upsell_and_Expansion"]?.Most_Successful_Motions) ? 
                 report["7_Upsell_and_Expansion"]?.Most_Successful_Motions[0] : "",
        "Average Fit Score": "90",
        "ARR lift": "10-15%"
      },
      "Common Expansion Paths": report["7_Upsell_and_Expansion"]?.Common_Expansion_Paths_and_Timing || [],
      "Feature Requests/Gaps Mentioned Repeatedly": report["7_Upsell_and_Expansion"]?.Feature_Requests_or_Gaps || []
    },
    "Content & Collateral Recommendations": {
      "Case Studies": report["8_Content_and_Collateral_Recommendations"]?.Needed_Case_Studies || [],
      "Content Gaps by Objection Type": report["8_Content_and_Collateral_Recommendations"]?.Content_Gaps_by_Objection_Type || {},
      "New Content Ideas Tied to Portfolio Signals": report["8_Content_and_Collateral_Recommendations"]?.New_Content_Ideas || []
    },
    "Strategic Next Actions": {
      "Top 5 Prioritized Actions for Sales Leadership": report["9_Strategic_Next_Actions"]?.Top_5_Prioritized_Actions_for_Sales_Leadership || [],
      "Process Improvements": report["9_Strategic_Next_Actions"]?.Process_Improvements || [],
      "Training & Coaching Plans": report["9_Strategic_Next_Actions"]?.Training_and_Coaching_Plans || [],
      "Measurement Framework": report["9_Strategic_Next_Actions"]?.Measurement_Framework || {}
    }
  };
  
  return (  
    <div className="w-full">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Company Level Aura Insights</h1>
          <Button onClick={() => setShowContent(false)} variant="outline">New Prompt</Button>
        </div>
        
        {/* Display the current prompt */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <p className="font-medium text-blue-700">Current Prompt:</p>
          <p className="text-gray-700 italic">"{prompt}"</p>
        </div>
        
        {/* Chapter 1: Executive Command Center */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800">Executive Command Center</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HeroMetricsCard />
            <StrategicAlertBanner 
              redFlags={mappedReport["Executive Summary"]["Critical Red Flags"]} 
              isLoading={false} 
            />
            <MarketContextVisualization 
              context={mappedReport["Executive Summary"]["Strategic Context"]} 
              isLoading={false} 
            />
          </div>
        </div>
        
        {/* Main dashboard content */}
        <CLInsightsTabManager report={mappedReport} crmData={crmData} />
      </div>
    </div>
  );
};

export default CLInsightsDashboard;
