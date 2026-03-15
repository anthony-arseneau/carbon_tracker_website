import { useEffect, useState } from 'react';
import { CONFIG, getAcceleratedTotalEmissions, getYearsUntilBudgetDepleted } from '../config';
import { calculateTimeElapsed } from '../utils';

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

export default function CarbonBudget() {
  const [budgetData, setBudgetData] = useState({
    remaining15: CONFIG.carbonBudget15,
    remaining20: CONFIG.carbonBudget20,
    depleted15Percent: 0,
    depleted20Percent: 0,
    yearsTo15: 0,
    yearsTo20: 0,
  });

  useEffect(() => {
    const updateBudget = () => {
      const elapsed = calculateTimeElapsed(CONFIG.startDate);
      const totalEmissionsGt = getAcceleratedTotalEmissions(elapsed.totalSeconds) / 1e9;
      
      const remaining15 = Math.max(0, CONFIG.carbonBudget15 - totalEmissionsGt);
      const remaining20 = Math.max(0, CONFIG.carbonBudget20 - totalEmissionsGt);
      
      const depleted15Percent = ((CONFIG.initialBudget15 - remaining15) / CONFIG.initialBudget15) * 100;
      const depleted20Percent = ((CONFIG.initialBudget20 - remaining20) / CONFIG.initialBudget20) * 100;
      
      const yearsTo15 = getYearsUntilBudgetDepleted(remaining15 * 1e9, elapsed.totalSeconds);
      const yearsTo20 = getYearsUntilBudgetDepleted(remaining20 * 1e9, elapsed.totalSeconds);

      setBudgetData({
        remaining15,
        remaining20,
        depleted15Percent,
        depleted20Percent,
        yearsTo15,
        yearsTo20,
      });
    };

    updateBudget();
    const interval = setInterval(updateBudget, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-12">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        REMAINING GLOBAL CARBON BUDGET
      </h2>
      
      <div className="border border-dark-border rounded-lg bg-dark-card p-6 glow-orange">
        <div className="flex items-center gap-2 text-neon-orange mb-6">
          <ClockIcon />
          <span className="text-sm tracking-[0.2em] font-semibold">CARBON BUDGET STATUS</span>
        </div>
        
        {/* 1.5°C Budget Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white">To 1.5°C Limit (50% chance)</span>
            <span className="text-sm text-neon-red text-glow-red">{budgetData.remaining15.toFixed(0)} Gt remaining</span>
          </div>
          <div className="h-4 bg-dark-slate rounded-full overflow-hidden">
            <div 
              className="h-full progress-bar-red-danger rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(budgetData.depleted15Percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-text">Initial: {CONFIG.initialBudget15} Gt (2020)</span>
            <span className="text-xs text-neon-red">~{budgetData.depleted15Percent.toFixed(0)}% depleted</span>
          </div>
        </div>
        
        {/* 2.0°C Budget Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white">To 2.0°C Limit (67% chance)</span>
            <span className="text-sm text-neon-orange text-glow-orange">{budgetData.remaining20.toFixed(0)} Gt remaining</span>
          </div>
          <div className="h-4 bg-dark-slate rounded-full overflow-hidden">
            <div 
              className="h-full progress-bar-orange rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(budgetData.depleted20Percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-text">Initial: {CONFIG.initialBudget20} Gt (2020)</span>
            <span className="text-xs text-neon-orange">~{budgetData.depleted20Percent.toFixed(0)}% depleted</span>
          </div>
        </div>
        
        {/* Depletion Timeline */}
        <div className="border-t border-dark-border pt-6">
          <p className="text-xs tracking-[0.2em] text-muted-text mb-3">
            TIME REMAINING AT CURRENT EMISSION RATE
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-dark-slate rounded-lg">
              <p className="text-xs text-muted-text mb-1">TO 1.5°C LIMIT</p>
              <p className="text-2xl font-bold text-neon-red text-glow-red">
                ~{budgetData.yearsTo15.toFixed(1)} YEARS
              </p>
            </div>
            <div className="text-center p-4 bg-dark-slate rounded-lg">
              <p className="text-xs text-muted-text mb-1">TO 2.0°C LIMIT</p>
              <p className="text-2xl font-bold text-neon-orange text-glow-orange">
                ~{budgetData.yearsTo20.toFixed(1)} YEARS
              </p>
            </div>
          </div>
        </div>
        
        {/* Warning Note */}
        <div className="bg-dark-slate/50 border border-neon-orange/30 rounded-lg p-4 text-sm">
          <p className="mb-2 text-white">
            In Jan 2026, the global budget for <span className="font-semibold">1.5°C</span> was approximately{' '}
            <span className="font-semibold">275 GtCO₂</span>. Remaining budget depletes by{' '}
            <span className="text-neon-orange font-semibold">~14.5%</span> annually at current rates.
          </p>
          <p className="text-neon-orange">
            At sustained consumption, the entire 1.5°C budget will be{' '}
            <span className="font-semibold">exhausted in 6-7 years</span>—creating 
            catastrophic risks for ecosystem services upon which{' '}
            <span className="font-semibold">ALL humanity</span> depends.
          </p>
        </div>
        
        <p className="text-xs text-muted-text mt-4 italic">
          Source: IPCC AR6 Working Group I, Global Carbon Budget 2025
        </p>
      </div>
    </section>
  );
}
