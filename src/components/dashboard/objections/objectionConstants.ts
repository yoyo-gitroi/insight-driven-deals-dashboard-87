
export const OBJECTION_COLORS = [
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500 
  '#f97316', // orange-500
  '#10b981', // emerald-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#a855f7'  // purple-500
];

export const generateConfigNames = (prefix: string, count: number = 9): string[] => {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
};

export const SIGNAL_TYPES = {
  Integration: { frequency: "80%", impact: "High", color: "#6366f1" },
  "Product Fit": { frequency: "70%", impact: "High", color: "#8b5cf6" },
  Expansion: { frequency: "60%", impact: "Medium", color: "#ec4899" },
  Confusion: { frequency: "50%", impact: "Medium", color: "#f97316" },
  Pricing: { frequency: "30%", impact: "High", color: "#f43f5e" }
};

export const INDUSTRY_PATTERNS = {
  "Financial Services": { 
    focus: "API integration focus",
    color: "#10b981" 
  },
  "Travel/Hospitality": { 
    focus: "Cloud migration priorities",
    color: "#0ea5e9" 
  },
  "Retail/E-commerce": { 
    focus: "Fragmented source challenges",
    color: "#3b82f6" 
  },
  "SaaS": { 
    focus: "Complex pipeline requirements",
    color: "#a855f7" 
  }
};

export const AE_METRICS = {
  topPerformers: [
    { name: "Bhaskar Sunkara", winRate: "High", velocity: "+18%", dealSize: "$150K+" },
    { name: "Karl Evans", winRate: "Strong", velocity: "+15%", dealSize: "$75K-$140K" },
    { name: "Randy Boysen", winRate: "High", velocity: "+20%", dealSize: "$300K+" }
  ],
  needsAttention: [
    { name: "Gomini Shreya", issues: ["Technical integration delays"] },
    { name: "Yashaswi Pathak", issues: ["Integration blockers", "-17% velocity"] },
    { name: "Rajiv Shivane", issues: ["Integration-heavy progress", "Cautious velocity"] }
  ]
};

export const STAKEHOLDER_MAP = {
  highInfluence: ["VP Data & Analytics", "Technical Architects", "Business Ops"],
  mediumInfluence: ["Product Managers", "Integration Leads"],
  missing: ["Procurement", "Finance", "IT Security"],
  engagementScore: {
    "VP Data & Analytics": 85,
    "Technical Architects": 80,
    "Business Ops": 75,
    "Product Managers": 60,
    "Integration Leads": 65,
    "Procurement": 25,
    "Finance": 30,
    "IT Security": 35
  }
};

export const RISK_MATRIX = {
  highProbHighImpact: ["Integration delays", "Stakeholder misalignment"],
  highProbLowImpact: ["Scope creep", "ROI uncertainty"],
  lowProbHighImpact: ["Competitive displacement"],
  lowProbLowImpact: ["Minor feature requests"]
};

export const STRATEGIC_ACTIONS = [
  {
    action: "Institutionalize technical deep-dives",
    impact: "30% reduction in integration time",
    owner: "Sales Leadership",
    timeline: "6 months",
    status: "Not Started"
  },
  {
    action: "Drive cross-functional stakeholder engagement",
    impact: "Improved deal velocity",
    owner: "Sales Enablement",
    timeline: "3 months",
    status: "In Progress"
  },
  {
    action: "Develop vertical-specific POC plans",
    impact: "Higher conversion rates",
    owner: "Product Marketing",
    timeline: "4 months",
    status: "Planning"
  },
  {
    action: "Expand enablement content for key objections",
    impact: "Better objection handling",
    owner: "Marketing",
    timeline: "2 months",
    status: "In Progress"
  },
  {
    action: "Implement data-driven deal scoring",
    impact: "Optimized resource allocation",
    owner: "Sales Ops",
    timeline: "3 months",
    status: "Not Started"
  }
];

export const EXPANSION_SIGNALS = {
  usageGrowth: { 
    accounts: ["Billtrust", "ecoATM", "Priceline"], 
    strength: "Strong" 
  },
  geographicExpansion: { 
    accounts: ["TheGuarantors", "Amadeus"], 
    timeline: "6 months" 
  },
  orgWideAdoption: { 
    accounts: ["Cognizant", "Amadeus", "HubSpot"], 
    departments: ["Sales", "Marketing", "Finance", "Operations"] 
  }
};
