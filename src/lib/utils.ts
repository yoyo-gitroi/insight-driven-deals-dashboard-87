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

// Improved helper function to extract resolution status counts from signals
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
      
      // Check if it's an object with a 'signals' array inside
      if (parsedSignals?.signals && Array.isArray(parsedSignals.signals)) {
        // Process each signal in the signals array
        parsedSignals.signals.forEach((s: any) => {
          // Check if the signal has objection_analysis with resolution_status
          if (s?.resolution_status) {
            const status = s.resolution_status.toLowerCase();
            updateResolutionCounts(resolutionCounts, status);
          }
        });
      } 
      // Check if it's a direct array of signals
      else if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          if (s?.resolution_status) {
            const status = s.resolution_status.toLowerCase();
            updateResolutionCounts(resolutionCounts, status);
          }
        });
      } 
      // Check if it's an object with 'objection_analysis' array
      else if (parsedSignals?.objection_analysis && Array.isArray(parsedSignals.objection_analysis)) {
        parsedSignals.objection_analysis.forEach((obj: any) => {
          if (obj?.resolution_status) {
            const status = obj.resolution_status.toLowerCase();
            updateResolutionCounts(resolutionCounts, status);
          }
        });
      }
      // Direct single objection with resolution_status
      else if (parsedSignals?.objection_analysis?.resolution_status) {
        const status = parsedSignals.objection_analysis.resolution_status.toLowerCase();
        updateResolutionCounts(resolutionCounts, status);
      }
    } catch (e) {
      console.error("Error processing signal data:", e);
    }
  });

  return resolutionCounts;
}

// Helper function to update resolution counts based on status
function updateResolutionCounts(counts: any, status: string) {
  if (status.includes('resolved') && !status.includes('partially')) {
    counts.resolved++;
  } else if (status.includes('partially')) {
    counts.partiallyResolved++;
  } else if (status.includes('progress')) {
    counts.inProgress++;
  } else {
    counts.notResolved++;
  }
}

// Helper function to extract upsell opportunities from signals - modified to better detect customer receptiveness
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
      
      // Check if it's an object with a 'signals' array inside
      if (parsedSignals?.signals && Array.isArray(parsedSignals.signals)) {
        parsedSignals.signals.forEach((s: any) => {
          
          if (s?.upsell_detection == "Yes" || s?.upsell_detection == "yes") {
            console.log("hum de rhe ha ans" ,s);
            upsellCounts.total++;
            updateReceptivenessCounts(upsellCounts, s.upsell_detection);
          }
        });
      }
      
      // Direct single signal with customer_receptiveness
      else if (parsedSignals?.upsell_detection) {
        upsellCounts.total++;
        updateReceptivenessCounts(upsellCounts, parsedSignals.upsell_detection);
      }
      
      // Also check for signals with "Expansion::" type and assume they have higher receptiveness
      if (parsedSignals?.signals && Array.isArray(parsedSignals.signals)) {
        parsedSignals.signals.forEach((s: any) => {
          if (s?.signal_type && s.signal_type.includes("Expansion::")) {
            if (!s.customer_receptiveness) {  // Only count if not already counted above
              upsellCounts.total++;
              upsellCounts.medium++;  // Default to medium if not specified
            }
          }
        });
      }
      else if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          if (s?.signal_type && s.signal_type.includes("Expansion::")) {
            if (!s.customer_receptiveness) {  // Only count if not already counted above
              upsellCounts.total++;
              upsellCounts.medium++;  // Default to medium if not specified
            }
          }
        });
      }
    } catch (e) {
      console.error("Error processing upsell data:", e);
    }
  });

  return upsellCounts;
}

// Helper function to update receptiveness counts based on level
function updateReceptivenessCounts(counts: any, receptiveness: string) {
  const level = receptiveness.toLowerCase();
  if (level.includes('high')) {
    counts.high++;
  } else if (level.includes('medium')) {
    counts.medium++;
  } else if (level.includes('low')) {
    counts.low++;
  }
}

// Helper to extract priority actions
export function extractPriorityActions(deals: any[]) {
  let highPriorityCount = 0;
  let mediumPriorityCount = 0;
  
  deals.forEach(deal => {
    try {
      const actions = safeJsonParse(deal.actions, []);
      const nbaData = safeJsonParse(deal.nba, {});
      
      // Extract reference ID from NBA if available
      let actionReferenceId = null;
      if (nbaData?.nba_action?.action_reference_id) {
        actionReferenceId = nbaData.nba_action.action_reference_id;
      }
      
      // Check for actions array inside 'actions' property
      if (actions?.actions && Array.isArray(actions.actions)) {
        actions.actions.forEach((action: any) => {
          // If we have a reference ID, check if this action matches it
          if (actionReferenceId && action?.signal_reference_id === actionReferenceId) {
            if (action?.priority) {
              const priority = action.priority.toLowerCase();
              if (priority.includes('high')) {
                highPriorityCount++;
              } else if (priority.includes('medium')) {
                mediumPriorityCount++;
              }
            }
          } 
          // Otherwise check all actions
          else if (action?.priority) {
            const priority = action.priority.toLowerCase();
            if (priority.includes('high')) {
              highPriorityCount++;
            } else if (priority.includes('medium')) {
              mediumPriorityCount++;
            }
          }
        });
      }
      // Check if it's a direct array of actions
      else if (Array.isArray(actions)) {
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
      }
      // Direct single action with priority
      else if (actions?.priority) {
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
      
      // Check if it's an object with a 'signals' array inside
      if (parsedSignals?.signals && Array.isArray(parsedSignals.signals)) {
        parsedSignals.signals.forEach((s: any) => {
          extractObjectionTypeFromSignal(s, objectionTypes);
        });
      }
      // Check if it's a direct array of signals
      else if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          extractObjectionTypeFromSignal(s, objectionTypes);
        });
      }
      // Check if it's an object with 'objection_analysis' array
      else if (parsedSignals?.objection_analysis && Array.isArray(parsedSignals.objection_analysis)) {
        parsedSignals.objection_analysis.forEach((obj: any) => {
          if (obj?.objection_type) {
            const type = obj.objection_type;
            const mainType = extractMainType(type);
            objectionTypes[mainType] = (objectionTypes[mainType] || 0) + 1;
          }
        });
      }
      // Direct single objection within signal
      else {
        extractObjectionTypeFromSignal(parsedSignals, objectionTypes);
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

// Helper to extract the main type from an objection_type string
function extractMainType(type: string) {
  if (!type) return "Unknown";
  
  // Handle types like "Objection::Pricing"
  if (type.includes('::')) {
    return type.split('::')[1];
  }
  
  // Handle types like "Objection::Product Fit|Objection::Integration"
  if (type.includes('|')) {
    const types = type.split('|');
    return types.map(t => {
      if (t.includes('::')) {
        return t.split('::')[1];
      }
      return t;
    }).join('/');
  }
  
  return type;
}

// Helper to extract objection type from a signal object
function extractObjectionTypeFromSignal(signal: any, objectionTypes: Record<string, number>) {
  if (signal?.objection_analysis?.objection_type) {
    const type = signal.objection_analysis.objection_type;
    const mainType = extractMainType(type);
    objectionTypes[mainType] = (objectionTypes[mainType] || 0) + 1;
  }
  
  // Also check for signal_type which might contain objection info
  else if (signal?.signal_type && signal.signal_type.toLowerCase().includes('objection')) {
    const type = signal.signal_type;
    const mainType = extractMainType(type);
    objectionTypes[mainType] = (objectionTypes[mainType] || 0) + 1;
  }
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
      
      // Check if it's an object with a 'signals' array inside
      if (parsedSignals?.signals && Array.isArray(parsedSignals.signals)) {
        parsedSignals.signals.forEach((s: any) => {
          processConfidenceInSignal(s, confidenceBuckets);
        });
      }
      // Check if it's a direct array of signals
      else if (Array.isArray(parsedSignals)) {
        parsedSignals.forEach((s: any) => {
          processConfidenceInSignal(s, confidenceBuckets);
        });
      }
      // Direct single signal
      else {
        processConfidenceInSignal(parsedSignals, confidenceBuckets);
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

// Helper to process confidence in a signal object
function processConfidenceInSignal(s: any, confidenceBuckets: any) {
  // Check direct confidence field
  if (s?.confidence) {
    const confidence = parseFloat(s.confidence);
    if (!isNaN(confidence)) {
      addToConfidenceBucket(confidence, confidenceBuckets);
    }
  }
  
  // Check for confidence in objection resolution
  if (s?.objection_analysis?.confidence_in_resolution) {
    const confidence = parseFloat(s.objection_analysis.confidence_in_resolution);
    if (!isNaN(confidence)) {
      addToConfidenceBucket(confidence, confidenceBuckets);
    }
  }
}

// Helper to add a confidence value to the appropriate bucket
function addToConfidenceBucket(confidence: number, buckets: any) {
  if (confidence >= buckets.high.min) {
    buckets.high.count++;
  } else if (confidence >= buckets.medium.min) {
    buckets.medium.count++;
  } else {
    buckets.low.count++;
  }
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
      const nbaData = safeJsonParse(deal.nba, {});
      
      // Check NBA action_verb first
      if (nbaData?.nba_action?.action_verb) {
        const verb = nbaData.nba_action.action_verb;
        actionTypes[verb] = (actionTypes[verb] || 0) + 1;
      }
      
      // Check for actions array inside 'actions' property
      if (actions?.actions && Array.isArray(actions.actions)) {
        actions.actions.forEach((action: any) => {
          if (action?.action_verb) {
            const verb = action.action_verb;
            actionTypes[verb] = (actionTypes[verb] || 0) + 1;
          }
        });
      }
      // Check if it's a direct array of actions
      else if (Array.isArray(actions)) {
        actions.forEach((action: any) => {
          if (action?.action_verb) {
            const verb = action.action_verb;
            actionTypes[verb] = (actionTypes[verb] || 0) + 1;
          }
        });
      }
      // Direct single action
      else if (actions?.action_verb) {
        const verb = actions.action_verb;
        actionTypes[verb] = (actionTypes[verb] || 0) + 1;
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
    // "Closed Won": { count: 0, avgDays: 0, totalDays: 0 },
    // "Closed Lost": { count: 0, avgDays: 0, totalDays: 0 }
  };
  
  deals.forEach(deal => {
   console.log("stage inside",deal);
    // Check if deal_stage exists and is a string before trying to use it
    if (deal && deal.deal_stage && typeof deal.deal_stage === 'string') {
      const str = deal.deal_stage;
      
      const stage = str.charAt(0).toUpperCase() + str.slice(1);
      // Simulate days in stage (since we don't have real data for this)
      const daysInStage = Math.floor(Math.random() * 60) + 5;
      
      if (stageData[stage]) {
        stageData[stage].count++;
        stageData[stage].totalDays += daysInStage;
      }
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

// Helper to process signal type distribution
export function processSignalTypeData(deals: any[]) {
  const signalTypes: Record<string, number> = {
    "Objections": 0,
    "Opportunities": 0,
    "Confusion Points": 0,
    "External Factors": 0
  };
  
  deals.forEach(deal => {
    try {
      const signalsData = safeJsonParse(deal.signals);
      
      // Check if it's an object with a 'signals' array inside
      if (signalsData?.signals && Array.isArray(signalsData.signals)) {
        signalsData.signals.forEach((signal: any) => {
          processSignalType(signal, signalTypes);
        });
      }
      // Check if it's a direct array of signals
      else if (Array.isArray(signalsData)) {
        signalsData.forEach((signal: any) => {
          processSignalType(signal, signalTypes);
        });
      }
      // Direct single signal
      else if (signalsData && typeof signalsData === 'object') {
        processSignalType(signalsData, signalTypes);
      }
    } catch (e) {
      console.error("Error processing signal type data:", e);
    }
  });
  
  // Format for pie chart
  return Object.entries(signalTypes).map(([name, value]) => ({
    name,
    value: value || 0
  }));
}

// Helper to process signal type
function processSignalType(signal: any, signalTypes: Record<string, number>) {
  if (signal?.signal_type) {
    const signalType = signal.signal_type.toLowerCase();
    
    if (signalType.includes('objection')) {
      signalTypes["Objections"]++;
    } else if (signalType.includes('opportunity') || signalType.includes('expansion')) {
      signalTypes["Opportunities"]++;
    } else if (signalType.includes('confusion')) {
      signalTypes["Confusion Points"]++;
    } else if (signalType.includes('external')) {
      signalTypes["External Factors"]++;
    }
  }
  
  // Also check for objection_analysis which indicates an objection
  else if (signal?.objection_analysis) {
    signalTypes["Objections"]++;
  }
}
