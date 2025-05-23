
/**
 * Utility function to fetch and process Google Sheets data
 */

// Function to convert Google Sheets URL to an export URL for CSV
const getGoogleSheetsExportUrl = (sheetUrl: string): string => {
  // Extract the sheet ID from the URL
  const matches = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!matches || matches.length < 2) {
    throw new Error('Invalid Google Sheets URL format');
  }
  
  const sheetId = matches[1];
  // Convert to an export URL for CSV format
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
};

// Function to fetch Google Sheets data as CSV and parse it
export const fetchGoogleSheetsData = async (sheetUrl: string): Promise<any[]> => {
  try {
    // Get the export URL
    const exportUrl = getGoogleSheetsExportUrl(sheetUrl);
    
    // Fetch the CSV data
    const response = await fetch(exportUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const csvText = await response.text();
    // Parse CSV data using the XLSX library
    const workbook = await import('xlsx').then(XLSX => {
      return XLSX.read(csvText, { type: 'string' });
    });
    
    // Convert the first worksheet to JSON
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = await import('xlsx').then(XLSX => {
      return XLSX.utils.sheet_to_json(worksheet);
    });
    
    console.log("Fetched sheet data:", jsonData);
    
    // Extract cl_insight data
    let clInsights = null;
    if (jsonData && jsonData.length > 0) {
      // Find the first row that has cl_insight data
      for (const row of jsonData) {
        if (row.cl_insight) {
          clInsights = row.cl_insight;
          break;
        }
      }
    }
    
    console.log("CL Insight data found:", clInsights ? "Yes" : "No");
    
    // Map the column names to expected format
    const processedData = jsonData.map((row: any) => {
      return {
        sr_no: row['s.no'],
        company_name: row['Company Name'],
        size: row['Size'],
        deal_name: row['Deal Name'],
        deal_stage: row['Deal Stage'],
        deal_amount: row['Deal Amount'],
        owner: row['Owner'],
        close_date: row['Close Date'],
        nba: row['nba'],
        signals: row['signals'],
        actions: row['actions'],
        transcripts: row['transcripts'],
        industry: row['Industry'],
        contact_title: row['Contact Title'],
        geo: row['Geo'],
        cl_insight: row['cl_insight']
      };
    });
    
    console.log("Processed sheet data:", processedData);
    return [processedData, clInsights];
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
};
