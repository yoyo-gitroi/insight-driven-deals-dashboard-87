
import React, { useEffect, useState } from "react";
import CLInsightsTabManager from "./cl-insights/CLInsightsTabManager";
import { safeJsonParse } from "@/lib/utils";
import HeroMetricsCard from "./cl-insights/dashboard/HeroMetricsCard";
import StrategicAlertBanner from "./cl-insights/dashboard/StrategicAlertBanner";
import MarketContextVisualization from "./cl-insights/dashboard/MarketContextVisualization";

interface CLInsightsDashboardProps {
  crmData: any[];
  data: any;
}

const CLInsightsDashboard: React.FC<CLInsightsDashboardProps> = ({ crmData, data }) => {
  const [parsedData, setParsedData] = useState<any>(null);
  
  useEffect(() => {
    try {
      const parsed = typeof data === 'string' ? safeJsonParse(data) : data;
      setParsedData(parsed);
      console.log("Parsed data:", parsed);
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  }, [data]);
  
  // Extract the report data from either the original format or the new format
  const report = parsedData?.["Portfolio-Level GTM Intelligence Report"] || 
                parsedData?.["Portfolio-Level_GTM_Intelligence_Insights"];
  
  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading data...</div>
      </div>
    );
  }

  // Map the new data structure to the format expected by existing components
  const mappedReport = {
    "Executive Summary": {
      "Key Findings": report["1_Executive_Summary"]?.Key_Findings || 
                    report["Executive Summary"]?.["Key Findings"] || [],
      "Strategic Context": report["1_Executive_Summary"]?.Strategic_Context || 
                        report["Executive Summary"]?.["Strategic Context"] || [],
      "Critical Red Flags": report["1_Executive_Summary"]?.Critical_Red_Flags || 
                          report["Executive Summary"]?.["Critical Red Flags"] || [],
      "Aggregate Health Metrics": report["Executive Summary"]?.["Aggregate Health Metrics"] || {
        "Average Win Probability": "68.4%",
        "Combined ARR Health": "Strong in early-stage",
        "Pipeline Coverage vs. Target": "Requires financial integration"
      }
    },
    "Primary Signal Categories": {
      "Objection": {
        "Frequency across Portfolio": "80% of deals",
        "Top 3 Signals": [
          { "signal_type": "Integration", "avg_confidence": "87.14%" },
          { "signal_type": "Product Fit", "avg_confidence": "84.37%" },
          { "signal_type": "Pricing", "avg_confidence": "92.33%" }
        ],
        "Contextual Patterns": "Integration concerns in companies with complex systems",
        "Portfolio-Level Recommended Action": "Develop objection handling materials"
      },
      "Confusion": {
        "Frequency across Portfolio": "50% of deals",
        "Top 3 Signals": [
          { "signal_type": "Analytics", "avg_confidence": "79.17%" },
          { "signal_type": "Reporting Terms", "avg_confidence": "78%" },
          { "signal_type": "Onboarding", "avg_confidence": "76.66%" }
        ],
        "Contextual Patterns": "Confusion in technical stakeholders",
        "Portfolio-Level Recommended Action": "Create clear materials"
      },
      "Expansion": {
        "Frequency across Portfolio": "60% of deals",
        "Top 3 Signals": [
          { "signal_type": "Feature Usage Growth", "avg_confidence": "82.25%" },
          { "signal_type": "Org-Wide Adoption", "avg_confidence": "72.5%" }
        ],
        "Contextual Patterns": "Feature growth after deployment",
        "Portfolio-Level Recommended Action": "Enable AEs for upsell"
      }
    },
    "Account Executive Performance": {
      "Top 3 AEs by Win Rate": report["3_Account_Executive_Performance"]?.Top_3_AEs?.map((ae: any) => ({
        "ae_name": ae.Name,
        "win_rate": ae.Win_Rate.split(';')[0],
        "average_deal_size": ae.Average_Deal_Size,
        "average_cycle_time": ae.Cycle_Time
      })) || [],
      "Bottom 3 AEs by Win Rate": report["3_Account_Executive_Performance"]?.Bottom_3_AEs?.map((ae: any) => ({
        "ae_name": ae.Name,
        "win_rate": ae.Win_Rate,
        "average_deal_size": ae.Average_Deal_Size,
        "average_cycle_time": ae.Cycle_Time
      })) || [],
      "Training Needs Identified": report["3_Account_Executive_Performance"]?.Training_Needs_Identified?.Negotiation ? 
        [report["3_Account_Executive_Performance"].Training_Needs_Identified.Negotiation, 
         report["3_Account_Executive_Performance"].Training_Needs_Identified["Solution-Selling"]] : 
        ["Enhanced training on integration", "Coaching on value proposition"]
    },
    "Stakeholder & Persona Insights": {
      "Most Influential Roles": Array.isArray(report["4_Stakeholder_Persona_Insights"]?.Most_Influential_Roles) ? 
        report["4_Stakeholder_Persona_Insights"].Most_Influential_Roles.join(', ') : 
        "Directors of Analytics, typically champions",
      "Sentiment Trends by Role": {
        "Directors of Analytics": "Positive, requires demonstrable value",
        "Infrastructure Leads": "Generally positive, focus on API connections",
        "Business Leads": "Focus on business value and alignment"
      },
      "Recurring Priorities by Persona": {
        "Directors of Analytics": "Actionable insights and easy onboarding",
        "IT/Infrastructure": "Seamless integration and data security",
        "Business Leaders": "Increased revenue and demonstrable ROI"
      },
      "Missing Personas": report["4_Stakeholder_Persona_Insights"]?.Missing_Personas_and_Recommended_Engagement?.map((p: any) => 
        `${p.Role}: ${p.Rationale}`
      ) || ["Executive Sponsors", "Procurement/Legal"],
      "Recommended Engagement": "Engage leaders and emphasize strategic value"
    },
    "Pattern & Trend Analysis": {
      "Cross-Company Patterns": report["5_Pattern_and_Trend_Analysis"]?.Cross_Company_Patterns || [],
      "Rising vs. Stable Trends": {
        "Rising Trends": report["5_Pattern_and_Trend_Analysis"]?.Rising_vs_Stable_Trends?.Rising || 
                     "Concerns surrounding data security",
        "Stable Trends": report["5_Pattern_and_Trend_Analysis"]?.Rising_vs_Stable_Trends?.Stable || 
                      "Need for automated analytics"
      },
      "Industry- or Size-Specific Patterns": report["5_Pattern_and_Trend_Analysis"]?.Industry_or_Size_Specific_Patterns || {
        "IT Services": "Focus on ease of deployment",
        "Financial Services": "Focus on data quality"
      },
      "Temporal Dynamics": report["5_Pattern_and_Trend_Analysis"]?.Temporal_Dynamics?.join(' ') || 
                        "Integration objections spike during deployment"
    },
    "Deal Acceleration & Risk": {
      "Top 4 Acceleration Opportunities": report["6_Deal_Acceleration_and_Risk"]?.Top_Acceleration_Opportunities?.map((o: any) => ({
        "opportunity": o.Opportunity,
        "impact": o.Impact,
        "next_steps": o.Next_Steps
      })) || [],
      "Top 4 Risk Factors": report["6_Deal_Acceleration_and_Risk"]?.Top_Risk_Factors_with_Warning_Signs?.map((r: any) => ({
        "risk_type": r.Risk,
        "early_warning_signs": r.Warning_Signs,
        "mitigation_playbooks": r.Mitigation
      })) || [],
      "Prioritization Framework": report["6_Deal_Acceleration_and_Risk"]?.Prioritization_Framework || 
                               "Prioritize deals by weighting"
    },
    "Upsell & Expansion": {
      "Most Successful Upsell Motions": {
        "Product": report["7_Upsell_and_Expansion"]?.Most_Successful_Motions?.[0] || 
                "automated root cause module",
        "Average Fit Score": "90",
        "ARR lift": "10-15%"
      },
      "Common Expansion Paths": report["7_Upsell_and_Expansion"]?.Common_Expansion_Paths_and_Timing?.join(' ') || 
                              "From analytics to all products",
      "Feature Requests/Gaps Mentioned Repeatedly": report["7_Upsell_and_Expansion"]?.Feature_Requests_or_Gaps || 
                                                 ["More connectors", "Better visualizations"]
    },
    "Content & Collateral Recommendations": {
      "Case Studies": report["8_Content_and_Collateral_Recommendations"]?.Needed_Case_Studies || 
                   ["Data from large enterprises"],
      "Content Gaps by Objection Type": report["8_Content_and_Collateral_Recommendations"]?.Content_Gaps_by_Objection_Type?.Integration || 
                                     "Material over plug-and-play systems",
      "New Content Ideas Tied to Portfolio Signals": report["8_Content_and_Collateral_Recommendations"]?.New_Content_Ideas?.join(', ') || 
                                                  "Case studies for enterprises"
    },
    "Strategic Next Actions": {
      "Top 5 Prioritized Actions for Sales Leadership": report["9_Strategic_Next_Actions"]?.Top_5_Prioritized_Actions_for_Sales_Leadership || 
                                                     ["Provide clear POC guide", "Emphasize communication"],
      "Process Improvements": report["9_Strategic_Next_Actions"]?.Process_Improvements?.join(', ') || 
                           "Refine integration process",
      "Training & Coaching Plans": report["9_Strategic_Next_Actions"]?.Training_and_Coaching_Plans?.join(', ') || 
                                "Training over integration",
      "Measurement Framework": report["9_Strategic_Next_Actions"]?.Measurement_Framework?.OKRs?.join(', ') || 
                            "Track revenue and growth"
    }
  };
  
  return (  
    <div className="w-full">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Company Level Aura Insights</h1>
        </div>
        
        {/* Chapter 1: Executive Command Center */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800">Executive Command Center</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HeroMetricsCard />
            <StrategicAlertBanner redFlags={mappedReport["Executive Summary"]["Critical Red Flags"]} />
            <MarketContextVisualization context={mappedReport["Executive Summary"]["Strategic Context"]} />
          </div>
        </div>
        
        {/* Main dashboard content */}
        <CLInsightsTabManager report={mappedReport} crmData={crmData} />
      </div>
    </div>
  );
};

export default CLInsightsDashboard;
