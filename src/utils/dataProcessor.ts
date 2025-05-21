export interface CRMData {
  transcripts: string;
}

// Add these types to support the GTMStrategy component
export interface DealAccelerationRisk {
  "Top 4 Acceleration Opportunities": Array<{
    opportunity: string;
    impact: string;
    next_steps: string;
  }>;
  "Top 4 Risk Factors": Array<{
    risk_type: string;
    early_warning_signs: string;
    mitigation_playbooks: string;
  }>;
  "Prioritization Framework": string;
}

export interface StrategicNextActions {
  "Top 5 Prioritized Actions for Sales Leadership": string[];
  "Process Improvements": string;
  "Training & Coaching Plans": string;
  "Measurement Framework": string;
}
