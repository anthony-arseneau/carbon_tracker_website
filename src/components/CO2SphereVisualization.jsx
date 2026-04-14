import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CONFIG, getAcceleratedTonnesPerSecond } from '../config';
import { calculateTimeElapsed, formatNumber } from '../utils';

// Gas Color Profiles
const GASES = {
  CO2: { color: '#e87c00', highlight: '#fab260', dark: '#663c00', label: '1,000kg CO₂', sub: '= 1t CO₂e', diam: '10.07m', ratio: 1.0 },
  CH4: { color: '#6ffb24', highlight: '#a3fd8a', dark: '#45780f', label: '35.7kg CH₄', sub: '= 1t CO₂e', diam: '4.5m', ratio: 0.447 },
  N2O: { color: '#38bdf8', highlight: '#bae6fd', dark: '#075985', label: '3.7kg N₂O', sub: '= 1t CO₂e', diam: '1.5m', ratio: 0.149 },
  SF6: { color: '#c084fc', highlight: '#e9d5ff', dark: '#4c1d95', label: '0.04kg SF₆', sub: '= 1t CO₂e', diam: '0.23m', ratio: 0.023 }
};

// Generates a perfectly packed grid array of proportional spheres
function generateMiniSpheres(count, width, height) {
  const spheres = [];
  
  // 1. Calculate optimal cell size to pack 'count' items into width x height
  let cellSize = Math.sqrt((width * height) / count);
  let cols = Math.floor(width / cellSize);
  let rows = Math.ceil(count / cols);
  
  // Fine-tune if the grid overflows the available height
  while (rows * cellSize > height) {
    cellSize -= 0.1;
    cols = Math.floor(width / cellSize);
    rows = Math.ceil(count / cols);
  }

  const gap = 1; // 1 pixel gap between cells for visual definition
  const maxRadius = (cellSize - gap) / 2;
  
  // Center the block in the container
  const actualWidth = cols * cellSize;
  const startX = (width - actualWidth) / 2 + (cellSize / 2);
  const startY = (cellSize / 2);

  // Proportions of the total count
  const limitCO2 = count * 0.744;
  const limitCH4 = limitCO2 + (count * 0.173);
  const limitN2O = limitCH4 + (count * 0.062);

  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);

    let type = 'CO2';
    if (i >= limitCO2) type = 'CH4';
    if (i >= limitCH4) type = 'N2O';
    if (i >= limitN2O) type = 'SF6';

    // 2. Apply the scale difference based on the gas ratio
    const gasRatio = GASES[type].ratio;
    
    // Ensure even the tiny SF6 spheres render as at least 0.8px so they don't disappear entirely
    const calculatedRadius = Math.max(maxRadius * gasRatio, 0.8);

    spheres.push({
      id: i,
      cx: startX + (c * cellSize),
      cy: startY + (r * cellSize),
      r: calculatedRadius,
      type
    });
  }
  return spheres;
}

function MainSphere({ cx, cy, r, gasKey }) {
  const gas = GASES[gasKey];
  const isSmall = r < 20;
  const isSF6 = gasKey === 'SF6';

  return (
    <g>
      {!isSmall && (
        <>
          <circle cx={cx} cy={cy} r={r * 1.15} fill="none" stroke={gas.color} strokeWidth={0.5} opacity={0.15} />
          <circle cx={cx} cy={cy} r={r * 1.08} fill="none" stroke={gas.color} strokeWidth={0.3} opacity={0.25} />
        </>
      )}

      <ellipse cx={cx} cy={cy + r + (isSmall ? 2 : 8)} rx={r * 1.05} ry={isSmall ? 2 : 8} fill="rgba(0,0,0,0.35)" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#sphereGradient_${gasKey})`} />
      <ellipse cx={cx - r * 0.25} cy={cy - r * 0.3} rx={r * 0.45} ry={r * 0.35} fill="url(#specularGradient)" opacity={0.6} />
      <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke={`url(#rimGradient_${gasKey})`} strokeWidth={1.5} opacity={0.5} />

      {!isSmall ? (
        <>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="white"
            fontSize={r < 40 ? "10" : "14"}
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="700"
            opacity={0.95}
            style={{ textShadow: '0 1px 4px #000, 0 0px 2px #000' }}
          >
            {gas.label}
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.75)"
            fontSize="11"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="500"
            style={{ textShadow: '0 1px 4px #000, 0 0px 2px #000' }}
          >
            {gas.sub}
          </text>
        </>
      ) : (
        isSF6 ? (
          <g>
            <text
              x={cx}
              y={cy + r + 14}
              textAnchor="middle"
              fill={gas.highlight}
              fontSize="10"
              fontFamily="'JetBrains Mono', monospace"
              style={{ textShadow: '0 1px 4px #000, 0 0px 2px #000' }}
            >
              {gas.label}
            </text>
            <text
              x={cx}
              y={cy + r + 26}
              textAnchor="middle"
              fill={gas.highlight}
              fontSize="9"
              fontFamily="'JetBrains Mono', monospace"
              style={{ textShadow: '0 1px 4px #000, 0 0px 2px #000' }}
            >
              {gas.sub}
            </text>
          </g>
        ) : (
          <g>
            <text
              x={cx}
              y={cy - r - 10}
              textAnchor="middle"
              fill={gas.highlight}
              fontSize="10"
              fontFamily="'JetBrains Mono', monospace"
              style={{ textShadow: '0 1px 4px #000, 0 0px 2px #000' }}
            >
              {gas.label}
            </text>
            <text
              x={cx}
              y={cy - r + 2}
              textAnchor="middle"
              fill={gas.highlight}
              fontSize="9"
              fontFamily="'JetBrains Mono', monospace"
              style={{ textShadow: '0 1px 4px #000, 0 0px 2px #000' }}
            >
              {gas.sub}
            </text>
          </g>
        )
      )}
    </g>
  );
}

function DiameterLine({ cx, cy, r, gasKey, isRightSide }) {
  const gas = GASES[gasKey];
  const top = cy - r;
  const bottom = cy + r;
  const offset = isRightSide ? r + 15 : -r - 15;
  const x = cx + offset;
  const textAnchor = isRightSide ? "start" : "end";
  const textX = isRightSide ? x + 8 : x - 8;

  if (r < 10) return null;

  return (
    <g>
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={gas.highlight} strokeWidth={1} strokeDasharray="3,3" opacity={0.7} />
      <line x1={x - 4} y1={top} x2={x + 4} y2={top} stroke={gas.highlight} strokeWidth={1} opacity={0.7} />
      <line x1={x - 4} y1={bottom} x2={x + 4} y2={bottom} stroke={gas.highlight} strokeWidth={1} opacity={0.7} />
      <text x={textX} y={cy + 3} textAnchor={textAnchor} fill={gas.highlight} fontSize={r < 30 ? "10" : "13"} fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        {gas.diam}
      </text>
    </g>
  );
}

function HumanImage({ x, baseY, scale }) {
  const humanH = scale * 0.169;
  const humanW = humanH * 0.45; 
  const imgX = x - humanW / 2;
  const imgY = baseY - humanH;
  const lineX = x - humanW / 2 - 12;

  return (
    <g opacity={0.85}>
      <ellipse cx={x} cy={baseY + 1} rx={(humanW * 1.05) / 2} ry={humanH * 0.03} fill="rgba(0,0,0,0.32)" />
      <image href="/human.png" x={imgX} y={imgY} width={humanW} height={humanH} preserveAspectRatio="xMidYMax meet" />
      <line x1={lineX} y1={imgY} x2={lineX} y2={baseY} stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="2,2" opacity={0.7} />
      <line x1={lineX - 4} y1={imgY} x2={lineX + 4} y2={imgY} stroke="#94a3b8" strokeWidth={0.8} opacity={0.7} />
      <line x1={lineX - 4} y1={baseY} x2={lineX + 4} y2={baseY} stroke="#94a3b8" strokeWidth={0.8} opacity={0.7} />
      <text x={lineX - 8} y={(imgY + baseY) / 2 + 4} textAnchor="end" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        1.7m
      </text>
    </g>
  );
}

function MiniSphere({ cx, cy, r, type, cellSize }) {
  // Use the main color of the sphere, but transparent
  const color = {
    CO2: '#e87c00',
    CH4: '#6ffb24',
    N2O: '#38bdf8',
    SF6: '#c084fc',
  }[type];
  const half = cellSize / 2;
  return (
    <g>
      {/* Transparent background rectangle for the cell, no rounded corners */}
      <rect
        x={cx - half}
        y={cy - half}
        width={cellSize}
        height={cellSize}
        fill={color}
        opacity={0.13}
      />
      {/* The mini sphere itself */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={0}
        fill={`url(#miniSphereGradient_${type})`}
        initial={{ r: 0, opacity: 0 }}
        animate={{ r, opacity: 0.85 }}
      />
    </g>
  );
}

export default function CO2SphereVisualization() {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 860, h: 860 });
  const [rates, setRates] = useState({ perSecond: 0 });

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        // Taller aspect ratio for mobile to accommodate the second row
        const height = width < 600 ? width * 1.7 : width * 1.1 + 120; 
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
      setRates({ perSecond: getAcceleratedTonnesPerSecond(elapsed.totalSeconds) });
    }
    updateRates();
    const interval = setInterval(updateRates, CONFIG.updateInterval || 50);
    return () => clearInterval(interval);
  }, []);

  const { w, h } = dims;
  const isMobile = w < 600;
  
  // Base scale off the CO2 sphere
  const rCO2 = Math.min(w * (isMobile ? 0.25 : 0.22), 180); 
  const rCH4 = rCO2 * GASES.CH4.ratio;
  const rN2O = rCO2 * GASES.N2O.ratio;
  const rSF6 = rCO2 * GASES.SF6.ratio;

  // Responsive Floor Placements
  const floorY1 = isMobile ? h * 0.28 : h * 0.4; 
  const floorY2 = isMobile ? h * 0.52 : floorY1; 

  // Responsive Horizontal Layout
  let cxCO2, cxCH4, cxN2O, cxSF6;

  if (isMobile) {
    cxCO2 = w * 0.55; // Push right slightly to fit human
    const spacing = w * 0.12;
    const totalW = (rCH4 * 2) + spacing + (rN2O * 2) + spacing + (rSF6 * 2);
    const startX = (w - totalW) / 2;
    
    cxCH4 = startX + rCH4;
    cxN2O = cxCH4 + rCH4 + spacing + rN2O;
    cxSF6 = cxN2O + rN2O + spacing + rSF6;
  } else {
    const padding = w * 0.05;
    cxCO2 = w * 0.35;
    cxCH4 = cxCO2 + rCO2 + rCH4 + padding;
    cxN2O = cxCH4 + rCH4 + rN2O + (padding * 0.8);
    cxSF6 = cxN2O + rN2O + rSF6 + (padding * 0.6);
  }

  // Sea setup (starts below the lowest row)
  const seaTop = floorY2 + (isMobile ? 50 : 60);
  const seaH = Math.max(h - seaTop - 70, 80);
  const seaW = w * 0.9;
  const seaLeft = (w - seaW) / 2;
  let miniSpheres = generateMiniSpheres(1340, seaW, seaH);
  // Calculate cellSize for mini spheres (used for background)
  // Reproduce the cellSize logic from generateMiniSpheres
  let cellSize = Math.sqrt((seaW * seaH) / 1340);
  let cols = Math.floor(seaW / cellSize);
  let rows = Math.ceil(1340 / cols);
  while (rows * cellSize > seaH) {
    cellSize -= 0.1;
    cols = Math.floor(seaW / cellSize);
    rows = Math.ceil(1340 / cols);
  }

  return (
    <div className="mb-12 border border-dark-border rounded-xl bg-dark-card overflow-hidden">
      <div className="px-8 pt-8 pb-4">
        <p className="text-[10px] tracking-[0.3em] text-muted-text font-mono mb-1">Scale Visualization</p>
        <h2 className="text-sm md:text-base font-bold tracking-widest font-mono text-slate-200">
          Physical Volume for 1 Metric Tonne of CO₂e
        </h2>
        <p className="text-[11px] text-muted-text font-mono tracking-wide mt-2 leading-relaxed">
          Because potent greenhouse gases trap more heat, a tiny physical amount of Methane (CH₄) or F-Gases (SF₆) exerts the exact same 1-tonne warming impact as a massive sphere of pure CO₂.
        </p>
      </div>

      <div ref={containerRef} className="w-full relative">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" className="block relative" style={{ overflow: 'visible' }}>
          
          <defs>
            {/* Top-level definitions */}
            <radialGradient id="diagonalGlowGradient" cx="20%" cy="20%" r="80%">
              <stop offset="0%" stopColor={GASES.CO2.color} stopOpacity="0.45" />
              <stop offset="60%" stopColor={GASES.CO2.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={GASES.CO2.color} stopOpacity="0" />
            </radialGradient>

            <filter id="sphereGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="specularGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.45" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {Object.entries(GASES).map(([key, gas]) => (
              <g key={key}>
                <radialGradient id={`sphereGradient_${key}`} cx="38%" cy="35%" r="60%" fx="35%" fy="30%">
                  <stop offset="0%" stopColor={gas.highlight} />
                  <stop offset="40%" stopColor={gas.color} />
                  <stop offset="75%" stopColor={gas.dark} />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
                <linearGradient id={`rimGradient_${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gas.highlight} stopOpacity="0.6" />
                  <stop offset="50%" stopColor={gas.color} stopOpacity="0" />
                  <stop offset="100%" stopColor={gas.highlight} stopOpacity="0.3" />
                </linearGradient>
                <radialGradient id={`miniSphereGradient_${key}`} cx="38%" cy="35%" r="60%">
                  <stop offset="0%" stopColor={gas.highlight} />
                  <stop offset="50%" stopColor={gas.color} />
                  <stop offset="100%" stopColor={gas.dark} />
                </radialGradient>
              </g>
            ))}
          </defs>

          {/* Background Ambient Glow */}
          <g>
            <circle 
              cx={cxCO2} 
              cy={floorY1 - rCO2} 
              r={rCO2 * 1.7} 
              fill="url(#diagonalGlowGradient)" 
              filter="url(#sphereGlow)" 
              opacity={0.7} 
            />
          </g>

          {/* Shared Floor Lines */}
          <line x1={w * 0.05} y1={floorY1} x2={w * 0.95} y2={floorY1} stroke="#334155" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
          {isMobile && (
            <line x1={w * 0.05} y1={floorY2} x2={w * 0.95} y2={floorY2} stroke="#334155" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
          )}

          {/* Human Image */}
          <HumanImage x={cxCO2 - rCO2 - (isMobile ? 15 : 20)} baseY={floorY1} scale={rCO2 * 2} />

          {/* CO2 Sphere */}
          <MainSphere cx={cxCO2} cy={floorY1 - rCO2} r={rCO2} gasKey="CO2" />
          <DiameterLine cx={cxCO2} cy={floorY1 - rCO2} r={rCO2} gasKey="CO2" isRightSide={true} />

          {/* CH4 Sphere */}
          <MainSphere cx={cxCH4} cy={floorY2 - rCH4} r={rCH4} gasKey="CH4" />
          <DiameterLine cx={cxCH4} cy={floorY2 - rCH4} r={rCH4} gasKey="CH4" isRightSide={true} />

          {/* N2O Sphere */}
          <MainSphere cx={cxN2O} cy={floorY2 - rN2O} r={rN2O} gasKey="N2O" />
          <DiameterLine cx={cxN2O} cy={floorY2 - rN2O} r={rN2O} gasKey="N2O" isRightSide={true} />

          {/* SF6 Sphere */}
          <MainSphere cx={cxSF6} cy={floorY2 - rSF6} r={rSF6} gasKey="SF6" />
          
          {/* Top of the Sea Label */}
          <text x={w / 2} y={seaTop - 15} textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
            ↓ 1 SECOND OF GLOBAL EMISSIONS ↓
          </text>

          {/* Sea of mini spheres */}
          <g transform={`translate(${seaLeft}, ${seaTop})`}>
            {miniSpheres.map((s) => (
              <MiniSphere key={s.id} cx={s.cx} cy={s.cy} r={s.r} type={s.type} cellSize={cellSize} />
            ))}
          </g>

          <g>
            <text x={w / 2} y={h - 40} textAnchor="middle" fill="#f8fafc" fontSize="15" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
              {`${formatNumber(rates.perSecond, 2)} tonnes CO₂e every second`}
            </text>
          </g>
          <text x={w / 2} y={h - 15} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.15em">
            Each Sphere = 1 tonne of warming impact
          </text>
        </svg>
      </div>
    </div>
  );
}