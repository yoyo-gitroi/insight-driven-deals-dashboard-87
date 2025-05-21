
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, BarChart2, PieChart, Users, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { CRMData } from "@/utils/dataProcessor";
import ExecutiveSummary from "./cl-insights/ExecutiveSummary";
import SignalDetection from "./cl-insights/SignalDetection";
import PatternAnalysis from "./cl-insights/PatternAnalysis";
import PersonaTrends from "./cl-insights/PersonaTrends";
import GTMStrategy from "./cl-insights/GTMStrategy";
import TrendsActionables from "./cl-insights/TrendsActionables";

// Extract and parse CL Insights data from CRM data
const extractCLInsightsData = (crmData: CRMData[]) => {
  if (!crmData || crmData.length === 0) return null;
  
  // Find any record with cl_insight data
  for (const record of crmData) {
    if (record.transcripts) {
      try {
        return JSON.parse(record.transcripts);
      } catch (e) {
        console.error("Failed to parse CL insights data:", e);
        return null;
      }
    }
  }
  
  return null;
};

const CLInsightsDashboard = () => {
  // Dummy query to get CRM data (in a real app, this would fetch from an API)
  const { data: crmData = [] } = useQuery({
    queryKey: ["crmData"],
    queryFn: () => Promise.resolve([{ 
      transcripts: JSON.stringify({
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
              "Portfolio-Level Recommended Action": "Enable AEs to tailor insights to different types of roles that would be within organizations. "
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
              "Upsell opportunities typically follow the POC, focusing on Root-cause analysis. "
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
            "New Content Ideas Tied to Portfolio Signals": "Case studies for enterprises. "
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
      }) 
    }] as CRMData[]),
  });

  const clInsightsData = extractCLInsightsData(crmData);
  const report = clInsightsData?.["Portfolio-Level GTM Intelligence Report"];

  if (!report) {
    return (
      <div className="w-full">
        <Card className="w-full mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <h2 className="text-2xl font-medium text-gray-700 mb-2">No CL Insights Data Available</h2>
              <p className="text-gray-500">Please upload a file with CL Insights data to view this dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract key metrics for dashboard
  const emergingPersonas = 4;
  const signalDensity = 4.1;
  const missedExpansion = "45%";
  const newStakeholders = 12;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">GTM Intelligence Report</h1>
        <div className="flex space-x-2">
          <Badge className="bg-gray-200 text-gray-700">All Companies</Badge>
          <Badge className="bg-gray-200 text-gray-700">All Categories</Badge>
          <Badge className="bg-gray-200 text-gray-700">All Patterns</Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Emerging Personas</p>
                <h3 className="text-2xl font-bold">{emergingPersonas}</h3>
                <p className="text-xs text-green-600">+2 from last quarter</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Signal Density</p>
                <h3 className="text-2xl font-bold">{signalDensity}</h3>
                <p className="text-xs text-green-600">+0.3 from last quarter</p>
              </div>
              <BarChart2 className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Missed Expansion</p>
                <h3 className="text-2xl font-bold">{missedExpansion}</h3>
                <p className="text-xs text-red-600">High priority action</p>
              </div>
              <TrendingUp className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Stakeholders</p>
                <h3 className="text-2xl font-bold">{newStakeholders}</h3>
                <p className="text-xs text-green-600">+10% increase</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="executive">Executive Summary</TabsTrigger>
          <TabsTrigger value="signal">Signal Detection</TabsTrigger>
          <TabsTrigger value="pattern">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="persona">ICP Evolution & Personas</TabsTrigger>
          <TabsTrigger value="gtm">GTM Strategy</TabsTrigger>
          <TabsTrigger value="trends">Trends & Actionables</TabsTrigger>
        </TabsList>

        <TabsContent value="executive">
          <ExecutiveSummary 
            executiveSummary={report.Executive Summary} 
            signalCategories={report["Primary Signal Categories"]}
          />
        </TabsContent>

        <TabsContent value="signal">
          <SignalDetection 
            signalCategories={report["Primary Signal Categories"]}
            stakeholderInsights={report["Stakeholder & Persona Insights"]}
          />
        </TabsContent>

        <TabsContent value="pattern">
          <PatternAnalysis 
            patternAnalysis={report["Pattern & Trend Analysis"]}
            riskData={report["Deal Acceleration & Risk"]}
          />
        </TabsContent>

        <TabsContent value="persona">
          <PersonaTrends 
            personaInsights={report["Stakeholder & Persona Insights"]}
            accountExecutivePerformance={report["Account Executive Performance"]}
          />
        </TabsContent>

        <TabsContent value="gtm">
          <GTMStrategy 
            riskData={report["Deal Acceleration & Risk"]}
            strategicActions={report["Strategic Next Actions"]}
          />
        </TabsContent>

        <TabsContent value="trends">
          <TrendsActionables 
            accountExecutivePerformance={report["Account Executive Performance"]}
            upsellExpansion={report["Upsell & Expansion"]}
            contentRecommendations={report["Content & Collateral Recommendations"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CLInsightsDashboard;
