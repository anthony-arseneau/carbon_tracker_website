import { useEffect, useState } from 'react';

// Constants based on WHO/IPCC health impact models
const MORTALITY_FACTOR_PER_AQI_POINT = 0.000046;

function calculateEstimatedDeaths(population, aqi) {
  // Deaths increase with 1.5x multiplier when AQI exceeds 100
  let riskMultiplier = aqi > 100 ? 1.5 : 1.0;
  return Math.floor(population * (aqi * MORTALITY_FACTOR_PER_AQI_POINT) * riskMultiplier);
}

// AQI color thresholds based on health scale
function getAqiColor(aqi) {
  if (aqi <= 33) return '#0055FF';      // Very Good - Blue
  if (aqi <= 66) return '#22C55E';      // Good - Green
  if (aqi <= 99) return '#EAB308';      // Fair - Yellow
  if (aqi <= 149) return '#F97316';     // Poor - Orange
  if (aqi <= 200) return '#800080';     // Very Poor - Deep Purple
  return '#B91C1C';                      // Hazardous - Strong Red
}

// Deaths color: Neon Red (#FF4757) if over 1000, otherwise green
function getDeathsColor(deaths) {
  if (deaths > 1000) return '#FF4757';  // Neon Red for high death counts
  return '#22C55E';                      // Green for low counts
}

// Get glow shadow based on AQI color
function getAqiGlow(aqi) {
  const color = getAqiColor(aqi);
  return `0 0 15px ${color}40, 0 0 30px ${color}20`;
}

// Person icon component for scale visualization
const PersonIcon = ({ color }) => (
  <svg className="w-3 h-3" fill={color} viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4" />
    <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
  </svg>
);

// Icon components
const LungIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
  </svg>
);

// Tier 1 Metropolis: High-density cluster of 5+ skyscrapers
const MetropolisIcon = ({ color = '#BB86FC' }) => (
  <svg className="w-8 h-8" fill="none" stroke={color} viewBox="0 0 24 24">
    {/* Tallest center tower */}
    <rect x="10" y="2" width="4" height="19" rx="0.5" strokeWidth={1.5} />
    <line x1="11" y1="5" x2="13" y2="5" strokeWidth={1} />
    <line x1="11" y1="8" x2="13" y2="8" strokeWidth={1} />
    <line x1="11" y1="11" x2="13" y2="11" strokeWidth={1} />
    <line x1="11" y1="14" x2="13" y2="14" strokeWidth={1} />
    <line x1="11" y1="17" x2="13" y2="17" strokeWidth={1} />
    {/* Left tall tower */}
    <rect x="5" y="6" width="3" height="15" rx="0.5" strokeWidth={1.5} />
    <line x1="5.5" y1="9" x2="7.5" y2="9" strokeWidth={1} />
    <line x1="5.5" y1="12" x2="7.5" y2="12" strokeWidth={1} />
    <line x1="5.5" y1="15" x2="7.5" y2="15" strokeWidth={1} />
    {/* Right tall tower */}
    <rect x="16" y="5" width="3" height="16" rx="0.5" strokeWidth={1.5} />
    <line x1="16.5" y1="8" x2="18.5" y2="8" strokeWidth={1} />
    <line x1="16.5" y1="11" x2="18.5" y2="11" strokeWidth={1} />
    <line x1="16.5" y1="14" x2="18.5" y2="14" strokeWidth={1} />
    {/* Far left smaller tower */}
    <rect x="1" y="10" width="2.5" height="11" rx="0.5" strokeWidth={1.5} />
    {/* Far right smaller tower */}
    <rect x="20.5" y="9" width="2.5" height="12" rx="0.5" strokeWidth={1.5} />
    {/* Ground line */}
    <line x1="0" y1="21" x2="24" y2="21" strokeWidth={1.5} />
  </svg>
);

// Industrial Corridor: Factory with 2 chimneys and a gear
const IndustrialIcon = ({ color = '#BB86FC' }) => (
  <svg className="w-8 h-8" fill="none" stroke={color} viewBox="0 0 24 24">
    {/* Factory building */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 21h20M4 21V13h6v8M10 21V9l5 4v8M15 21V13h5v8" />
    {/* Chimney 1 */}
    <rect x="5" y="7" width="2" height="6" strokeWidth={1.5} />
    {/* Chimney 2 */}
    <rect x="17" y="5" width="2" height="8" strokeWidth={1.5} />
    {/* Smoke from chimneys */}
    <path strokeLinecap="round" strokeWidth={1} d="M6 7c0-1 0.5-2 0-3M6 4c0.5-1 0-2 0.5-3" />
    <path strokeLinecap="round" strokeWidth={1} d="M18 5c0-1 0.5-2 0-3M18 2c0.5-1 0-2 0.5-2.5" />
    {/* Gear */}
    <circle cx="12" cy="17" r="2" strokeWidth={1.5} />
    <path strokeWidth={1} d="M12 14v-0.5M12 19.5v0.5M9.5 17h-0.5M14.5 17h0.5M10.2 15.2l-0.4-0.4M13.8 18.8l0.4 0.4M10.2 18.8l-0.4 0.4M13.8 15.2l0.4-0.4" />
  </svg>
);

// Regional Urban Center: Small cluster of 3 low-rise buildings
const RegionalIcon = ({ color = '#BB86FC' }) => (
  <svg className="w-8 h-8" fill="none" stroke={color} viewBox="0 0 24 24">
    {/* Left building */}
    <rect x="2" y="12" width="5" height="9" rx="0.5" strokeWidth={1.5} />
    <line x1="3" y1="14" x2="6" y2="14" strokeWidth={1} />
    <line x1="3" y1="17" x2="6" y2="17" strokeWidth={1} />
    {/* Center building (slightly taller) */}
    <rect x="9" y="9" width="6" height="12" rx="0.5" strokeWidth={1.5} />
    <rect x="10.5" y="11" width="1.5" height="2" strokeWidth={1} />
    <rect x="13" y="11" width="1.5" height="2" strokeWidth={1} />
    <rect x="10.5" y="15" width="1.5" height="2" strokeWidth={1} />
    <rect x="13" y="15" width="1.5" height="2" strokeWidth={1} />
    {/* Door */}
    <rect x="11" y="18" width="2" height="3" strokeWidth={1} />
    {/* Right building */}
    <rect x="17" y="13" width="5" height="8" rx="0.5" strokeWidth={1.5} />
    <line x1="18" y1="15" x2="21" y2="15" strokeWidth={1} />
    <line x1="18" y1="18" x2="21" y2="18" strokeWidth={1} />
    {/* Ground line */}
    <line x1="0" y1="21" x2="24" y2="21" strokeWidth={1.5} />
  </svg>
);

// AQI Scale Component - 6-tier health scale
function AQIScale({ currentAqi = 58 }) {
  const segments = [
    { range: '0-33', label: 'V. GOOD', color: '#0055FF' },
    { range: '34-66', label: 'GOOD', color: '#22C55E' },
    { range: '67-99', label: 'FAIR', color: '#EAB308' },
    { range: '100-149', label: 'POOR', color: '#F97316' },
    { range: '150-200', label: 'V. POOR', color: '#800080' },
    { range: '201+', label: 'HAZARDOUS', color: '#B91C1C' },
  ];

  // Calculate arrow position: 58 should sit in the GOOD segment (34-66)
  // Scale: 0-250 mapped to 0-100%
  // 58 is in segment 2 (34-66), which spans from ~13.6% to ~26.4% of 250
  const arrowPosition = Math.min((currentAqi / 250) * 100, 100);

  return (
    <div className="mb-8">
      <p className="text-xs tracking-[0.2em] text-muted-text mb-3 text-center">AQI THREAT SPECTRUM</p>
      
      {/* Scale bar */}
      <div className="relative pt-2 pb-8">
        {/* The scale bar - 6 segments */}
        <div className="flex h-3 rounded-full overflow-hidden border border-dark-border">
          <div className="flex-1" style={{ backgroundColor: '#0055FF' }} />
          <div className="flex-1" style={{ backgroundColor: '#22C55E' }} />
          <div className="flex-1" style={{ backgroundColor: '#EAB308' }} />
          <div className="flex-1" style={{ backgroundColor: '#F97316' }} />
          <div className="flex-1" style={{ backgroundColor: '#800080' }} />
          <div className="flex-1" style={{ backgroundColor: '#B91C1C' }} />
        </div>
        
        {/* Triangle indicator below scale bar pointing up */}
        <div 
          className="absolute transform -translate-x-1/2 flex flex-col items-center z-10"
          style={{ left: `${arrowPosition}%`, top: '14px' }}
        >
          <svg className="w-4 h-4" style={{ color: '#22C55E' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8l-6 6h12l-6-6z" />
          </svg>
          <span className="text-[10px] font-bold" style={{ color: '#22C55E' }}>{currentAqi}</span>
          <span className="text-[8px] tracking-wider text-muted-text">WORLD AVG</span>
        </div>
        
        {/* Labels below */}
        <div className="flex mt-2">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex-1 text-center">
              <p className="text-[9px] text-muted-text">{seg.range}</p>
              <p className="text-[8px] font-semibold" style={{ color: seg.color }}>{seg.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AirQuality() {
  const [tickerOffset, setTickerOffset] = useState(0);
  
  // Animated ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => prev - 0.5);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const urbanTiers = [
    {
      icon: (color) => <RegionalIcon color={color} />,
      tier: 'REGIONAL URBAN CENTER',
      population: 500000,
      avgAqi: 45,
      deaths: calculateEstimatedDeaths(500000, 45),
      personCount: 2, // Base scale
    },
    {
      icon: (color) => <IndustrialIcon color={color} />,
      tier: 'INDUSTRIAL CORRIDOR',
      population: 2500000,
      avgAqi: 120,
      deaths: calculateEstimatedDeaths(2500000, 120),
      personCount: 10, // 5x regional
    },
    {
      icon: (color) => <MetropolisIcon color={color} />,
      tier: 'TIER 1 METROPOLIS',
      population: 10000000,
      avgAqi: 180,
      deaths: calculateEstimatedDeaths(10000000, 180),
      personCount: 40, // 20x regional
    },
  ];

  return (
    <section className="mb-12 relative">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        ATMOSPHERIC INTEGRITY & PUBLIC HEALTH
      </h2>
      
      {/* Mortality Correlation Tickers */}
      <div className="border border-dark-border rounded-lg bg-dark-card p-3 mb-6 overflow-hidden">
        <div 
          className="flex gap-8 whitespace-nowrap text-xs tracking-wider"
          style={{ transform: `translateX(${tickerOffset}px)` }}
        >
          {[...Array(3)].map((_, repeat) => (
            <div key={repeat} className="flex gap-8">
              <span className="text-neon-violet">
                <span className="text-muted-text">LIVE CORRELATION: POPULATION DENSITY ↔ PM2.5 CONCENTRATION:</span>{' '}
                <span className="font-bold">+0.84 (STRONG POSITIVE)</span>
              </span>
              <span className="text-muted-text">●</span>
              <span className="text-neon-violet">
                <span className="text-muted-text">GLOBAL AVG AQI:</span>{' '}
                <span className="font-bold">58 (MODERATE)</span>
              </span>
              <span className="text-muted-text">●</span>
              <span className="text-neon-violet">
                <span className="text-muted-text">TOTAL SETTLEMENTS MONITORED:</span>{' '}
                <span className="font-bold">12,400+</span>
              </span>
              <span className="text-muted-text">●</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content Box */}
      <div className="border border-dark-border rounded-lg bg-dark-card p-6 glow-violet relative overflow-hidden">
        {/* Subtle haze gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/5 via-transparent to-neon-violet/3 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-neon-violet mb-6">
            <LungIcon />
            <span className="text-sm tracking-[0.2em] font-semibold">AIR QUALITY MORTALITY INDEX</span>
          </div>
          
          {/* AQI Threat Spectrum */}
          <AQIScale currentAqi={58} />
          
          {/* Urban Scale Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {urbanTiers.map((tier, index) => {
              const aqiColor = getAqiColor(tier.avgAqi);
              const deathColor = getDeathsColor(tier.deaths);
              const deathGlow = tier.deaths > 1000 ? '0 0 10px rgba(255, 71, 87, 0.5)' : 'none';
              
              return (
                <div 
                  key={index}
                  className="relative rounded-lg p-5 text-center overflow-hidden group transition-all"
                  style={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: `1px solid ${aqiColor}`,
                    boxShadow: getAqiGlow(tier.avgAqi)
                  }}
                >
                  <div className="relative z-10">
                    <div 
                      className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${aqiColor}15`,
                        border: `1px solid ${aqiColor}40`
                      }}
                    >
                      {tier.icon(aqiColor)}
                    </div>
                    
                    <p className="text-xs tracking-[0.15em] font-semibold mb-2" style={{ color: aqiColor }}>
                      {tier.tier}
                    </p>
                    
                    {/* Person icons for scale visualization - fixed height container for alignment */}
                    <div className="h-[72px] flex items-center justify-center mb-4">
                      <div className="flex justify-center gap-0.5 flex-wrap max-w-[140px]">
                        {[...Array(tier.personCount)].map((_, i) => (
                          <PersonIcon key={i} color={aqiColor} />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-text">POPULATION</span>
                        <span className="text-white font-medium">{tier.population.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-text">AVG. AQI</span>
                        <span className="font-semibold" style={{ color: aqiColor }}>
                          {tier.avgAqi}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-dark-border">
                      <p className="text-[10px] tracking-wider text-muted-text mb-1">EST. ANNUAL DEATHS</p>
                      <p 
                        className="text-2xl font-bold" 
                        style={{ 
                          color: deathColor,
                          textShadow: deathGlow
                        }}
                      >
                        {tier.deaths.toLocaleString()}+
                      </p>
                    </div>
                    
                    <p className="text-[9px] text-muted-text mt-3 font-mono">
                      CALCULATED RISK: Pop × AQI Factor
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Methodology Box */}
          <div className="border border-dark-border rounded-lg bg-dark-slate/50 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-neon-violet text-xs tracking-[0.2em] font-semibold">METHODOLOGY</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-white">
                <span className="text-neon-violet font-semibold">Mortality Coefficient:</span>{' '}
                The calculation uses a theoretical coefficient of{' '}
                <span className="font-mono text-neon-violet">0.000046</span> deaths per capita per AQI point,
                with a <span className="font-semibold text-neon-orange">1.5× risk multiplier</span> when AQI exceeds 100.
              </p>
              <p className="text-muted-text text-xs">
                <span className="text-neon-cyan">Scientific Grounding:</span> Based on{' '}
                <a href="#" className="text-neon-cyan hover:underline">WHO Global Air Quality Guidelines</a> and{' '}
                <a href="#" className="text-neon-cyan hover:underline">The Lancet Commission on Pollution and Health</a>.
              </p>
            </div>
          </div>
          
          {/* Action: Local Intervention - Static elegant violet border-glow with hover scale */}
          <a 
            href="#"
            className="action-btn block rounded-lg bg-dark-card p-5 transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: '2px solid #BB86FC',
              boxShadow: '0 0 20px rgba(187, 134, 252, 0.4)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neon-violet/10 flex items-center justify-center flex-shrink-0 border border-neon-violet/30">
                <svg className="w-6 h-6 text-neon-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="flex-grow">
                <p className="text-neon-violet font-semibold tracking-[0.15em] mb-1">
                  LOCAL AIR QUALITY INTERVENTION
                </p>
                <p className="text-sm text-muted-text">
                  Demand the implementation of Ultra-Low Emission Zones (ULEZ) and the phasing out of urban coal/diesel power.
                </p>
              </div>
              <svg className="w-5 h-5 text-muted-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
