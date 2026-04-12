import { useEffect, useMemo, useRef } from 'react';
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

/* ── Layout constants ─────────────────────────────────────── */
const SCALE_RANGE_PCT = 75;       // T-scale occupies the bottom 75% of gauge
const INDICATOR_HEIGHT_PCT = 25;  // floating indicator height

/* ── Animated Wave Surface ────────────────────────────────── */
function WaveSurface() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = 0, h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      if (w === 0 || h === 0) resize();
      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h);
        const t = performance.now() / 1000;
        const baseline = h / 2;

        const getY = (x) => {
          const nx = x / w;
          return baseline
            + 1.8 * Math.sin(nx * Math.PI * 4 + t * 0.9)
            + 1.0 * Math.sin(nx * Math.PI * 7 - t * 1.3)
            + 0.5 * Math.sin(nx * Math.PI * 11 + t * 0.6);
        };

        // ── Fill below wave — gradient matches solid fill at bottom ──
        ctx.beginPath();
        ctx.moveTo(0, getY(0));
        for (let x = 1; x <= w; x++) ctx.lineTo(x, getY(x));
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = 'rgba(251,146,60,0.35)';
        ctx.fill();

        // ── Glowing wave stroke ──
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, getY(0));
        for (let x = 1; x <= w; x++) ctx.lineTo(x, getY(x));

        ctx.shadowColor = 'rgba(251,146,60,1)';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = 'rgba(251,146,60,0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.shadowColor = 'rgba(251,146,60,0.6)';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = 'rgba(251,146,60,0.9)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-30 w-full h-full pointer-events-none"
    />
  );
}

/* ── Floating Indicator (fine-grain ticker + wave) ────────── */
function FloatingIndicator({ budgetRemaining }) {
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
    <div className="relative w-full h-full overflow-hidden">
      {/* Moving markers */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {markers}
      </div>

      {/* Static prefix — left-aligned, just above the level line */}
      <div
        className="absolute z-50 pointer-events-none"
        style={{ top: '50%', left: '28px', transform: 'translateY(-90%)' }}
      >
        <span className="text-[9px] font-mono text-white/75 tabular-nums whitespace-nowrap">
          {prefix}
        </span>
      </div>

      {/* Animated wave surface */}
      <WaveSurface />

      {/* Glass depth fades — top and bottom edges dim out for separation (z-40 to render above wave canvas z-30) */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-dark-card via-dark-card/70 to-transparent z-40 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-dark-card/60 to-transparent z-40 pointer-events-none" />
      {/* Glass glare — subtle highlight from top-left */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent z-40 pointer-events-none" />
      {/* Glass border overlay — soft inner edge */}
      <div className="absolute inset-0 rounded-sm z-40 pointer-events-none" style={{ boxShadow: 'inset 0 0 12px 4px rgba(10,11,16,0.5)' }} />
    </div>
  );
}

/* ── Tank Scale Marks ─────────────────────────────────────── */
function TankScale() {
  const { TOTAL_BUDGET } = GAUGE_CONFIG;
  const SCALE_STEP = 100_000_000_000; // 100 Gt
  const scaleMarks = [];
  for (let v = 0; v <= TOTAL_BUDGET; v += SCALE_STEP) {
    const fromBottomPct = (v / TOTAL_BUDGET) * SCALE_RANGE_PCT;
    const topPct = 100 - fromBottomPct;
    const label = v === 0 ? '0' : `${(v / 1_000_000_000_000).toFixed(v % 1_000_000_000_000 === 0 ? 0 : 1).replace(/^0\./, '.')} T`;
    scaleMarks.push({ topPct, label });
  }

  return (
    <>
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
    </>
  );
}

/* ── VerticalDepletionGauge (combined) ───────────────────── */
export default function VerticalDepletionGauge({ budgetRemaining }) {
  const { TOTAL_BUDGET } = GAUGE_CONFIG;
  const pctRemaining = Math.max(Math.min(budgetRemaining / TOTAL_BUDGET, 1), 0);

  // Fill spans the bottom SCALE_RANGE_PCT of the gauge, proportional to remaining budget.
  // The floating indicator sits with its bottom aligned to the top of the fill.
  const fillPct = pctRemaining * SCALE_RANGE_PCT;
  const indicatorBottomPct = fillPct;

  return (
    <div className="relative h-full w-32 border border-dark-border rounded-lg bg-dark-slate overflow-hidden">
      {/* Exhausted (grey) background — full tank */}
      <div className="absolute inset-0 bg-white/[0.03]" />

      {/* Remaining (orange fill) — anchored to bottom, height synced with indicator */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: `${fillPct}%`,
          background: 'rgba(251,146,60,0.35)',
          transition: 'height 0.3s ease',
        }}
      />

      {/* T-scale marks — positioned within the bottom 75% of gauge */}
      <TankScale />

      {/* Stockpile label */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-1 pointer-events-none z-10">
        <span
          className="text-[9px] font-mono tracking-widest whitespace-nowrap"
          style={{ color: 'rgba(255,255,255,0.35)', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}
        >
          Stockpile
        </span>
      </div>

      {/* Floating indicator — rides on top of the liquid level */}
      <div
        className="absolute left-0 right-0 z-10"
        style={{
          height: `${INDICATOR_HEIGHT_PCT}%`,
          bottom: `${indicatorBottomPct}%`,
          transition: 'bottom 0.3s ease',
        }}
      >
        <FloatingIndicator budgetRemaining={budgetRemaining} />
      </div>
    </div>
  );
}
