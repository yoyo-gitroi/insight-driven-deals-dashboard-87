
export const OBJECTION_COLORS = [
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500 
  '#f97316', // orange-500
  '#10b981', // emerald-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#a855f7',  // purple-500
  '#14b8a6', // teal-500
  '#84cc16', // lime-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#22c55e', // green-500
  '#eab308'  // yellow-500
];

export const SECTION_COLORS = {
  executive: '#8b5cf6', // violet
  signals: '#f97316', // orange
  performance: '#10b981', // emerald
  stakeholders: '#3b82f6', // blue
  patterns: '#ec4899', // pink
  acceleration: '#14b8a6', // teal
  expansion: '#84cc16', // lime
  content: '#eab308', // yellow
  strategic: '#ef4444' // red
};

export const generateConfigNames = (prefix: string, count: number = 9): string[] => {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
};
