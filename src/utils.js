// Format number with commas
export function formatNumber(num, decimals = 0) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Format large numbers with suffix
export function formatLargeNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(0);
}

// Pad number with leading zero
export function padZero(num) {
  return String(Math.floor(num)).padStart(2, '0');
}

// Calculate time elapsed from start date
export function calculateTimeElapsed(startDate) {
  const now = new Date();
  const msSinceStart = now - startDate;
  const secondsSinceStart = msSinceStart / 1000;
  
  const days = Math.floor(secondsSinceStart / (24 * 60 * 60));
  const hours = Math.floor((secondsSinceStart % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsSinceStart % (60 * 60)) / 60);
  const seconds = Math.floor(secondsSinceStart % 60);
  
  return { days, hours, minutes, seconds, totalSeconds: secondsSinceStart };
}
