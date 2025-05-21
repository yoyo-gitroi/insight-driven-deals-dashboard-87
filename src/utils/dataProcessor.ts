
export interface CRMData {
  transcripts: string;
  owner?: string; // Added this property as it's being used in AEDashboard.tsx
  // Add other properties your CRM data might have
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

// Function to process raw data from spreadsheet
export const processRawData = (rawData: any[]): CRMData[] => {
  // This is a placeholder implementation. In a real application,
  // you would transform the raw data into the CRMData format.
  
  return rawData.map(row => ({
    transcripts: row.transcripts || JSON.stringify({}),
    owner: row.owner || "Unknown",
    // Map other properties as needed
  }));
};

// Function to extract unique Account Executives from CRM data
export const extractUniqueAEs = (crmData: CRMData[]): string[] => {
  // Get all unique AE names from the owner property
  const uniqueAEs = new Set<string>();
  
  crmData.forEach(deal => {
    if (deal.owner && typeof deal.owner === 'string') {
      uniqueAEs.add(deal.owner);
    }
  });
  
  return Array.from(uniqueAEs).sort();
};
