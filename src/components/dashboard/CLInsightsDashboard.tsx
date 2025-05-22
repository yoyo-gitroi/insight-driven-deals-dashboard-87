
import React from "react";
import CLInsightsTabManager from "./cl-insights/CLInsightsTabManager";

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
  
  const insights = parsedData?.Portfolio_Level_GTM_Intelligence_Insights || 
                  parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"] || {};
  
  // For debugging
  console.log("Insights data:", insights);
  
  // Map the insights data to the expected format for the CLInsightsTabManager
  const mappedReport = {
    "Executive Summary": {
      "Key Findings": insights["1. Executive Summary"]?.["Key Findings"] || [],
      "Strategic Context": insights["1. Executive Summary"]?.["Strategic Context"] || {},
      "Critical Red Flags": insights["1. Executive Summary"]?.["Critical Red Flags"] || {}
    },
    "Primary Signal Categories": {
      "Objection": insights["2. Primary Signal Categories"]?.["Objection"] || {},
      "Confusion": insights["2. Primary Signal Categories"]?.["Confusion"] || {},
      "Expansion": insights["2. Primary Signal Categories"]?.["Expansion"] || {},
      "SegmentDrift": {
        "Frequency across Portfolio": "Data not available",
        "Top 1 Signal": [],
        "Contextual Patterns": "Data not available",
        "Portfolio-Level Recommended Action": "Data not available"
      }
    },
    "Account Executive Performance": insights["3. Account Executive Performance"] || {},
    "Stakeholder & Persona Insights": insights["4. Stakeholder & Persona Insights"] || {},
    "Pattern & Trend Analysis": insights["5. Pattern & Trend Analysis"] || {},
    "Deal Acceleration & Risk": insights["6. Deal Acceleration & Risk"] || {},
    "Upsell & Expansion": insights["7. Upsell & Expansion"] || {},
    "Content & Collateral Recommendations": insights["8. Content & Collateral Recommendations"] || {},
    "Strategic Next Actions": insights["9. Strategic Next Actions"] || {}
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
