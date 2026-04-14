import { Html, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CONFIG, getAcceleratedTonnesPerSecond } from '../config';
import { calculateTimeElapsed, formatNumber } from '../utils';

/* ─────────────────────────────────────────────
   Gas Data
   ───────────────────────────────────────────── */
const GASES = [
  {
    key: 'CO2',
    color: '#e87c00',
    highlight: '#fab260',
    dark: '#663c00',
    label: 'Carbon Dioxide',
    formula: 'CO₂',
    mass: '1,000 kg',
    diameter: '10.07 m',
    gwp: 1,
    radius: 5.035, // diameter / 2 in metres (scene units = metres)
  },
  {
    key: 'CH4',
    color: '#6ffb24',
    highlight: '#a3fd8a',
    dark: '#45780f',
    label: 'Methane',
    formula: 'CH₄',
    mass: '35.7 kg',
    diameter: '4.5 m',
    gwp: 28,
    radius: 2.25,
  },
  {
    key: 'N2O',
    color: '#38bdf8',
    highlight: '#bae6fd',
    dark: '#075985',
    label: 'Nitrous Oxide',
    formula: 'N₂O',
    mass: '3.7 kg',
    diameter: '1.5 m',
    gwp: 273,
    radius: 0.75,
  },
  {
    key: 'SF6',
    color: '#c084fc',
    highlight: '#e9d5ff',
    dark: '#4c1d95',
    label: 'Sulfur Hexafluoride',
    formula: 'SF₆',
    mass: '0.04 kg',
    diameter: '0.23 m',
    gwp: 25200,
    radius: 0.115,
  },
];

/* ─────────────────────────────────────────────
   Sphere positions on the ground plane (metres)
   All spheres sit on Y=0 (ground), so centre Y = radius
   ───────────────────────────────────────────── */
function getSpherePositions() {
  const gap = 1.8; // metres between sphere edges
  let x = 0;
  return GASES.map((g) => {
    const pos = [x + g.radius, g.radius, 0];
    x += g.radius * 2 + gap;
    return pos;
  });
}

const SPHERE_POSITIONS = getSpherePositions();

// Human is placed to the left of CO2, centred at x = -humanWidth/2 - gap
const HUMAN_HEIGHT = 1.7; // metres
const HUMAN_X_DEFAULT = -1.2; // left of the CO2 sphere with some space

/* ─────────────────────────────────────────────
   Camera presets
   ───────────────────────────────────────────── */
function getDefaultCamera() {
  // Wide shot: look at the midpoint of all spheres from a raised angle
  // Shift midpoint slightly right to account for human figure on the left
  const lastPos = SPHERE_POSITIONS[SPHERE_POSITIONS.length - 1];
  const sceneLeft = HUMAN_X_DEFAULT - 0.5;
  const sceneRight = lastPos[0] + 1;
  const midX = (sceneLeft + sceneRight) / 2;
  // Pull camera back enough so the full human (1.7m) + CO2 sphere (10m) are framed
  const sceneWidth = sceneRight - sceneLeft;
  const pullback = Math.max(sceneWidth * 0.85, 18);
  return {
    position: new THREE.Vector3(midX, 6, pullback),
    target: new THREE.Vector3(midX, 2.5, 0),
  };
}

function getFocusCamera(index) {
  const [sx, sy] = SPHERE_POSITIONS[index];
  const r = GASES[index].radius;
  // Position camera diagonally down the line so spheres behind are visible
  const dist = Math.max(r * 3.5, 3.5);
  return {
    position: new THREE.Vector3(sx - dist * 0.35, sy + dist * 0.45, dist),
    target: new THREE.Vector3(sx, sy * 0.5, 0),
  };
}

/* ─────────────────────────────────────────────
   Animated Camera Controller
   ───────────────────────────────────────────── */
function CameraController({ cameraState }) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      camera.position.copy(cameraState.position);
      currentPos.current.copy(cameraState.position);
      currentTarget.current.copy(cameraState.target);
      camera.lookAt(cameraState.target);
      initialized.current = true;
    }
  }, []);

  useFrame(() => {
    const lerpFactor = 0.04; // smooth tween speed
    currentPos.current.lerp(cameraState.position, lerpFactor);
    currentTarget.current.lerp(cameraState.target, lerpFactor);
    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

/* ─────────────────────────────────────────────
   GasSphere — solid sphere + wireframe overlay
   ───────────────────────────────────────────── */
function GasSphere({ gas, position, onClick, focused }) {
  const meshRef = useRef();
  const wireRef = useRef();
  const groupRef = useRef();

  const threeColor = useMemo(() => new THREE.Color(gas.color), [gas.color]);
  const highlightColor = useMemo(() => new THREE.Color(gas.highlight), [gas.highlight]);

  // Hover glow state
  const [hovered, setHovered] = useState(false);

  // Wireframe rotation
  useFrame((_, delta) => {
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.04;
      wireRef.current.rotation.x += delta * 0.015;
    }
  });

  // Choose segment detail based on sphere size (small spheres don't need 64 segments)
  const segments = gas.radius > 2 ? 64 : gas.radius > 0.5 ? 32 : 16;
  const wireSegments = gas.radius > 2 ? 24 : gas.radius > 0.5 ? 16 : 10;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Solid inner sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[gas.radius, segments, segments]} />
        <meshStandardMaterial
          color={threeColor}
          roughness={0.35}
          metalness={0.15}
          emissive={threeColor}
          emissiveIntensity={hovered || focused ? 0.35 : 0.08}
        />
      </mesh>

      {/* Wireframe overlay — slightly larger */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[gas.radius * 1.08, wireSegments > 16 ? 3 : 2]} />
        <meshBasicMaterial
          color={highlightColor}
          wireframe
          transparent
          opacity={hovered || focused ? 0.3 : 0.12}
        />
      </mesh>

      {/* Subtle point light on each sphere for bloom feel */}
      <pointLight
        color={gas.color}
        intensity={hovered || focused ? 2 : 0.5}
        distance={gas.radius * 6}
      />
    </group>
  );
}

/* ─────────────────────────────────────────────
   HumanFigure — a textured plane billboard
   ───────────────────────────────────────────── */
function HumanFigure({ targetX }) {
  const groupRef = useRef();
  const posRef = useRef(new THREE.Vector3(HUMAN_X_DEFAULT, HUMAN_HEIGHT / 2, 0));
  const texture = useTexture('/human.png');

  // Aspect ratio: the image is roughly human shaped, taller than wide
  const aspect = 0.45; // width / height approximation
  const planeW = HUMAN_HEIGHT * aspect;
  const planeH = HUMAN_HEIGHT;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = targetX;
    }
  });

  return (
    <group ref={groupRef} position={[HUMAN_X_DEFAULT, HUMAN_HEIGHT / 2, 0]}>
      <mesh>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Height annotation line */}
    </group>
  );
}

/* ─────────────────────────────────────────────
   MeasurementOverlay — vertical dotted line with label
   Renders a 3D measurement line on the right side of a sphere or the human
   ───────────────────────────────────────────── */
function MeasurementOverlay({ position, height, label, color = '#ffffff' }) {
  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  // Build a THREE.Line object imperatively (R3F doesn't have a native <line> element)
  const dashedLine = useMemo(() => {
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, height, 0)];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: threeColor,
      dashSize: Math.max(height * 0.03, 0.04),
      gapSize: Math.max(height * 0.025, 0.03),
      transparent: true,
      opacity: 0.7,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances(); // required for dashes to render
    return line;
  }, [height, threeColor]);

  return (
    <group position={position}>
      {/* Dashed vertical line */}
      <primitive object={dashedLine} />

      {/* Top cap tick */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshBasicMaterial color={threeColor} transparent opacity={0.7} />
      </mesh>

      {/* Bottom cap tick */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshBasicMaterial color={threeColor} transparent opacity={0.7} />
      </mesh>

      {/* Label at centre using Html from drei */}
      <Html
        position={[0.3, height / 2, 0]}
        center
        style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: color,
            textShadow: '0 0 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.8)',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Ground Plane — subtle grid
   ───────────────────────────────────────────── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[80, 40]} />
      <meshStandardMaterial color="#12141c" roughness={0.95} metalness={0} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   GridLines — dashed lines on the floor
   ───────────────────────────────────────────── */
function GridLines() {
  const gridRef = useRef();
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.material.transparent = true;
      gridRef.current.material.opacity = 0.5;
    }
  }, []);
  return (
    <group>
      <gridHelper ref={gridRef} args={[80, 80, '#334155', '#334155']} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   Scene (assembled inside the Canvas)
   ───────────────────────────────────────────── */
function Scene({ focusedIndex, onClickSphere }) {
  const cameraState = useMemo(() => {
    if (focusedIndex === null) return getDefaultCamera();
    return getFocusCamera(focusedIndex);
  }, [focusedIndex]);

  // Determine where the human should stand
  const humanTargetX = useMemo(() => {
    if (focusedIndex === null) return HUMAN_X_DEFAULT;
    const [sx] = SPHERE_POSITIONS[focusedIndex];
    const r = GASES[focusedIndex].radius;
    return sx - r - 1; // stand just to the left of the focused sphere
  }, [focusedIndex]);

  return (
    <>
      <CameraController cameraState={cameraState} />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[15, 20, 10]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, 10, -5]} intensity={0.3} color="#7dd3fc" />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#fbbf24" />

      {/* Ground */}
      <Ground />
      <GridLines />

      {/* Gas Spheres */}
      {GASES.map((gas, i) => (
        <GasSphere
          key={gas.key}
          gas={gas}
          position={SPHERE_POSITIONS[i]}
          onClick={() => onClickSphere(i)}
          focused={focusedIndex === i}
        />
      ))}

      {/* Measurement overlays — shown when a sphere is focused */}
      {focusedIndex !== null && (() => {
        const isSmall = focusedIndex >= 2; // N2O and SF6
        const offset = GASES[focusedIndex].radius + 0.4;
        return (
          <MeasurementOverlay
            position={[
              SPHERE_POSITIONS[focusedIndex][0] + (isSmall ? offset : offset * Math.cos(Math.PI / 5)),
              0,
              isSmall ? 0 : offset * Math.sin(Math.PI / 4),
            ]}
            height={GASES[focusedIndex].radius * 2}
            label={GASES[focusedIndex].diameter}
            color={GASES[focusedIndex].highlight}
          />
        );
      })()}

      {/* Human measurement overlay — shown when focused on any sphere */}
      {focusedIndex !== null && (
        <MeasurementOverlay
          position={[
            (focusedIndex === null ? HUMAN_X_DEFAULT : SPHERE_POSITIONS[focusedIndex][0] - GASES[focusedIndex].radius - 1) + 0.5,
            0,
            0,
          ]}
          height={HUMAN_HEIGHT}
          label="1.7m"
          color="#94a3b8"
        />
      )}

      {/* Human reference figure */}
      <HumanFigure targetX={humanTargetX} />
    </>
  );
}

/* ─────────────────────────────────────────────
   Overlay UI (sits on top of the canvas)
   ───────────────────────────────────────────── */
function InfoCard({ gas }) {
  if (!gas) return null;
  return (
    <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 max-w-[170px] sm:max-w-[220px] md:max-w-xs bg-dark-card/90 backdrop-blur-md border border-dark-border rounded-lg sm:rounded-xl p-2.5 sm:p-4 md:p-5 pointer-events-auto">
      <p className="text-[8px] sm:text-[10px] tracking-[0.3em] text-muted-text font-mono mb-0.5 sm:mb-1 uppercase">{gas.label}</p>
      <h3
        className="text-sm sm:text-lg md:text-xl font-bold font-mono tracking-wide"
        style={{ color: gas.highlight }}
      >
        {gas.mass} {gas.formula}
      </h3>
      <p className="text-[9px] sm:text-[11px] md:text-xs text-slate-400 font-mono mt-0.5 sm:mt-1">Equivalent to: 1 Tonne of Carbon Dioxide (1t CO₂e)</p>
    </div>
  );
}

function NavArrows({ onPrev, onNext, canPrev, canNext }) {
  const btnClass =
    'w-10 h-10 flex items-center justify-center rounded-full bg-dark-card/80 backdrop-blur border border-dark-border text-slate-300 hover:text-white hover:border-slate-500 transition-colors pointer-events-auto';
  return (
    <div className="absolute bottom-8 right-6 flex gap-3 pointer-events-auto">
      <button className={btnClass} onClick={onPrev} disabled={!canPrev} style={{ opacity: canPrev ? 1 : 0.3 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button className={btnClass} onClick={onNext} disabled={!canNext} style={{ opacity: canNext ? 1 : 0.3 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-card/80 backdrop-blur border border-dark-border text-slate-300 hover:text-white hover:border-slate-500 transition-colors pointer-events-auto text-xs font-mono tracking-wide"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      Go Back
    </button>
  );
}

/* ─────────────────────────────────────────────
   Mini-sphere Sea (1 second of global emissions)
   Ported from the original SVG visualization
   ───────────────────────────────────────────── */
const MINI_GAS_COLORS = {
  CO2: { color: '#e87c00', highlight: '#fab260', dark: '#663c00', ratio: 1.0 },
  CH4: { color: '#6ffb24', highlight: '#a3fd8a', dark: '#45780f', ratio: 0.447 },
  N2O: { color: '#38bdf8', highlight: '#bae6fd', dark: '#075985', ratio: 0.149 },
  SF6: { color: '#c084fc', highlight: '#e9d5ff', dark: '#4c1d95', ratio: 0.023 },
};

function generateMiniSpheres(count, width, height) {
  const spheres = [];
  let cellSize = Math.sqrt((width * height) / count);
  let cols = Math.floor(width / cellSize);
  let rows = Math.ceil(count / cols);
  while (rows * cellSize > height) {
    cellSize -= 0.1;
    cols = Math.floor(width / cellSize);
    rows = Math.ceil(count / cols);
  }
  const gap = 1;
  const maxRadius = (cellSize - gap) / 2;
  const actualWidth = cols * cellSize;
  const startX = (width - actualWidth) / 2 + cellSize / 2;
  const startY = cellSize / 2;
  const limitCO2 = count * 0.744;
  const limitCH4 = limitCO2 + count * 0.173;
  const limitN2O = limitCH4 + count * 0.062;
  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    let type = 'CO2';
    if (i >= limitCO2) type = 'CH4';
    if (i >= limitCH4) type = 'N2O';
    if (i >= limitN2O) type = 'SF6';
    const gasRatio = MINI_GAS_COLORS[type].ratio;
    const calculatedRadius = Math.max(maxRadius * gasRatio, 0.8);
    spheres.push({ id: i, cx: startX + c * cellSize, cy: startY + r * cellSize, r: calculatedRadius, type });
  }
  return { spheres, cellSize };
}

function MiniSphere({ cx, cy, r, type, cellSize }) {
  const color = MINI_GAS_COLORS[type].color;
  const half = cellSize / 2;
  return (
    <g>
      <rect x={cx - half} y={cy - half} width={cellSize} height={cellSize} fill={color} opacity={0.13} />
      <motion.circle cx={cx} cy={cy} r={0} fill={`url(#miniGrad_${type})`} initial={{ r: 0, opacity: 0 }} animate={{ r, opacity: 0.85 }} />
    </g>
  );
}

function EmissionsSea() {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 260 });
  const [rates, setRates] = useState({ perSecond: 0 });

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        setDims({ w: width, h: 260 });
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
  const seaW = w * 0.92;
  const seaH = h - 70;
  const seaLeft = (w - seaW) / 2;
  const { spheres: miniSpheres, cellSize } = useMemo(() => generateMiniSpheres(1340, seaW, seaH), [seaW, seaH]);

  return (
    <div ref={containerRef} className="w-full px-4 pb-6 pt-8">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" className="block">
        <defs>
          {Object.entries(MINI_GAS_COLORS).map(([key, gas]) => (
            <radialGradient key={key} id={`miniGrad_${key}`} cx="38%" cy="35%" r="60%">
              <stop offset="0%" stopColor={gas.highlight} />
              <stop offset="50%" stopColor={gas.color} />
              <stop offset="100%" stopColor={gas.dark} />
            </radialGradient>
          ))}
        </defs>
        <text x={w / 2} y={14} textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
          ↓ 1 SECOND OF GLOBAL EMISSIONS ↓
        </text>
        <g transform={`translate(${seaLeft}, 24)`}>
          {miniSpheres.map((s) => (
            <MiniSphere key={s.id} cx={s.cx} cy={s.cy} r={s.r} type={s.type} cellSize={cellSize} />
          ))}
        </g>
        <text x={w / 2} y={h - 22} textAnchor="middle" fill="#f8fafc" fontSize="15" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
          {`${formatNumber(rates.perSecond, 2)} tonnes CO₂e every second`}
        </text>
        <text x={w / 2} y={h - 4} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.15em">
          Each sphere = 1 tonne of CO₂e
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Exported Component
   ───────────────────────────────────────────── */
export default function CO2SphereVisualization3D() {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleClickSphere = useCallback((index) => {
    setFocusedIndex(index);
  }, []);

  const handleBack = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setFocusedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setFocusedIndex((prev) => (prev !== null && prev < GASES.length - 1 ? prev + 1 : prev));
  }, []);

  const focusedGas = focusedIndex !== null ? GASES[focusedIndex] : null;

  return (
    <div className="mb-12 border border-dark-border rounded-xl bg-dark-card overflow-hidden">
      {/* Section header */}
      <div className="px-8 pt-8 pb-4">
        <p className="text-[10px] tracking-[0.3em] text-muted-text font-mono mb-1">3D Scale Visualization</p>
        <h2 className="text-sm md:text-base font-bold tracking-widest font-mono text-slate-200">
          Physical Volume for 1 Metric Tonne of CO₂e
        </h2>
        <p className="text-[11px] text-muted-text font-mono tracking-wide mt-2 leading-relaxed max-w-2xl">
          Click any sphere to inspect it. A tiny physical amount of Methane (CH₄) or F-Gases (SF₆) exerts the same 1-tonne warming impact as a massive sphere of pure CO₂.
        </p>
      </div>

      {/* 3D Canvas + overlay wrapper */}
      <div className="relative w-full" style={{ height: 'clamp(420px, 55vw, 700px)' }}>
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 200 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor('#12141c');
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
        >
          <Scene focusedIndex={focusedIndex} onClickSphere={handleClickSphere} />
        </Canvas>

        {/* Overlay UI — pointer-events-none on wrapper, pointer-events-auto on interactive children */}
        <div className="absolute inset-0 pointer-events-none">
          {focusedIndex !== null && (
            <>
              <BackButton onClick={handleBack} />
              <InfoCard gas={focusedGas} />
              <NavArrows
                onPrev={handlePrev}
                onNext={handleNext}
                canPrev={focusedIndex > 0}
                canNext={focusedIndex < GASES.length - 1}
              />
            </>
          )}
        </div>

      </div>

      {/* 1-second emissions sea */}
      <EmissionsSea />
    </div>
  );
}
