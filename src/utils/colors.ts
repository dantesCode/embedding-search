export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  // Basic colors
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

export const format = {
  error: (text: string) => `${colors.red}${text}${colors.reset}`,
  warning: (text: string) => `${colors.yellow}${text}${colors.reset}`,
  success: (text: string) => `${colors.green}${text}${colors.reset}`,
  info: (text: string) => `${colors.cyan}${text}${colors.reset}`,
  bold: (text: string) => `${colors.bold}${text}${colors.reset}`,
};

export const getSimilarityColor = (similarity: number): string => {
  if (similarity > 0.8) return colors.green;
  if (similarity > 0.6) return colors.yellow;
  return colors.red;
};
