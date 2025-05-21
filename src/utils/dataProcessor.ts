
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
      geo: row['Geo'] || row.geo
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
