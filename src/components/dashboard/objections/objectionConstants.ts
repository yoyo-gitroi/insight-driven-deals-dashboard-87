
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
