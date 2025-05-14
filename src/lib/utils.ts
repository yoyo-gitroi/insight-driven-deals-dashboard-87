
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to safely parse JSON strings
export function safeJsonParse(jsonString: string, defaultValue = {}) {
  if (!jsonString) return defaultValue;
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return defaultValue;
  }
}

// Helper function to extract resolution status counts from signals
export function extractResolutionStatus(signals: any[]) {
  const resolutionCounts = {
    resolved: 0,
    partiallyResolved: 0,
    inProgress: 0,
    notResolved: 0
  };

  signals.forEach(signal => {
    try {
      const parsedSignals = safeJsonParse(signal.signals, []);
      
      if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          if (s?.objection_analysis?.resolution_status) {
            const status = s.objection_analysis.resolution_status.toLowerCase();
            if (status.includes('resolved')) {
              resolutionCounts.resolved++;
            } else if (status.includes('partially')) {
              resolutionCounts.partiallyResolved++;
            } else if (status.includes('progress')) {
              resolutionCounts.inProgress++;
            } else {
              resolutionCounts.notResolved++;
            }
          }
        });
      } else if (parsedSignals?.objection_analysis?.resolution_status) {
        const status = parsedSignals.objection_analysis.resolution_status.toLowerCase();
        if (status.includes('resolved')) {
          resolutionCounts.resolved++;
        } else if (status.includes('partially')) {
          resolutionCounts.partiallyResolved++;
        } else if (status.includes('progress')) {
          resolutionCounts.inProgress++;
        } else {
          resolutionCounts.notResolved++;
        }
      }
    } catch (e) {
      console.error("Error processing signal data:", e);
    }
  });

  return resolutionCounts;
}

// Helper function to extract upsell opportunities from signals
export function extractUpsellOpportunities(signals: any[]) {
  const upsellCounts = {
    total: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  signals.forEach(signal => {
    try {
      const parsedSignals = safeJsonParse(signal.signals, []);
      
      if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          if (s?.customer_receptiveness) {
            upsellCounts.total++;
            const receptiveness = s.customer_receptiveness.toLowerCase();
            if (receptiveness.includes('high')) {
              upsellCounts.high++;
            } else if (receptiveness.includes('medium')) {
              upsellCounts.medium++;
            } else if (receptiveness.includes('low')) {
              upsellCounts.low++;
            }
          }
        });
      } else if (parsedSignals?.customer_receptiveness) {
        upsellCounts.total++;
        const receptiveness = parsedSignals.customer_receptiveness.toLowerCase();
        if (receptiveness.includes('high')) {
          upsellCounts.high++;
        } else if (receptiveness.includes('medium')) {
          upsellCounts.medium++;
        } else if (receptiveness.includes('low')) {
          upsellCounts.low++;
        }
      }
    } catch (e) {
      console.error("Error processing upsell data:", e);
    }
  });

  return upsellCounts;
}

// Helper to extract priority actions
export function extractPriorityActions(deals: any[]) {
  let highPriorityCount = 0;
  let mediumPriorityCount = 0;
  
  deals.forEach(deal => {
    try {
      const actions = safeJsonParse(deal.actions, []);
      
      if (Array.isArray(actions)) {
        actions.forEach((action: any) => {
          if (action?.priority) {
            const priority = action.priority.toLowerCase();
            if (priority.includes('high')) {
              highPriorityCount++;
            } else if (priority.includes('medium')) {
              mediumPriorityCount++;
            }
          }
        });
      } else if (actions?.priority) {
        const priority = actions.priority.toLowerCase();
        if (priority.includes('high')) {
          highPriorityCount++;
        } else if (priority.includes('medium')) {
          mediumPriorityCount++;
        }
      }
    } catch (e) {
      console.error("Error processing action priority data:", e);
    }
  });

  return { high: highPriorityCount, medium: mediumPriorityCount };
}

// Helper to extract objection types
export function extractObjectionTypes(signals: any[]) {
  const objectionTypes: Record<string, number> = {};
  
  signals.forEach(signal => {
    try {
      const parsedSignals = safeJsonParse(signal.signals, []);
      
      if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          if (s?.objection_analysis?.objection_type) {
            const type = s.objection_analysis.objection_type;
            // Extract the main type (e.g., "Objection::Pricing" becomes "Pricing")
            const mainType = type.includes('::') ? type.split('::')[1] : type;
            objectionTypes[mainType] = (objectionTypes[mainType] || 0) + 1;
          }
        });
      } else if (parsedSignals?.objection_analysis?.objection_type) {
        const type = parsedSignals.objection_analysis.objection_type;
        const mainType = type.includes('::') ? type.split('::')[1] : type;
        objectionTypes[mainType] = (objectionTypes[mainType] || 0) + 1;
      }
    } catch (e) {
      console.error("Error processing objection type data:", e);
    }
  });

  return Object.entries(objectionTypes).map(([name, value]) => ({
    name,
    value
  }));
}

// Helper to extract signal confidence data
export function extractConfidenceData(signals: any[]) {
  const confidenceBuckets = {
    high: { count: 0, min: 70, max: 100, fillColor: '#10B981' },
    medium: { count: 0, min: 40, max: 69, fillColor: '#F97316' },
    low: { count: 0, min: 0, max: 39, fillColor: '#EF4444' }
  };
  
  signals.forEach(signal => {
    try {
      const parsedSignals = safeJsonParse(signal.signals, []);
      
      if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          if (s?.confidence) {
            const confidence = parseFloat(s.confidence);
            if (confidence >= confidenceBuckets.high.min) {
              confidenceBuckets.high.count++;
            } else if (confidence >= confidenceBuckets.medium.min) {
              confidenceBuckets.medium.count++;
            } else {
              confidenceBuckets.low.count++;
            }
          }
          
          // Also check for confidence in objection resolution
          if (s?.objection_analysis?.confidence_in_resolution) {
            const confidence = parseFloat(s.objection_analysis.confidence_in_resolution);
            if (confidence >= confidenceBuckets.high.min) {
              confidenceBuckets.high.count++;
            } else if (confidence >= confidenceBuckets.medium.min) {
              confidenceBuckets.medium.count++;
            } else {
              confidenceBuckets.low.count++;
            }
          }
        });
      } else {
        // Handle single object case
        if (parsedSignals?.confidence) {
          const confidence = parseFloat(parsedSignals.confidence);
          if (confidence >= confidenceBuckets.high.min) {
            confidenceBuckets.high.count++;
          } else if (confidence >= confidenceBuckets.medium.min) {
            confidenceBuckets.medium.count++;
          } else {
            confidenceBuckets.low.count++;
          }
        }
        
        if (parsedSignals?.objection_analysis?.confidence_in_resolution) {
          const confidence = parseFloat(parsedSignals.objection_analysis.confidence_in_resolution);
          if (confidence >= confidenceBuckets.high.min) {
            confidenceBuckets.high.count++;
          } else if (confidence >= confidenceBuckets.medium.min) {
            confidenceBuckets.medium.count++;
          } else {
            confidenceBuckets.low.count++;
          }
        }
      }
    } catch (e) {
      console.error("Error processing confidence data:", e);
    }
  });
  
  return [
    { name: 'High', value: confidenceBuckets.high.count, fill: confidenceBuckets.high.fillColor },
    { name: 'Medium', value: confidenceBuckets.medium.count, fill: confidenceBuckets.medium.fillColor },
    { name: 'Low', value: confidenceBuckets.low.count, fill: confidenceBuckets.low.fillColor }
  ];
}

// Helper to extract action types from the actions field
export function extractActionTypes(deals: any[]) {
  const actionTypes: Record<string, number> = {
    "Reframe": 0,
    "Educate": 0,
    "Accelerate": 0,
    "Trigger": 0,
    "Align": 0,
    "Escalate": 0,
    "Follow Up": 0
  };
  
  deals.forEach(deal => {
    try {
      const actions = safeJsonParse(deal.actions, []);
      
      if (Array.isArray(actions)) {
        actions.forEach((action: any) => {
          if (action?.action_verb) {
            const verb = action.action_verb;
            if (actionTypes.hasOwnProperty(verb)) {
              actionTypes[verb]++;
            } else {
              // Handle new action verbs
              actionTypes[verb] = (actionTypes[verb] || 0) + 1;
            }
          }
        });
      } else if (actions?.action_verb) {
        const verb = actions.action_verb;
        if (actionTypes.hasOwnProperty(verb)) {
          actionTypes[verb]++;
        } else {
          actionTypes[verb] = (actionTypes[verb] || 0) + 1;
        }
      }
    } catch (e) {
      console.error("Error processing action data:", e);
    }
  });

  return Object.entries(actionTypes)
    .filter(([_, value]) => value > 0) // Only include actions that exist
    .map(([name, value]) => ({
      name,
      value
    }));
}

// Helper to extract deal stages
export function extractDealStages(deals: any[]) {
  const stageData: Record<string, {count: number, avgDays: number, totalDays: number}> = {
    "Discovery": { count: 0, avgDays: 0, totalDays: 0 },
    "Qualification": { count: 0, avgDays: 0, totalDays: 0 },
    "Implementation": { count: 0, avgDays: 0, totalDays: 0 },
    "Closed Won": { count: 0, avgDays: 0, totalDays: 0 },
    "Closed Lost": { count: 0, avgDays: 0, totalDays: 0 }
  };
  
  deals.forEach(deal => {
    const stage = deal.deal_stage || "Unknown";
    
    // Simulate days in stage (since we don't have real data for this)
    const daysInStage = Math.floor(Math.random() * 60) + 5;
    
    if (stageData[stage]) {
      stageData[stage].count++;
      stageData[stage].totalDays += daysInStage;
    }
  });
  
  // Calculate averages
  Object.keys(stageData).forEach(stage => {
    if (stageData[stage].count > 0) {
      stageData[stage].avgDays = Math.round(stageData[stage].totalDays / stageData[stage].count);
    }
  });
  
  return Object.entries(stageData).map(([name, data]) => ({
    name,
    count: data.count,
    avgDays: data.avgDays
  }));
}
