import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CONFIG, getAcceleratedTonnesPerSecond } from '../config';
import { calculateTimeElapsed, formatNumber } from '../utils';

// const SPHERE_COLOR = '#00A8E8';
// const SPHERE_HIGHLIGHT = '#60D5FA';
// const SPHERE_DARK = '#004466';
// const SPHERE_GLOW = 'rgba(0, 168, 232, 0.25)';

const SPHERE_COLOR = '#e87c00';
const SPHERE_HIGHLIGHT = '#fab260';
const SPHERE_DARK = '#663c00';
const SPHERE_GLOW = 'rgba(232, 151, 0, 0.25)';

// Mini sphere positions for the "sea" — pre-computed for consistent layout
function generateMiniSpheres(count, width, height) {
  const spheres = [];
  const cols = Math.ceil(Math.sqrt(count * (width / height)));
  const rows = Math.ceil(count / cols);
  const spacingX = width / (cols + 1);
  const spacingY = height / (rows + 1);
  // Make mini spheres smaller on mobile
  const baseRadius = width < 600 ? 3 : 6;
  let id = 0;
  for (let r = 0; r < rows && id < count; r++) {
    for (let c = 0; c < cols && id < count; c++) {
      const jitterX = (Math.sin(id * 7.3) * 0.5) * spacingX;
      const jitterY = (Math.cos(id * 4.1) * 0.35) * spacingY;
      spheres.push({
        id: id++,
        cx: spacingX * (c + 1) + jitterX,
        cy: spacingY * (r + 1) + jitterY,
        r: baseRadius + (Math.sin(id * 2.7) * 0.2),
      });
    }
  }
  return spheres;
}

function MainSphere({ cx, cy, r }) {
  return (
    <g>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={r * 1.15} fill="none" stroke={SPHERE_COLOR} strokeWidth={0.5} opacity={0.15} />
      <circle cx={cx} cy={cy} r={r * 1.08} fill="none" stroke={SPHERE_COLOR} strokeWidth={0.3} opacity={0.25} />

      {/* Shadow underneath — 10% larger than sphere */}
      <ellipse cx={cx} cy={cy + r + 8} rx={r * 1.05} ry={8} fill="rgba(0,0,0,0.35)" />

      {/* Main sphere body */}
      <circle cx={cx} cy={cy} r={r} fill="url(#sphereGradient)" />

      {/* Specular highlight */}
      <ellipse
        cx={cx - r * 0.25}
        cy={cy - r * 0.3}
        rx={r * 0.45}
        ry={r * 0.35}
        fill="url(#specularGradient)"
        opacity={0.6}
      />

      {/* Edge rim light */}
      <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke="url(#rimGradient)" strokeWidth={1.5} opacity={0.5} />

      {/* Interior text */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="14" fontFamily="'JetBrains Mono', monospace" fontWeight="700" opacity={0.95}>
        1 tonne CO₂
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="12" fontFamily="'JetBrains Mono', monospace" fontWeight="500">
        (1,000 kg)
      </text>
    </g>
  );
}

function DiameterLine({ cx, cy, r, width }) {
  const top = cy - r + 15;
  const bottom = cy + r;
  // Responsive offset: less margin on small screens
  const offset = width < 550 ? -16 : 22;
  const x = cx + r + offset;
  return (
    <g>
      {/* Vertical line */}
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={SPHERE_HIGHLIGHT} strokeWidth={1} strokeDasharray="3,3" opacity={0.7} />
      {/* Top cap */}
      <line x1={x - 6} y1={top} x2={x + 6} y2={top} stroke={SPHERE_HIGHLIGHT} strokeWidth={1} opacity={0.7} />
      {/* Bottom cap */}
      <line x1={x - 6} y1={bottom} x2={x + 6} y2={bottom} stroke={SPHERE_HIGHLIGHT} strokeWidth={1} opacity={0.7} />
      {/* Label */}
      <text x={x + 8} y={cy + 3} fill={SPHERE_HIGHLIGHT} fontSize="14" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        10.07m
      </text>
      <text x={x + 8} y={cy + 17} fill={SPHERE_HIGHLIGHT} fontSize="12" fontFamily="'JetBrains Mono', monospace" fontWeight="500">
        DIAMETER
      </text>
    </g>
  );
}

function HumanImage({ x, baseY, scale }) {
  // ~1.7m tall human, sphere is 10.07m diameter.  Ratio: 1.7/10.07 ≈ 0.169
  const humanH = scale * 0.169;
  const humanW = humanH * 0.45; // approximate aspect ratio
  const imgX = x - humanW / 2;
  const imgY = baseY - humanH;
  const lineX = x + humanW / 2 + 8;

  return (
    <g opacity={0.85}>
      {/* Small shadow ellipse under human */}
      <ellipse
        cx={x}
        cy={baseY + 1}
        rx={(humanW * 1.05) / 2}
        ry={humanH * 0.03}
        fill="rgba(0,0,0,0.32)"
      />
      <image
        href="/human.png"
        x={imgX}
        y={imgY}
        width={humanW}
        height={humanH}
        preserveAspectRatio="xMidYMax meet"
      />
      {/* Height measurement line */}
      <line x1={lineX} y1={imgY} x2={lineX} y2={baseY} stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="2,2" opacity={0.7} />
      <line x1={lineX - 4} y1={imgY} x2={lineX + 4} y2={imgY} stroke="#94a3b8" strokeWidth={0.8} opacity={0.7} />
      <line x1={lineX - 4} y1={baseY} x2={lineX + 4} y2={baseY} stroke="#94a3b8" strokeWidth={0.8} opacity={0.7} />
      <text x={lineX + 8} y={(imgY + baseY) / 2 + 4} fill="rgba(255,255,255,0.9)" fontSize="12" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        1.7m
      </text>
    </g>
  );
}

function MiniSphere({ cx, cy, r }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={0}
      fill="url(#miniSphereGradient)"
      initial={{ r: 0, opacity: 0 }}
      animate={{ r, opacity: 0.8 }}
    />
  );
}

function ScalingLines({ sphereCx, sphereCy, sphereR, toX, toY, toR }) {
  // Left-most point of large sphere (9 o'clock) → left edge of small sphere
  const fromLeftX = sphereCx - (sphereR * Math.cos(55/180 * Math.PI));
  const fromLeftY = sphereCy + (sphereR * Math.sin(55/180 * Math.PI));
  // Right-most point of large sphere (3 o'clock) → right edge of small sphere
  const fromRightX = sphereCx + (sphereR * Math.cos(55/180 * Math.PI));
  const fromRightY = sphereCy + (sphereR * Math.sin(55/180 * Math.PI));

  return (
    <g>
      <line x1={fromLeftX} y1={fromLeftY} x2={toX - toR} y2={toY} stroke={SPHERE_COLOR} strokeWidth={0.7} strokeDasharray="4,4" opacity={0.9} />
      <line x1={fromRightX} y1={fromRightY} x2={toX + toR} y2={toY} stroke={SPHERE_COLOR} strokeWidth={0.7} strokeDasharray="4,4" opacity={0.9} />
    </g>
  );
}

export default function CO2SphereVisualization() {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 860, h: 860 });
  const [rates, setRates] = useState({ perSecond: 0, perMinute: 0, perDay: 0 });

  // Responsive sizing: add extra top and bottom padding for glow and labels
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Sphere should be as wide as possible, but leave room for glow and labels
        // On mobile, use more vertical space for the sphere
        const width = rect.width;
        let height;
        if (width < 500) {
          height = width * 1.45; // more vertical space on mobile
        } else {
          height = width * 1.05 + 120; // extra for glow and labels
        }
        setDims({ w: width, h: height });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    function updateRates() {
      const elapsed = calculateTimeElapsed(CONFIG.startDate);
      const perSecond = getAcceleratedTonnesPerSecond(elapsed.totalSeconds);
      setRates({
        perSecond,
        perMinute: perSecond * 60,
        perDay: perSecond * 86400,
      });
    }
    updateRates();
    const interval = setInterval(updateRates, CONFIG.updateInterval || 50);
    return () => clearInterval(interval);
  }, []);

  const { w, h } = dims;
  // Sphere radius: maximize width, but leave margin for glow and labels
  const sphereR = Math.min(w * 0.32, 260);
  const sphereCx = w * 0.5;
  // Place sphere lower to allow for glow at top
  const sphereCy = w < 500 ? h * 0.29 : h * 0.32;

  // Scaling lines endpoints
  const seaTop = sphereCy + sphereR + 54;
  // Sea height: leave enough space for labels below
  const seaH = Math.max(h - seaTop - 60, 60);
  const seaW = w * 0.85;
  const seaLeft = (w - seaW) / 2;

  let miniSpheres = generateMiniSpheres(1340, seaW, seaH);
  // Sort so larger spheres are rendered last (higher z-index)
  miniSpheres = miniSpheres.slice().sort((a, b) => a.r - b.r);

  return (
    <div className="mb-12 border border-dark-border rounded-xl bg-dark-card overflow-hidden">
      {/* Section header */}
      <div className="px-6 pt-5 pb-3">
        <p className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-1">
          SCALE VISUALIZATION
        </p>
        <h2 className="text-sm md:text-base font-bold tracking-widest font-mono text-slate-200">
          PHYSICAL VOLUME FOR 1 METRIC TONNE OF CO₂
        </h2>
        <p className="text-[11px] text-muted-text font-mono tracking-wide mt-1">
          Under standard conditions (STP), 1 tonne of CO₂ occupies ~534 m³ (a sphere 10.07m in diameter).
        </p>
      </div>

      <div ref={containerRef} className="w-full px-2 relative">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          width="100%"
          height="100%"
          className="block relative"
          style={{ 
            maxHeight: '900px',
            zIndex: 1,
            left: 0,
            top: 0,
            width: w,
            height: h,
            overflow: 'visible'
          }}
        >
          <defs>
            {/* Main sphere gradient — 3D illusion */}
            <radialGradient id="sphereGradient" cx="38%" cy="35%" r="60%" fx="35%" fy="30%">
              <stop offset="0%" stopColor={SPHERE_HIGHLIGHT} />
              <stop offset="40%" stopColor={SPHERE_COLOR} />
              <stop offset="75%" stopColor={SPHERE_DARK} />
              <stop offset="100%" stopColor="#001a2e" />
            </radialGradient>

            {/* Diagonal glow gradient for main sphere's glow */}
            <radialGradient id="diagonalGlowGradient" cx="20%" cy="20%" r="80%">
              <stop offset="0%" stopColor={SPHERE_COLOR} stopOpacity="0.45" />
              <stop offset="60%" stopColor={SPHERE_COLOR} stopOpacity="0.18" />
              <stop offset="100%" stopColor={SPHERE_COLOR} stopOpacity="0" />
            </radialGradient>

            {/* Specular highlight gradient */}
            <radialGradient id="specularGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.45" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Rim light */}
            <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={SPHERE_HIGHLIGHT} stopOpacity="0.6" />
              <stop offset="50%" stopColor={SPHERE_COLOR} stopOpacity="0" />
              <stop offset="100%" stopColor={SPHERE_HIGHLIGHT} stopOpacity="0.3" />
            </linearGradient>

            {/* Mini sphere gradient */}
            <radialGradient id="miniSphereGradient" cx="38%" cy="35%" r="60%">
              <stop offset="0%" stopColor={SPHERE_HIGHLIGHT} />
              <stop offset="50%" stopColor={SPHERE_COLOR} />
              <stop offset="100%" stopColor={SPHERE_DARK} />
            </radialGradient>

            {/* Glow filter */}
            <filter id="sphereGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient glow behind main sphere with diagonal gradient fade (moved to very back) */}
          <g>
            <circle cx={sphereCx} cy={sphereCy} r={sphereR * 1.7} fill="url(#diagonalGlowGradient)" filter="url(#sphereGlow)" opacity={0.7} />
          </g>

          {/* Main sphere */}
          <MainSphere cx={sphereCx} cy={sphereCy} r={sphereR} />

          {/* Diameter line */}
          <DiameterLine cx={sphereCx} cy={sphereCy} r={sphereR} width={w} />

          {/* Human image — standing at the base of the sphere */}
          <HumanImage
            x={sphereCx - sphereR - 24}
            baseY={sphereCy + sphereR}
            scale={sphereR * 2}
          />

          {/* Small target sphere at top of sea */}
          {(() => {
            const smallR = seaW < 600 ? 3 : 6;
            const smallCx = w / 2;
            const smallCy = seaTop - 10;
            return (
              <>
                {/* Diagonal scaling lines from bottom edges of big sphere to edges of small sphere */}
                <ScalingLines
                  sphereCx={sphereCx}
                  sphereCy={sphereCy}
                  sphereR={sphereR}
                  toX={smallCx}
                  toY={smallCy}
                  toR={smallR}
                />
                {/* The small sphere */}
                <circle cx={smallCx} cy={smallCy} r={smallR} fill="url(#miniSphereGradient)" opacity={0.85} />
                <circle cx={smallCx} cy={smallCy} r={smallR + 2} fill="none" stroke={SPHERE_COLOR} strokeWidth={0.4} opacity={0.9} />
              </>
            );
          })()}

          {/* Sea of mini spheres */}
          <g transform={`translate(${seaLeft}, ${seaTop})`}>
            {miniSpheres.map((s) => (
              <MiniSphere key={s.id} cx={s.cx} cy={s.cy} r={s.r} />
            ))}
          </g>

          {/* Dynamic emission rates (ensure always visible below sea) */}
          <g>
            <text x={w / 2} y={h - 40} textAnchor="middle" fill={SPHERE_COLOR} fontSize="15" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
              {`${formatNumber(rates.perSecond, 2)} tonnes CO₂ every second`}
            </text>
          </g>
          {/* Count label at bottom */}
          <text x={w / 2} y={h - 12} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="12" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.15em">
            EACH SPHERE = 1 TONNE CO₂
          </text>
        </svg>
      </div>
    </div>
  );
}
