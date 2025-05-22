import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ExecutiveSummary from "./cl-insights/ExecutiveSummary";
import SignalCategories from "./cl-insights/SignalCategories";
import AEPerformance from "./cl-insights/AEPerformance";
import StakeholderInsights from "./cl-insights/StakeholderInsights";
import TrendAnalysis from "./cl-insights/TrendAnalysis";
import DealAcceleration from "./cl-insights/DealAcceleration";
import StrategicActions from "./cl-insights/StrategicActions";
import { Badge } from "@/components/ui/badge";
import ObjectionCharts from "./ObjectionCharts";

// Mock data for the dashboard
const gtmData = {
  "Portfolio-Level GTM Intelligence Report": {
    "Executive Summary": {
      "Key Findings": [
        "Integration challenges are prevalent, surfacing in nearly all deals, impacting deal velocity and requiring proactive solutions architect involvement.",
        "Product fit concerns arise across various industries, often stemming from uncertainty about handling complex, company-specific data models. Customizable POCs are essential.",
        "Expansion opportunities are consistently identified, but capitalizing on them requires early engagement with executive sponsors and clear articulation of ROI across multiple business units.",
        "AE performance varies, with top performers proactively addressing integration concerns and tailoring POCs, while others struggle to articulate the product's value proposition effectively."
      ],
      "Aggregate Health Metrics": {
        "Average Win Probability": "68.4%",
        "Combined ARR Health": "Weighted towards 'Strong' in early-stage opportunities, but at risk in deals with lingering integration/budget concerns.",
        "Pipeline Coverage vs. Target": "Insufficient data to calculate precise coverage; recommend integrating financial system data for a more accurate assessment."
      },
      "Strategic Context": {
        "Market Forces": "Growing demand for AI-driven analytics and automation, particularly in data-rich industries such as fintech, travel, and IT services.  Companies are under pressure to move beyond dashboards and deliver actionable insights.",
        "External Events": "Year-end budget cycles impact customer bandwidth and prioritization, requiring sales cycles to be flexible and account for pre-planning, while industry consolidation and emergence of new analytics technologies increase pressure for innovative solutions."
      },
      "Critical Red Flags": [
        "Recurring integration objections across multiple accounts and verticals suggest a need for enhanced sales enablement on integration capabilities and solutions architecture. E.g., PowerBI concerns in TheGuarantors, Kafka at Yatra",
        "Low-performing AEs struggle to address integration concerns and demonstrate tangible ROI, particularly in complex sales environments; require targeted coaching on these areas. Performance review necessary. Need better resource allocation",
        "Forecasting gaps exist due to uncertainties in pipeline velocity and incomplete account intelligence around budget cycles and executive buy-in. Recommend deal stage analysis and integration of financial datapoints. E.g., The guarantee and EcoATM, Inc."
      ]
    },
    "Primary Signal Categories": {
      "Objection": {
        "Frequency across Portfolio": "Objections appear in 100% of deals, signaling high engagement but need for strong objection handling.",
        "Top 3 Signals": [
          {
            "signal_type": "Integration",
            "avg_confidence": "87.14%"
          },
          {
            "signal_type": "Product Fit",
            "avg_confidence": "84.37%"
          },
          {
            "signal_type": "Pricing",
            "avg_confidence": "92.33%"
          }
        ],
        "Contextual Patterns": "Integration concerns cluster around companies migrating to cloud or with complex legacy systems; Product Fit objections are common in first demos; Pricing concerns are highest in cost-conscious sectors like hospitality and small businesses.",
        "Portfolio-Level Recommended Action": "Develop a library of objection handling materials and provide AE training on integration and deployment options, tailored value propositions, and pricing strategies."
      },
      "Confusion": {
        "Frequency across Portfolio": "Confusion signals appear in ~60% of deals, suggesting a need for clearer value communication.",
        "Top 3 Signals": [
          {
            "signal_type": "Analytics",
            "avg_confidence": "79.17%"
          },
          {
            "signal_type": "Reporting Terms",
            "avg_confidence": "78%"
          },
          {
            "signal_type": "Onboarding",
            "avg_confidence": "76.66%"
          }
        ],
        "Contextual Patterns": "Confusion around analytics and reporting definitions is prominent in deals with technical stakeholders; Onboarding confusion arises early in discussions, highlighting the need for simplified explanations.",
        "Portfolio-Level Recommended Action": "Create clear and concise materials that explain the product's analytics capabilities and simplify onboarding processes, using jargon-free language."
      },
      "Expansion": {
        "Frequency across Portfolio": "Expansion signals in ~50% of deals - high potential but not consistently leveraged",
        "Top 3 Signals": [
          {
            "signal_type": "Feature Usage Growth",
            "avg_confidence": "82.25%"
          },
          {
            "signal_type": "Org-Wide Adoption",
            "avg_confidence": "72.5%"
          }
        ],
        "Contextual Patterns": "Feature Usage growth is prominent after initial deployments while Org-Wide Adoption is related to business use cases.",
        "Portfolio-Level Recommended Action": "Enable AEs to identify and proactively push for higher level features to increase value."
      },
      "SegmentDrift": {
        "Frequency across Portfolio": "SegmentDrift appears in 25% of deals - highlighting a large need for customized insights",
        "Top 1 Signal": [
          {
            "signal_type": "New Personas Involved",
            "avg_confidence": "81.50%"
          }
        ],
        "Contextual Patterns": "Occurs where there are larger teams and a need for more insight and control.",
        "Portfolio-Level Recommended Action": "Enable AEs to tailor insights to different types of roles that would be within organizations."
      }
    },
    "Account Executive Performance": {
      "Top 3 AEs by Win Rate": [
        {
          "ae_name": "Bhaskar Sunkara",
          "win_rate": "70% (estimated)",
          "average_deal_size": "$250k",
          "average_cycle_time": "60 days"
        },
        {
          "ae_name": "Randy Boysen",
          "win_rate": "60% (estimated)",
          "average_deal_size": "$180k",
          "average_cycle_time": "75 days"
        }
      ],
      "Bottom 3 AEs by Win Rate": [
        {
          "ae_name": "Gomini Shreya",
          "win_rate": "55% (estimated)",
          "average_deal_size": "$150k",
          "average_cycle_time": "90 days"
        },
        {
          "ae_name": "Yashaswi Pathak",
          "win_rate": "50% (estimated)",
          "average_deal_size": "$120k",
          "average_cycle_time": "100 days"
        },
        {
          "ae_name": "Karl Evans",
          "win_rate": "55% (estimated)",
          "average_deal_size": "$150k",
          "average_cycle_time": "90 days"
        }
      ],
      "Training Needs Identified": [
        "All AEs: Enhanced training on advanced integration options and addressing integration objections head-on.",
        "Low-Performing AEs: Targeted coaching on articulating the product's value proposition, driving executive engagement, and negotiating pricing."
      ]
    },
    "Stakeholder & Persona Insights": {
      "Most Influential Roles": "Directors of Analytics, typically champions, focused on product fit and demonstrating ROI",
      "Sentiment Trends by Role": {
        "Directors of Analytics": "Positive, but require demonstrable value; quick time-to-value POC critical.",
        "Infrastructure Leads": "Generally positive, but key is simplifying API and infrastructure connections. Security key.",
        "Business Leads": "Focus on business value, clear alignment with company goals, and scalability; engage to make sure strategic objectives are hit."
      },
      "Recurring Priorities by Persona": {
        "Directors of Analytics": "Actionable insights, easy onboarding, and cross-functional collaboration.",
        "IT/Infrastructure": "Seamless integration, minimal IT workload, and robust data security.",
        "Business Leaders": "Increased revenue, reduced costs, and demonstrable ROI."
      },
      "Missing Personas": [
        "Executive Sponsors (C-level): Engage higher to increase business values and increase speed. E.g., Amadeus requires greater alignment in higher-level leadership to secure alignment across enterprise.",
        "Procurement/Legal: Critical for removing roadblocks. E.g., Iron Mountain needs more stakeholder engagement at procurement level."
      ],
      "Recommended Engagement": "For missing personas - engage leaders and emphasize strategic value proposition."
    },
    "Pattern & Trend Analysis": {
      "Cross-Company Patterns": [
        "Recurring integration concerns across various industries highlight the need for plug-and-play integrations. E.g., in Amplitude, or Domo",
        "Upsell opportunities typically follow the POC, focusing on Root-cause analysis."
      ],
      "Rising vs. Stable Trends": {
        "Rising Trends": "Concerns surrounding data security and compliance are on the rise with increasing data volume across all industries.",
        "Stable Trends": "Need for automated and faster analytics is stable"
      },
      "Industry- or Size-Specific Patterns": {
        "IT Services": "Focus on ease of deployment and value for business transformation",
        "Financial Services": "More attention to data quality and compliance"
      },
      "Temporal Dynamics": "Integration objections spike during deployment phase. Product-fit typically hits early on."
    },
    "Deal Acceleration & Risk": {
      "Top 4 Acceleration Opportunities": [
        {
          "opportunity": "Rapid POC",
          "impact": "High",
          "next_steps": "POC data set should align with actionable insights"
        },
        {
          "opportunity": "Business alignment",
          "impact": "High",
          "next_steps": "Share value proposition that appeals across different industries"
        },
        {
          "opportunity": "Streamlining deployments",
          "impact": "Medium",
          "next_steps": "Highlight cloud-centric nature"
        }
      ],
      "Top 4 Risk Factors": [
        {
          "risk_type": "Integration Problems",
          "early_warning_signs": "Connection errors and problems with integration",
          "mitigation_playbooks": "Provide troubleshooting tips and solutions architecture review to fix problems"
        },
        {
          "risk_type": "Loss of Sponsorship",
          "early_warning_signs": "Decrease in interaction with stakeholder and decrease in sentiment.",
          "mitigation_playbooks": "Escalate to the leadership level"
        },
        {
          "risk_type": "Lack of clarity",
          "early_warning_signs": "Confused over data sets",
          "mitigation_playbooks": "Recommend providing additional details of available features"
        },
        {
          "risk_type": "Budget",
          "early_warning_signs": "Can't spend money",
          "mitigation_playbooks": "Adjust price based on features and available support."
        }
      ],
      "Prioritization Framework": "Prioritize deals by weighting engagement level, size of company and their strategic mission"
    },
    "Upsell & Expansion": {
      "Most Successful Upsell Motions": {
        "Product": "automated root cause module",
        "Average Fit Score": "90",
        "ARR lift": "10-15%"
      },
      "Common Expansion Paths": "From analytics product to expansion to all products.",
      "Feature Requests/Gaps Mentioned Repeatedly": [
        "More connectors",
        "Better visualizations"
      ]
    },
    "Content & Collateral Recommendations": {
      "Case Studies": [
        "Data from large enterprises and integrations with systems like PowerBI"
      ],
      "Content Gaps by Objection Type": "Material over plug-and-play systems",
      "New Content Ideas Tied to Portfolio Signals": "Case studies for enterprises."
    },
    "Strategic Next Actions": {
      "Top 5 Prioritized Actions for Sales Leadership": [
        "Provide clear POC guide",
        "Emphasize a culture of communication",
        "Highlight integrations with all data connectors",
        "Reach back out to old contacts with these strategies",
        "Incentivize revenue growth"
      ],
      "Process Improvements": "Refine integration process",
      "Training & Coaching Plans": "Training over integration",
      "Measurement Framework": "Track revenue and growth to determine success"
    }
  }
};

interface CLInsightsDashboardProps {
  crmData: any[];
  data: any;
}

const CLInsightsDashboard: React.FC<CLInsightsDashboardProps> = ({ crmData, data }) => {
  // const gtmData = JSON.parse(data)
  console.log("data", JSON.parse(data));
  const report = gtmData["Portfolio-Level GTM Intelligence Report"];
  
  // Sample objection data for the chart
  const objectionTypeData = [
    { name: "Objection::Integration", value: 42 },
    { name: "Objection::Product Fit", value: 38 },
    { name: "Objection::Pricing", value: 30 },
    { name: "Objection::Competitive", value: 27 },
    { name: "Objection::Technical", value: 22 },
    { name: "Objection::Timeline", value: 15 }
  ];
  
  // Color mapping for objection types
  const colorMapping = {
    "Integration": "#4169E1", // Royal Blue
    "Product Fit": "#2E8B57", // Sea Green
    "Pricing": "#B22222", // Firebrick
    "Competitive": "#FF8C00", // Dark Orange
    "Technical": "#9932CC", // Dark Orchid
    "Timeline": "#008080", // Teal
    "Other": "#696969" // Dim Gray
  };

  return (  
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Level Aura Insights</h1>
        <div className="flex space-x-2">
          {/* <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">All Companies</Badge>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Q2 2025</Badge> */}
        </div>
      </div>

      <Tabs defaultValue="executive-summary" className="w-full mb-8">
        <TabsList className="mb-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="executive-summary" className="rounded-md">Executive Summary</TabsTrigger>
          <TabsTrigger value="signals" className="rounded-md">Signal Detection</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-md">AE Performance</TabsTrigger>
          <TabsTrigger value="stakeholders" className="rounded-md">Stakeholders</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-md">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="strategy" className="rounded-md">Strategic Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="executive-summary" className="space-y-4">
          <ExecutiveSummary executiveSummary={report["Executive Summary"]} />
        </TabsContent>
        
        <TabsContent value="signals" className="space-y-4">
          <SignalCategories signalCategories={report["Primary Signal Categories"]} />
          
          {/* Objection Analysis Charts */}
          <div className="mt-8">
            <ObjectionCharts crmData={crmData} />
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <AEPerformance aePerformance={report["Account Executive Performance"]} />
        </TabsContent>
        
        <TabsContent value="stakeholders" className="space-y-4">
          <StakeholderInsights stakeholderInsights={report["Stakeholder & Persona Insights"]} />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <TrendAnalysis 
            trendAnalysis={report["Pattern & Trend Analysis"]}
            upsellExpansion={report["Upsell & Expansion"]} 
          />
        </TabsContent>
        
        <TabsContent value="strategy" className="space-y-4">
          <DealAcceleration dealAcceleration={report["Deal Acceleration & Risk"]} />
          <StrategicActions 
            strategicActions={report["Strategic Next Actions"]} 
            contentRecommendations={report["Content & Collateral Recommendations"]} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CLInsightsDashboard;
