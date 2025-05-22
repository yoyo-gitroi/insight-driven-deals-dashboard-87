
export const OBJECTION_COLORS = [
  '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', 
  '#8E9196', '#6E59A5', '#FEC6A1', '#E5DEFF'
];

export const generateConfigNames = (prefix: string, count: number = 9): string[] => {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
};
