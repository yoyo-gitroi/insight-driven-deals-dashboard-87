
export type CRMData = {
  sr_no?: number;
  company_name?: string;
  size?: string;
  deal_name?: string;
  deal_stage?: string;
  deal_amount?: number;
  owner?: string;
  close_date?: string;
  nba?: string;
  signals?: string;
  actions?: string;
  transcripts?: string;
  industry?: string;
  contact_title?: string;
  geo?: string;
  cl_insight?: string;
};

// GTM Intelligence Data Types
export type GTMIntelligenceData = {
  output: {
    "Portfolio-Level GTM Intelligence Report": GTMIntelligenceReport;
  };
};

export type GTMIntelligenceReport = {
  "Executive Summary": ExecutiveSummary;
  "Primary Signal Categories": PrimarySignalCategories;
  "Account Executive Performance": AccountExecutivePerformance;
  "Stakeholder & Persona Insights": StakeholderPersonaInsights;
  "Pattern & Trend Analysis": PatternTrendAnalysis;
  "Deal Acceleration & Risk": DealAccelerationRisk;
  "Upsell & Expansion": UpsellExpansion;
  "Content & Collateral Recommendations": ContentCollateralRecommendations;
  "Strategic Next Actions": StrategicNextActions;
};

export type ExecutiveSummary = {
  "Key Findings": string[];
  "Aggregate Health Metrics": {
    "Average Win Probability": string;
    "Combined ARR Health": string;
    "Pipeline Coverage vs. Target": string;
  };
  "Strategic Context": {
    "Market Forces": string;
    "External Events": string;
  };
  "Critical Red Flags": string[];
};

export type PrimarySignalCategories = {
  "Objection": SignalCategory;
  "Confusion": SignalCategory;
  "Expansion": SignalCategory;
  "SegmentDrift": SignalCategory;
};

export type SignalCategory = {
  "Frequency across Portfolio": string;
  "Top 3 Signals"?: Array<{
    signal_type: string;
    avg_confidence: string;
  }>;
  "Top 1 Signal"?: Array<{
    signal_type: string;
    avg_confidence: string;
  }>;
  "Contextual Patterns": string;
  "Portfolio-Level Recommended Action": string;
};

export type AccountExecutivePerformance = {
  "Top 3 AEs by Win Rate": AEPerformance[];
  "Bottom 3 AEs by Win Rate": AEPerformance[];
  "Training Needs Identified": string[];
};

export type AEPerformance = {
  ae_name: string;
  win_rate: string;
  average_deal_size: string;
  average_cycle_time: string;
};

export type StakeholderPersonaInsights = {
  "Most Influential Roles": string;
  "Sentiment Trends by Role": Record<string, string>;
  "Recurring Priorities by Persona": Record<string, string[]>;
  "Missing Personas": string[];
  "Recommended Engagement": string;
};

export type PatternTrendAnalysis = {
  "Cross-Company Patterns": string[];
  "Rising vs. Stable Trends": {
    "Rising Trends": string;
    "Stable Trends": string;
  };
  "Industry- or Size-Specific Patterns": Record<string, string>;
  "Temporal Dynamics": string;
};

export type DealAccelerationRisk = {
  "Top 4 Acceleration Opportunities": AccelerationOpportunity[];
  "Top 4 Risk Factors": RiskFactor[];
  "Prioritization Framework": string;
};

export type AccelerationOpportunity = {
  opportunity: string;
  impact: string;
  next_steps: string;
};

export type RiskFactor = {
  risk_type: string;
  early_warning_signs: string;
  mitigation_playbooks: string;
};

export type UpsellExpansion = {
  "Most Successful Upsell Motions": {
    Product: string;
    "Average Fit Score": string;
    "ARR lift": string;
  };
  "Common Expansion Paths": string;
  "Feature Requests/Gaps Mentioned Repeatedly": string[];
};

export type ContentCollateralRecommendations = {
  "Case Studies": string[];
  "Content Gaps by Objection Type": string;
  "New Content Ideas Tied to Portfolio Signals": string;
};

export type StrategicNextActions = {
  "Top 5 Prioritized Actions for Sales Leadership": string[];
  "Process Improvements": string;
  "Training & Coaching Plans": string;
  "Measurement Framework": string;
};

export const processRawData = (crmSheet: any[]): CRMData[] => {
  if (!crmSheet.length) {
    return [];
  }
  
  console.log("Raw data received:", crmSheet);
  
  // Map the Google Sheets column names to the expected field names
  const processedCrmData = crmSheet.map(row => {
    return {
      sr_no: row['s.no'] || row.sr_no,
      company_name: row['Company Name'] || row.company_name,
      size: row['Size'] || row.size,
      deal_name: row['Deal Name'] || row.deal_name,
      deal_stage: row['Deal Stage'] || row.deal_stage,
      deal_amount: parseFloat(row['Deal Amount']) || row.deal_amount,
      owner: row['Owner'] || row.owner,
      close_date: row['Close Date'] || row.close_date,
      nba: row['nba'] || row.nba,
      signals: row['signals'] || row.signals,
      actions: row['actions'] || row.actions,
      transcripts: row['transcripts'] || row.transcripts,
      industry: row['Industry'] || row.industry,
      contact_title: row['Contact Title'] || row.contact_title,
      geo: row['Geo'] || row.geo,
      cl_insight: row['cl_insight'] || row.cl_insight
    };
  });
  
  console.log("Processed data:", processedCrmData);
  return processedCrmData;
};

export const extractUniqueAEs = (crmData: CRMData[]): string[] => {
  const uniqueAEs = [...new Set(crmData.map(row => row.owner))].filter(Boolean);
  console.log("AE List:", uniqueAEs);
  return uniqueAEs;
};

export const extractGTMIntelligenceData = (crmData: CRMData[]): GTMIntelligenceData | null => {
  if (!crmData?.length) return null;
  
  // Find the first row with cl_insight data
  const clInsightRow = crmData.find(row => row.cl_insight);
  
  if (!clInsightRow?.cl_insight) {
    console.log("No CL Insight data found");
    return null;
  }
  
  try {
    const clInsightData = JSON.parse(clInsightRow.cl_insight);
    console.log("Extracted GTM Intelligence Data:", clInsightData);
    return clInsightData;
  } catch (error) {
    console.error("Error parsing CL Insight data:", error);
    return null;
  }
};
