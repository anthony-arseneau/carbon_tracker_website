import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ORANGE = '#FF9F43';
const ORANGE_GLOW = '0 0 4px rgba(255, 159, 67, 0.5), 0 0 10px rgba(255, 159, 67, 0.25)';
const RED = '#B91C1C';
const RED_GLOW = '0 0 4px rgba(185, 28, 28, 0.5), 0 0 10px rgba(185, 28, 28, 0.25)';

function HighPrecisionLens({ budgetRemaining, color }) {
  // We want to show a scientific scale. 
  // Each tick represents 20,000 tonnes (smaller ticks)
  // Each number represents 200,000 tonnes (large ticks)
  // Scaling for 20k intervals as requested
  const tickInterval = 20_000;
  const labelInterval = 200_000;
  
  // 100px per 200k tonnes — keeps labels legible at depletion speed
  const pixelsPerTonne = 100 / 200_000;
  
  // Center range on budgetRemaining; scroll LEFT as budget decreases
  const startValue = Math.floor(budgetRemaining / tickInterval) * tickInterval - labelInterval * 2;
  const endValue = startValue + labelInterval * 5;
  
  const ticks = [];
  for (let v = startValue; v <= endValue; v += tickInterval) {
    // Negate so smaller v values (future) enter from the right and exit left
    const x = (budgetRemaining - v) * pixelsPerTonne;
    const isLabel = Math.round(v % labelInterval) === 0;
    
    ticks.push(
      <div 
        key={v}
        className="absolute flex flex-col items-center top-1 bottom-1"
        style={{ 
          left: `calc(50% + ${x}px)`,
          transform: 'translateX(-50%)',
          transition: 'none'
        }}
      >
        <div 
          className="w-[1.5px] bg-white" 
          style={{ 
            height: isLabel ? '12px' : '4px',
            opacity: isLabel ? 0.9 : 0.4 
          }}
        />
        {isLabel && (
          <div className="text-[10px] font-mono font-bold text-white tracking-tighter mt-1 whitespace-nowrap opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {v.toLocaleString()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="absolute -top-[52px] h-[44px] w-[180px] border border-white/20 rounded-[2px] overflow-hidden flex items-center justify-center pointer-events-none"
      style={{ 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 23, 42, 0.4)', // semi-transparent dark background
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        left: 'var(--lens-pos)',
        transform: 'translateX(-50%)',
        zIndex: 50
      }}
    >
      {/* Precision Lens Indicator (The Hairline) */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] z-50 mix-blend-difference" style={{ backgroundColor: color }} />
      
      {/* Ticker Content */}
      <div className="absolute inset-x-0 h-full flex items-center">
        {ticks}
      </div>

      {/* Decorative Glare */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Glass Fade Edges */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[rgba(15,23,42,0.8)] to-transparent z-20" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[rgba(15,23,42,0.8)] to-transparent z-20" />
    </div>
  );
}

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
    <div 
      className="absolute bottom-4 left-4 right-4 z-10"
      style={{ '--lens-pos': `${100 - pctRemaining}%` }}
    >
      <HighPrecisionLens budgetRemaining={budgetRemaining} color={color} />
      <div
        className="w-full h-[6px] rounded-full relative"
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
