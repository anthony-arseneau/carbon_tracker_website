import { useMemo } from 'react';
import { GAUGE_CONFIG } from '../config';

/**
 * Splits a formatted number string into a static prefix and a changing suffix.
 * prefixLength controls how many *digit characters* remain static.
 */
function splitPrefix(value, prefixLength) {
  const formatted = value.toLocaleString();
  let digitsSeen = 0;
  let splitIdx = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] >= '0' && formatted[i] <= '9') digitsSeen++;
    if (digitsSeen >= prefixLength) {
      // include trailing comma/separator if present
      splitIdx = i + 1;
      if (formatted[splitIdx] === ',') splitIdx++;
      break;
    }
  }
  return {
    prefix: formatted.slice(0, splitIdx),
    suffix: formatted.slice(splitIdx),
  };
}

/* ── Micro-Ticker (top 25%) ──────────────────────────────── */
function MicroTicker({ budgetRemaining }) {
  const { MARKER_INTERVAL, LABEL_INTERVAL, PIXELS_PER_INTERVAL, PREFIX_LENGTH } = GAUGE_CONFIG;
  const pixelsPerTonne = PIXELS_PER_INTERVAL / LABEL_INTERVAL;

  const { prefix } = splitPrefix(Math.floor(budgetRemaining), PREFIX_LENGTH);

  const markers = useMemo(() => {
    const list = [];
    const windowPx = 400;
    const windowTonnes = windowPx / pixelsPerTonne;
    const start = Math.floor((budgetRemaining - windowTonnes) / MARKER_INTERVAL) * MARKER_INTERVAL;
    const end = Math.ceil((budgetRemaining + windowTonnes) / MARKER_INTERVAL) * MARKER_INTERVAL;

    for (let v = start; v <= end; v += MARKER_INTERVAL) {
      if (v < 0) continue;
      const isLabel = Math.round(v % LABEL_INTERVAL) === 0;
      const yOffset = (budgetRemaining - v) * pixelsPerTonne;

      list.push(
        <div
          key={v}
          className="absolute left-0 right-0 flex items-center justify-between"
          style={{
            transform: `translateY(${yOffset}px)`,
            height: '1px',
            top: '50%',
            paddingLeft: '6px',
            paddingRight: '6px',
          }}
        >
          <div className={`h-[1px] shrink-0 ${isLabel ? 'w-3 bg-white/70' : 'w-2 bg-white/20'}`} />
          {isLabel && (
            <span
              className="text-[9px] font-mono tabular-nums whitespace-nowrap text-right"
              style={{ color: 'rgba(255,255,255,0.75)', textShadow: '0 0 6px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }}
            >
              {splitPrefix(v, PREFIX_LENGTH).suffix || '0'}
            </span>
          )}
        </div>,
      );
    }
    return list;
  }, [budgetRemaining, pixelsPerTonne, MARKER_INTERVAL, LABEL_INTERVAL, PREFIX_LENGTH]);

  return (
    <div className="relative flex-[1] overflow-hidden">
      {/* Neon-orange fill below the live edge — fades from orange at bottom to transparent exactly at the line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '50%',
          background: 'linear-gradient(to top, rgba(251,146,60,0.22), rgba(251,146,60,0.07) 70%, transparent 100%)',
        }}
      />

      {/* Moving markers */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {markers}
      </div>

      {/* Static prefix — left-aligned to border, just above the level line */}
      <div
        className="absolute z-40 pointer-events-none"
        style={{ top: '50%', left: '28px', transform: 'translateY(-90%)' }}
      >
        <span className="text-[9px] font-mono text-white/75 tabular-nums whitespace-nowrap">
          {prefix}
        </span>
      </div>

      {/* Live Edge Indicator Line */}
      <div
        className="absolute top-1/2 left-0 right-0 h-[2px] bg-orange-400 z-30"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(251,146,60,1)) drop-shadow(0 0 14px rgba(251,146,60,0.5))',
        }}
      />

      {/* Glass depth fades — heavy top & bottom, clear only in the center */}
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-dark-card via-dark-card/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-dark-card/90 to-transparent z-20 pointer-events-none" />
      {/* Glass glare — subtle highlight from top-left */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent z-10 pointer-events-none" />
    </div>
  );
}

/* ── Macro-Tank (bottom 75%) ─────────────────────────────── */
function MacroTank({ budgetRemaining }) {
  const { TOTAL_BUDGET } = GAUGE_CONFIG;
  const pctRemaining = Math.max(Math.min(budgetRemaining / TOTAL_BUDGET, 1), 0);

  // Scale labels: every 100 Gt from 0 to 1150 Gt
  const SCALE_STEP = 100_000_000_000; // 100 Gt
  const scaleMarks = [];
  for (let v = 0; v <= TOTAL_BUDGET; v += SCALE_STEP) {
    // position from top: higher values = higher up (bottom = 0, top = TOTAL_BUDGET)
    const topPct = (1 - v / TOTAL_BUDGET) * 100;
    const label = v === 0 ? '0' : `${(v / 1_000_000_000_000).toFixed(v % 1_000_000_000_000 === 0 ? 0 : 1).replace(/^0\./, '.')} T`;
    scaleMarks.push({ topPct, label });
  }

  return (
    <div className="relative flex-[3] border-t border-dark-border overflow-hidden">
      {/* Exhausted (grey) background */}
      <div className="absolute inset-0 bg-white/[0.03]" />

      {/* Remaining (orange fill) — solid constant orange */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
        style={{
          height: `${pctRemaining * 100}%`,
          background: 'rgba(251,146,60,0.35)',
        }}
      />

      {/* Scale marks */}
      {scaleMarks.map(({ topPct, label }) => (
        <div
          key={label}
          className="absolute left-0 right-0 flex items-center justify-between pointer-events-none"
          style={{ top: `${topPct}%`, paddingLeft: '6px', paddingRight: '6px' }}
        >
          <div className="h-[1px] w-3 bg-white/30 shrink-0" />
          <span
            className="text-[9px] font-mono tabular-nums whitespace-nowrap text-right"
            style={{ color: 'rgba(255,255,255,0.45)', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}
          >
            {label}
          </span>
        </div>
      ))}

      {/* Stockpile label */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-1 pointer-events-none z-10">
        <span
          className="text-[9px] font-mono uppercase tracking-widest whitespace-nowrap"
          style={{ color: 'rgba(255,255,255,0.35)', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}
        >
          stockpile
        </span>
      </div>
    </div>
  );
}

/* ── VerticalDepletionGauge (combined) ───────────────────── */
export default function VerticalDepletionGauge({ budgetRemaining }) {
  return (
    <div className="flex flex-col h-full w-32 border border-dark-border rounded-lg bg-dark-card overflow-hidden">
      <MicroTicker budgetRemaining={budgetRemaining} />
      <MacroTank budgetRemaining={budgetRemaining} />
    </div>
  );
}
