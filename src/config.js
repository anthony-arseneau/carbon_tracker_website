// Configuration constants - Modify these values as needed
export const CONFIG = {
  // Annual emissions in tonnes CO2e (42.2 billion tonnes — 2024/2025 accelerated trend)
  annualTonnes: 42_200_000_000,
  
  // Start date for tracking
  startDate: new Date('2026-01-01T00:00:00Z'),
  
  // Carbon budgets in Gt CO2 (from IPCC AR6)
  carbonBudget15: 275,  // Remaining budget for 1.5°C (as of 2026)
  carbonBudget20: 900,  // Remaining budget for 2.0°C (as of 2026)
  initialBudget15: 500, // Initial budget from 2020
  initialBudget20: 1350, // Initial budget from 2020
  
  // Human impact figures (annual)
  heatDeaths: 500000,
  climateRefugees: 21500000,
  pollutionDeaths: 8700000,
  
  // Update interval in milliseconds
  updateInterval: 50,

  // Temperature anomaly (Berkeley Earth 2024 record)
  currentAnomaly: 1.62, // °C above pre-industrial (2024 record)
  anomalyYear: 2024,
  warmingRatePerYear: 0.03, // °C/yr (accelerated, accounts for aerosol reduction)
};

// Calculated constants
export const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
export const TONNES_PER_SECOND = CONFIG.annualTonnes / SECONDS_PER_YEAR;
export const TONNES_PER_MINUTE = TONNES_PER_SECOND * 60;
export const TONNES_PER_HOUR = TONNES_PER_MINUTE * 60;
export const TONNES_PER_DAY = TONNES_PER_HOUR * 24;

// 1.5°C Carbon budget constants (2026-adjusted)
export const INITIAL_BUDGET_15C = 170_000_000_000; // 170 Gt in tonnes
export const CRITICAL_BUDGET_THRESHOLD_15C = 20_000_000_000; // 20 Gt alert threshold

// 2.0°C Carbon budget constants (2026-adjusted, per IPCC AR6 + WMO 2025)
export const INITIAL_BUDGET_20C = 1_150_000_000_000; // ~1,150 Gt in tonnes
export const CRITICAL_BUDGET_THRESHOLD_20C = 150_000_000_000; // 150 Gt alert threshold

// Legacy alias
export const CRITICAL_BUDGET_THRESHOLD = CRITICAL_BUDGET_THRESHOLD_15C;

// Wildfire constants
export const ANNUAL_KM2_BURNED = 135_000; // Global average
export const KM2_PER_SECOND = ANNUAL_KM2_BURNED / SECONDS_PER_YEAR;
export const AVG_CO2_PER_KM2 = 4_300; // Tonnes (weighted avg across biomes)
