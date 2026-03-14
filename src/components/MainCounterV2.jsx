import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AVG_CO2_PER_KM2,
  CONFIG,
  CRITICAL_BUDGET_THRESHOLD_15C,
  CRITICAL_BUDGET_THRESHOLD_20C,
  INITIAL_BUDGET_15C,
  INITIAL_BUDGET_20C,
  KM2_PER_SECOND,
  SECONDS_PER_YEAR,
  TONNES_PER_SECOND,
} from '../config.js';
import { calculateTimeElapsed, formatNumber, padZero } from '../utils';
import BudgetDepletionBar from './BudgetDepletionBar';

const VIEWS = {
  BUDGET_20C: 'budget-2.0c',
  BUDGET_15C_OVERSHOOT: 'budget-1.5c-overshoot',
  TOTAL_EMISSIONS_SPEND: 'total-emissions-spend',
  FOREST_LOSS: 'forest-loss',
};

const COUNTER_START_DATE = CONFIG.startDate;
const COUNTER_INTERVAL_MS = CONFIG.updateInterval;

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const BREACH_DATE_15C = new Date('2024-01-01T00:00:00Z');

export default function MainCounter() {
  const [activeView, setActiveView] = useState(VIEWS.BUDGET_20C);
  const [menuOpen, setMenuOpen] = useState(false);

  const [emissionsSpend, setEmissionsSpend] = useState(0);
  const [budget15Remaining, setBudget15Remaining] = useState(INITIAL_BUDGET_15C);
  const [budget20Remaining, setBudget20Remaining] = useState(INITIAL_BUDGET_20C);
  const [hectaresBurned, setHectaresBurned] = useState(0);
  const [carbonReleased, setCarbonReleased] = useState(0);
  const [currentAnomaly, setCurrentAnomaly] = useState(CONFIG.currentAnomaly);
  const [overshootEmissions, setOvershootEmissions] = useState(0);

  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [budgetCountdown15, setBudgetCountdown15] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [budgetCountdown20, setBudgetCountdown20] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [depletionDate15, setDepletionDate15] = useState(null);
  const [depletionDate20, setDepletionDate20] = useState(null);
  const [yearsRemaining15, setYearsRemaining15] = useState(0);
  const [yearsRemaining20, setYearsRemaining20] = useState(0);
  const [breachElapsed, setBreachElapsed] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [videoOpacity, setVideoOpacity] = useState(0);
  const [videoOpacity2, setVideoOpacity2] = useState(0);
  const videoRef = useRef(null);
  const videoRef2 = useRef(null);
  const menuRef = useRef(null);

  // Core computation loop
  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();
      const elapsed = calculateTimeElapsed(COUNTER_START_DATE);

      // Emissions
      const spent = elapsed.totalSeconds * TONNES_PER_SECOND;
      const remaining15 = Math.max(INITIAL_BUDGET_15C - spent, 0);
      const remaining20 = Math.max(INITIAL_BUDGET_20C - spent, 0);
      setEmissionsSpend(spent);
      setBudget15Remaining(remaining15);
      setBudget20Remaining(remaining20);
      setTimeElapsed(elapsed);

      // 1.5°C countdown
      const secsLeft15 = remaining15 / TONNES_PER_SECOND;
      setBudgetCountdown15(secsToCountdown(secsLeft15));
      setYearsRemaining15(secsLeft15 / SECONDS_PER_YEAR);
      setDepletionDate15(new Date(now.getTime() + secsLeft15 * 1000));

      // 2.0°C countdown
      const secsLeft20 = remaining20 / TONNES_PER_SECOND;
      setBudgetCountdown20(secsToCountdown(secsLeft20));
      setYearsRemaining20(secsLeft20 / SECONDS_PER_YEAR);
      setDepletionDate20(new Date(now.getTime() + secsLeft20 * 1000));

      // Temperature anomaly (extrapolated from 2024 record)
      const yearsSince2024 = (now - new Date('2024-01-01T00:00:00Z')) / (SECONDS_PER_YEAR * 1000);
      setCurrentAnomaly(CONFIG.currentAnomaly + (yearsSince2024 * CONFIG.warmingRatePerYear));

      // 1.5°C breach elapsed (since Jan 1, 2024)
      const breachSecs = (now - BREACH_DATE_15C) / 1000;
      setBreachElapsed(secsToCountdown(Math.max(breachSecs, 0)));
      setOvershootEmissions(Math.max(breachSecs, 0) * TONNES_PER_SECOND);

      // Wildfire
      const burned = elapsed.totalSeconds * KM2_PER_SECOND;
      setHectaresBurned(burned);
      setCarbonReleased((burned * AVG_CO2_PER_KM2));
    };

    updateCounter();
    const interval = setInterval(updateCounter, COUNTER_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isFireView = activeView === VIEWS.FOREST_LOSS;
  const is20C = activeView === VIEWS.BUDGET_20C;
  const is15Overshoot = activeView === VIEWS.BUDGET_15C_OVERSHOOT;
  const isCountdown = is20C;
  const showBar = is20C;
  const videoSrc = isFireView ? '/fire.mp4' : '/smoke.mp4';
  const maxOpacity = isFireView ? 0.15 : 0.3;

  // Video 1 fade
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});

    const onTime = () => {
      const rem = video.duration - video.currentTime;
      if (rem <= 4) setVideoOpacity(maxOpacity * (rem / 4));
      else if (video.currentTime <= 4) setVideoOpacity(maxOpacity * (video.currentTime / 4));
      else setVideoOpacity(maxOpacity);
    };
    const onEnd = () => { setVideoOpacity(0); video.currentTime = 0; video.play().catch(() => {}); };

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('ended', onEnd);
    return () => { video.removeEventListener('timeupdate', onTime); video.removeEventListener('ended', onEnd); };
  }, [activeView, maxOpacity]);

  // Video 2 fade (offset by half)
  useEffect(() => {
    const video = videoRef2.current;
    const video1 = videoRef.current;
    if (!video || !video1) return;
    video.load();

    const startOffset = () => {
      if (video1.duration) { video.currentTime = video1.duration / 2; video.play().catch(() => {}); }
    };
    if (video1.readyState >= 1) startOffset();
    else video1.addEventListener('loadedmetadata', startOffset, { once: true });

    const onTime = () => {
      const rem = video.duration - video.currentTime;
      if (rem <= 4) setVideoOpacity2(maxOpacity * (rem / 4));
      else if (video.currentTime <= 4) setVideoOpacity2(maxOpacity * (video.currentTime / 4));
      else setVideoOpacity2(maxOpacity);
    };
    const onEnd = () => { setVideoOpacity2(0); video.currentTime = 0; video.play().catch(() => {}); };

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('ended', onEnd);
    return () => { video.removeEventListener('timeupdate', onTime); video.removeEventListener('ended', onEnd); };
  }, [activeView, maxOpacity]);

  // View-specific values
  const budgetRemaining = is20C ? budget20Remaining : budget15Remaining;
  const budgetCountdown = is20C ? budgetCountdown20 : budgetCountdown15;
  const depletionDate = is20C ? depletionDate20 : depletionDate15;
  const yearsRemaining = is20C ? yearsRemaining20 : yearsRemaining15;
  const initialBudget = is20C ? INITIAL_BUDGET_20C : INITIAL_BUDGET_15C;
  const criticalThreshold = is20C ? CRITICAL_BUDGET_THRESHOLD_20C : CRITICAL_BUDGET_THRESHOLD_15C;

  const currentValue =
    is20C ? budget20Remaining
    : is15Overshoot ? overshootEmissions
    : activeView === VIEWS.TOTAL_EMISSIONS_SPEND ? emissionsSpend
    : hectaresBurned;

  const tickerTheme = getTickerTheme(activeView, budgetRemaining, criticalThreshold);

  const currentHeader =
    is20C ? 'EST. GLOBAL EMISSIONS BUDGET TO STAY BELOW 2.0ºC'
    : is15Overshoot ? 'EST. GLOBAL EMISSIONS OVERSHOOT ABOVE 1.5ºC'
    : isFireView ? 'EST. GLOBAL WILDFIRE LOSS'
    : 'EST. GLOBAL EMISSIONS';

  const currentSubLabel =
    is20C ? 'METRIC TONNES OF CO₂e REMAINING'
    : is15Overshoot ? 'METRIC TONNES OF CO₂e OVERSHOOT'
    : isFireView ? 'SQUARE KILOMETERS BURNED YTD'
    : 'METRIC TONNES CO₂e EMITTED YTD';

  const cards = buildCards(activeView, depletionDate, depletionDate15, yearsRemaining, yearsRemaining15, budgetRemaining, budget15Remaining, carbonReleased, currentAnomaly, initialBudget, criticalThreshold);

  return (
    <section className="mb-10">
      <div
        className={`relative border ${isFireView ? '' : 'border-dark-border'} rounded-lg bg-dark-slate p-8 md:p-12 ${showBar ? 'pb-10 md:pb-14' : 'pb-8 md:pb-12'} overflow-hidden`}
        style={isFireView ? { borderColor: '#FF4D00', boxShadow: '0 0 30px rgba(255, 77, 0, 0.15)' } : undefined}
      >
        {/* Background Video 1 */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          style={{
            opacity: videoOpacity,
            ...(isFireView ? { mixBlendMode: 'screen' } : {}),
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Background Video 2 (offset) */}
        <video
          ref={videoRef2}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          style={{
            opacity: videoOpacity2,
            ...(isFireView ? { mixBlendMode: 'screen' } : {}),
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Dropdown menu */}
        <div className="absolute top-4 right-4 z-20" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open counter view menu"
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center rounded-md border border-dark-border bg-slate-900/50 px-3 py-2 text-muted-text transition-colors hover:bg-slate-800 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-72 rounded-md border border-dark-border bg-dark-card/95 p-2 backdrop-blur"
              >
                <ViewOption label="2.0°C BUDGET REMAINING" isActive={activeView === VIEWS.BUDGET_20C} onClick={() => { setActiveView(VIEWS.BUDGET_20C); setMenuOpen(false); }} />
                <ViewOption label="1.5°C BUDGET OVERSHOOT" isActive={activeView === VIEWS.BUDGET_15C_OVERSHOOT} onClick={() => { setActiveView(VIEWS.BUDGET_15C_OVERSHOOT); setMenuOpen(false); }} />
                <ViewOption label="GLOBAL EMISSIONS YTD" isActive={activeView === VIEWS.TOTAL_EMISSIONS_SPEND} onClick={() => { setActiveView(VIEWS.TOTAL_EMISSIONS_SPEND); setMenuOpen(false); }} />
                <ViewOption label="WILDFIRE LOSS" isActive={activeView === VIEWS.FOREST_LOSS} onClick={() => { setActiveView(VIEWS.FOREST_LOSS); setMenuOpen(false); }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main content */}
        <div className="text-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <p className="text-xs tracking-[0.3em] text-muted-text mb-4">{currentHeader}</p>

              <div
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-1 tabular-nums"
                style={{ color: tickerTheme.color, textShadow: tickerTheme.textShadow }}
              >
                {formatNumber(Math.floor(currentValue), 0)}
              </div>
              <p
                className="text-sm tracking-[0.2em] mb-4"
                style={{ color: tickerTheme.color, textShadow: tickerTheme.textShadow }}
              >
                {currentSubLabel}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Timer / Countdown */}
          <AnimatePresence mode="wait">
            <motion.div
              key={is20C ? 'countdown' : is15Overshoot ? 'breach' : 'elapsed'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {is20C ? (
                <div>
                  <p className="text-xs tracking-[0.2em] text-muted-text mb-2">TIME REMAINING UNTIL BUDGET DEPLETION</p>
                  <div className="flex justify-center items-center gap-1 md:gap-2 text-xl md:text-3xl font-semibold">
                    <TimeUnit value={budgetCountdown.years} label="YRS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={budgetCountdown.days} label="DAYS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={budgetCountdown.hours} label="HRS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={budgetCountdown.minutes} label="MIN" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={budgetCountdown.seconds} label="SEC" />
                  </div>
                </div>
              ) : is15Overshoot ? (
                <div>
                  <p className="text-xs tracking-[0.2em] text-muted-text mb-2">TIME ELAPSED SINCE 1.5°C THRESHOLD BREACH</p>
                  <div className="flex justify-center items-center gap-1 md:gap-2 text-xl md:text-3xl font-semibold">
                    <TimeUnit value={breachElapsed.years} label="YRS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={breachElapsed.days} label="DAYS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={breachElapsed.hours} label="HRS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={breachElapsed.minutes} label="MIN" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={breachElapsed.seconds} label="SEC" />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs tracking-[0.2em] text-muted-text mb-2">TIME ELAPSED SINCE JAN 1, 2026</p>
                  <div className="flex justify-center items-center gap-2 text-2xl md:text-3xl font-semibold">
                    <TimeUnit value={timeElapsed.days} label="DAYS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={timeElapsed.hours} label="HRS" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={timeElapsed.minutes} label="MIN" />
                    <span className="text-muted-text">:</span>
                    <TimeUnit value={timeElapsed.seconds} label="SEC" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Budget Depletion Bar */}
        {showBar && (
          <BudgetDepletionBar budgetRemaining={budgetRemaining} initialBudget={initialBudget} criticalThreshold={criticalThreshold} />
        )}
      </div>

      {/* Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <AnimatePresence mode="popLayout">
          {cards.map((card, idx) => (
            <motion.div
              key={`${activeView}-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, delay: idx * 0.06 }}
              className="border border-dark-border rounded-lg bg-dark-card p-6 text-center"
            >
              <p className="text-xs tracking-[0.3em] text-muted-text mb-3">{card.label}</p>
              <p
                className="text-2xl md:text-3xl font-bold tabular-nums"
                style={{ color: card.color, textShadow: card.glow }}
              >
                {card.value}
              </p>
              <p className="text-xs text-muted-text mt-2">{card.unit}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

function secsToCountdown(totalSecs) {
  const yrs = Math.floor(totalSecs / SECONDS_PER_YEAR);
  const afterYrs = totalSecs - yrs * SECONDS_PER_YEAR;
  const dys = Math.floor(afterYrs / 86400);
  const afterDys = afterYrs - dys * 86400;
  const hrs = Math.floor(afterDys / 3600);
  const afterHrs = afterDys - hrs * 3600;
  const mns = Math.floor(afterHrs / 60);
  const scs = Math.floor(afterHrs - mns * 60);
  return { years: yrs, days: dys, hours: hrs, minutes: mns, seconds: scs };
}

function buildCards(activeView, depletionDate, depletionDate15, yearsRemaining, yearsRemaining15, budgetRemaining, budget15Remaining, carbonReleased, currentAnomaly, initialBudget, criticalThreshold) {
  const orangeGlow = '0 0 20px rgba(255, 159, 67, 0.5), 0 0 40px rgba(255, 159, 67, 0.3)';
  const blueGlow = '0 0 20px rgba(0, 210, 252, 0.5), 0 0 40px rgba(0, 210, 252, 0.3)';
  const fireGlow = '0 0 20px rgba(255, 77, 0, 0.5), 0 0 40px rgba(255, 77, 0, 0.3)';
  const redGlow = '0 0 20px rgba(185, 28, 28, 0.5), 0 0 40px rgba(185, 28, 28, 0.3)';

  if (activeView === VIEWS.TOTAL_EMISSIONS_SPEND) {
    const perSec = TONNES_PER_SECOND;
    return [
      { label: 'PER SECOND', value: formatNumber(perSec, 2), unit: 'tonnes CO₂e', color: '#00D2FC', glow: blueGlow },
      { label: 'PER MINUTE', value: formatNumber(perSec * 60, 2), unit: 'tonnes CO₂e', color: '#00D2FC', glow: blueGlow },
      { label: 'PER DAY', value: formatNumber(perSec * 86400, 0), unit: 'tonnes CO₂e', color: '#00D2FC', glow: blueGlow },
    ];
  }

  if (activeView === VIEWS.BUDGET_20C) {
    const remaining = (budgetRemaining / initialBudget) * 100;
    const dateStr = depletionDate
      ? `${MONTH_NAMES[depletionDate.getMonth()]} ${depletionDate.getFullYear()}`
      : '...';
    const isCritical = budgetRemaining < criticalThreshold;
    const color = isCritical ? '#B91C1C' : '#FF9F43';
    const glow = isCritical ? redGlow : orangeGlow;
    return [
      { label: 'EST. DEPLETION DATE', value: dateStr, unit: '2.0°C budget exhausted', color, glow },
      { label: 'PER DAY', value: formatNumber(Math.round(TONNES_PER_SECOND * 86400), 0), unit: 'tonnes CO₂e', color, glow },
      { label: 'STOCKPILE REMAINING', value: `${remaining.toFixed(1)}%`, unit: `of ${formatNumber(initialBudget, 0)} tonnes CO₂e`, color, glow },
    ];
  }

  if (activeView === VIEWS.BUDGET_15C_OVERSHOOT) {
    return [
      { label: 'BREACH CONFIRMED', value: 'JAN 2024', unit: 'WMO confirmed +1.55°C annual mean', color: '#B91C1C', glow: redGlow },
      { label: 'CURRENT ANOMALY', value: `+${currentAnomaly.toFixed(2)}°C`, unit: 'above pre-industrial', color: '#B91C1C', glow: redGlow },
      { label: 'STOCKPILE REMAINING', value: '0.0%', unit: 'EXHAUSTED', color: '#B91C1C', glow: redGlow },
    ];
  }

  // Forest loss
  return [
    { label: 'PER HOUR', value: formatNumber(Math.round(KM2_PER_SECOND * 3600)), unit: 'square kilometers', color: '#FF4D00', glow: fireGlow },
    { label: 'CARBON RELEASED', value: formatNumber(Math.round(carbonReleased), 0), unit: 'tonnes CO₂e', color: '#FF4D00', glow: fireGlow },
    { label: 'AVERAGE', value: AVG_CO2_PER_KM2, unit: 'tonnes CO₂e / km²', color: '#FF4D00', glow: fireGlow },
  ];
}

function ViewOption({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded px-3 py-2 text-left text-xs tracking-[0.16em] transition-colors ${
        isActive ? 'bg-slate-800 text-white' : 'text-muted-text hover:bg-slate-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function getTickerTheme(activeView, budgetRemaining, criticalThreshold) {
  if (activeView === VIEWS.BUDGET_20C) {
    const isCritical = budgetRemaining < criticalThreshold;
    const color = isCritical ? '#B91C1C' : '#FF9F43';
    return {
      color,
      textShadow: isCritical
        ? '0 0 20px rgba(185, 28, 28, 0.5), 0 0 40px rgba(185, 28, 28, 0.3)'
        : '0 0 20px rgba(255, 159, 67, 0.5), 0 0 40px rgba(255, 159, 67, 0.3)',
    };
  }

  if (activeView === VIEWS.BUDGET_15C_OVERSHOOT) {
    return {
      color: '#B91C1C',
      textShadow: '0 0 20px rgba(185, 28, 28, 0.5), 0 0 40px rgba(185, 28, 28, 0.3)',
    };
  }

  if (activeView === VIEWS.TOTAL_EMISSIONS_SPEND) {
    return {
      color: '#00D2FC',
      textShadow: '0 0 20px rgba(0, 210, 252, 0.5), 0 0 40px rgba(0, 210, 252, 0.3)',
    };
  }

  return {
    color: '#FF4D00',
    textShadow: '0 0 20px rgba(255, 77, 0, 0.5), 0 0 40px rgba(255, 77, 0, 0.3)',
  };
}

function TimeUnit({ value, label }) {
  return (
    <div className="bg-dark-slate border border-dark-border rounded px-3 py-2">
      <span className="text-white tabular-nums">{padZero(value)}</span>
      <span className="text-xs text-muted-text block">{label}</span>
    </div>
  );
}
