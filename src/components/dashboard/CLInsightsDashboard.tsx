
import React, { useEffect } from "react";
import CLInsightsTabManager from "./cl-insights/CLInsightsTabManager";
import { toast } from "@/hooks/use-toast";

interface CLInsightsDashboardProps {
  crmData: any[];
  data: any;
}

const CLInsightsDashboard: React.FC<CLInsightsDashboardProps> = ({ crmData, data }) => {
  // Parse the data if it's a string
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.error("Error parsing data:", e);
      parsedData = {};
    }
  }
  
  // For debugging
  console.log("Insights data:", parsedData);
  
  // Check if we have valid data and show a toast if we don't
  useEffect(() => {
    if (!parsedData || Object.keys(parsedData).length === 0) {
      toast({
        title: "No insights data available",
        description: "Please make sure your sheet includes a 'cl_insight' column with valid JSON data.",
        variant: "destructive"
      });
    }
  }, [parsedData]);
  
  // Map the insights data to the expected format for the CLInsightsTabManager
  const mappedReport = {
    "Executive Summary": {
      "Key Findings": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Key Findings"] || 
                       parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Key Findings"] || [],
      "Strategic Context": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Strategic Context"] || 
                           parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Strategic Context"] || {},
      "Critical Red Flags": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Critical Red Flags"] || 
                            parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Critical Red Flags"] || {},
      "Aggregate Health Metrics": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Aggregate Health Metrics"] || 
                                 parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["1. Executive Summary"]?.["Aggregate Health Metrics"]
    },
    "Primary Signal Categories": {
      "Objection": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["2. Primary Signal Categories"]?.["Objection"] || 
                   parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["2. Primary Signal Categories"]?.["Objection"] || {},
      "Confusion": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["2. Primary Signal Categories"]?.["Confusion"] || 
                   parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["2. Primary Signal Categories"]?.["Confusion"] || {},
      "Expansion": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["2. Primary Signal Categories"]?.["Expansion"] || 
                   parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["2. Primary Signal Categories"]?.["Expansion"] || {},
      "SegmentDrift": {
        "Frequency across Portfolio": "Data not available",
        "Top 1 Signal": [],
        "Contextual Patterns": "Data not available",
        "Portfolio-Level Recommended Action": "Data not available"
      }
    },
    "Account Executive Performance": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["3. Account Executive Performance"] || 
                                   parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["3. Account Executive Performance"] || {},
    "Stakeholder & Persona Insights": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["4. Stakeholder & Persona Insights"] || 
                                     parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["4. Stakeholder & Persona Insights"] || {},
    "Pattern & Trend Analysis": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["5. Pattern & Trend Analysis"] || 
                               parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["5. Pattern & Trend Analysis"] || {},
    "Deal Acceleration & Risk": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["6. Deal Acceleration & Risk"] || 
                               parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["6. Deal Acceleration & Risk"] || {},
    "Upsell & Expansion": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["7. Upsell & Expansion"] || 
                         parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["7. Upsell & Expansion"] || {},
    "Content & Collateral Recommendations": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["8. Content & Collateral Recommendations"] || 
                                           parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["8. Content & Collateral Recommendations"] || {},
    "Strategic Next Actions": parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"]?.["9. Strategic Next Actions"] || 
                             parsedData?.["Portfolio_Level_GTM_Intelligence_Insights"]?.["9. Strategic Next Actions"] || {}
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Level Aura Insights</h1>
      </div>

      <CLInsightsTabManager report={mappedReport} crmData={crmData} />
    </div>
  );
};

export default CLInsightsDashboard;
