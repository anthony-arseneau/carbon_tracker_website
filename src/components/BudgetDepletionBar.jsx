import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ORANGE = '#FF9F43';
const ORANGE_GLOW = '0 0 4px rgba(255, 159, 67, 0.5), 0 0 10px rgba(255, 159, 67, 0.25)';
const RED = '#B91C1C';
const RED_GLOW = '0 0 4px rgba(185, 28, 28, 0.5), 0 0 10px rgba(185, 28, 28, 0.25)';

export default function BudgetDepletionBar({ budgetRemaining, initialBudget, criticalThreshold, isOvershoot, overshootFraction }) {
  const [introComplete, setIntroComplete] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const timer = setTimeout(() => setIntroComplete(true), 1600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Overshoot mode: empty bar fills from the LEFT with red
  if (isOvershoot) {
    const pctFilled = Math.max(Math.min((overshootFraction || 0) * 100, 100), 0);
    return (
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="w-full h-[6px] rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          {!introComplete ? (
            <motion.div
              className="h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${pctFilled}%` }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ backgroundColor: RED, boxShadow: RED_GLOW }}
            />
          ) : (
            <div
              className="h-full rounded-full"
              style={{
                width: `${pctFilled}%`,
                backgroundColor: RED,
                boxShadow: RED_GLOW,
                transition: 'width 0.15s linear',
              }}
            />
          )}
        </div>
        <motion.div
          className="absolute inset-0 h-[6px] rounded-full pointer-events-none"
          style={{ width: `${pctFilled}%`, backgroundColor: RED }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  // Normal depletion mode: bar depletes from the left
  const pctRemaining = Math.max(Math.min(budgetRemaining / initialBudget, 1), 0) * 100;
  const isDanger = budgetRemaining < criticalThreshold;
  const color = isDanger ? RED : ORANGE;
  const glow = isDanger ? RED_GLOW : ORANGE_GLOW;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div
        className="w-full h-[6px] rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
      >
        {!introComplete ? (
          <motion.div
            className="h-full rounded-full ml-auto"
            initial={{ width: '100%' }}
            animate={{ width: `${pctRemaining}%` }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: color, boxShadow: glow }}
          />
        ) : (
          <div
            className="h-full rounded-full ml-auto"
            style={{
              width: `${pctRemaining}%`,
              backgroundColor: color,
              boxShadow: glow,
              transition: 'width 0.15s linear',
            }}
          />
        )}
      </div>
      {isDanger && (
        <motion.div
          className="absolute inset-0 h-[6px] rounded-full pointer-events-none ml-auto"
          style={{ width: `${pctRemaining}%`, backgroundColor: color }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}
