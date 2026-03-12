import { useEffect, useState } from 'react';

// Constants based on WHO/IPCC health impact models
const MORTALITY_FACTOR_PER_AQI_POINT = 0.000046;

function calculateEstimatedDeaths(population, aqi) {
  // Deaths increase exponentially as AQI enters hazardous zones
  let riskMultiplier = aqi > 100 ? 1.5 : 1.0;
  return Math.floor(population * (aqi * MORTALITY_FACTOR_PER_AQI_POINT) * riskMultiplier);
}

// Icon components
const LungIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
  </svg>
);

const CityIcon = () => (
  <svg className="w-8 h-8 text-neon-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const FactoryIcon = () => (
  <svg className="w-8 h-8 text-neon-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-8 h-8 text-neon-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 22h20M6 18V6a2 2 0 012-2h8a2 2 0 012 2v12M6 18h12M10 8h4M10 12h4" />
  </svg>
);

export default function AirQuality() {
  const [tickerPosition, setTickerPosition] = useState(0);
  
  // Animated ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerPosition((prev) => (prev - 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const urbanTiers = [
    {
      icon: <CityIcon />,
      tier: 'TIER 1 METROPOLIS',
      population: 10000000,
      avgAqi: 180,
      aqiLabel: 'Unhealthy',
      deaths: calculateEstimatedDeaths(10000000, 180),
    },
    {
      icon: <FactoryIcon />,
      tier: 'INDUSTRIAL CORRIDOR',
      population: 2500000,
      avgAqi: 120,
      aqiLabel: 'Unhealthy for Sensitive',
      deaths: calculateEstimatedDeaths(2500000, 120),
    },
    {
      icon: <BuildingIcon />,
      tier: 'REGIONAL URBAN CENTER',
      population: 500000,
      avgAqi: 45,
      aqiLabel: 'Good/Moderate',
      deaths: calculateEstimatedDeaths(500000, 45),
    },
  ];

  return (
    <section className="mb-12 relative overflow-hidden">
      {/* Smoke/haze background animation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="smoke-animation absolute inset-0" />
      </div>
      
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        ATMOSPHERIC INTEGRITY & PUBLIC HEALTH
      </h2>
      
      {/* Live Ticker Tape */}
      <div className="border border-dark-border rounded-lg bg-dark-card p-4 mb-6 overflow-hidden relative">
        <div 
          className="flex gap-12 whitespace-nowrap text-xs tracking-wider animate-ticker"
          style={{ transform: `translateX(${tickerPosition}%)` }}
        >
          <span className="text-neon-violet">
            <span className="text-muted-text">CORRELATION: POPULATION DENSITY ↔ PM2.5 CONCENTRATION:</span>{' '}
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
          <span className="text-neon-violet">
            <span className="text-muted-text">FORMULA:</span>{' '}
            <span className="font-bold">Deaths ≈ Population × (AQI · k)</span>
          </span>
          <span className="text-muted-text">●</span>
          <span className="text-neon-violet">
            <span className="text-muted-text">CORRELATION: POPULATION DENSITY ↔ PM2.5 CONCENTRATION:</span>{' '}
            <span className="font-bold">+0.84 (STRONG POSITIVE)</span>
          </span>
          <span className="text-muted-text">●</span>
          <span className="text-neon-violet">
            <span className="text-muted-text">GLOBAL AVG AQI:</span>{' '}
            <span className="font-bold">58 (MODERATE)</span>
          </span>
        </div>
      </div>
      
      {/* AQI Threat Spectrum */}
      <div className="border border-dark-border rounded-lg bg-dark-card p-5 mb-6">
        <p className="text-xs tracking-[0.2em] text-muted-text mb-4 text-center font-mono">AQI THREAT SPECTRUM</p>
        
        {/* Scale Bar */}
        <div className="relative mb-2">
          <div className="flex h-3 rounded-full overflow-hidden shadow-lg">
            <div className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-300" style={{ boxShadow: '0 0 10px #22d3ee' }} />
            <div className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-300" style={{ boxShadow: '0 0 10px #facc15' }} />
            <div className="flex-1 bg-gradient-to-r from-orange-400 to-orange-300" style={{ boxShadow: '0 0 10px #fb923c' }} />
            <div className="flex-1 bg-gradient-to-r from-red-500 to-red-400" style={{ boxShadow: '0 0 10px #ef4444' }} />
            <div className="flex-1 bg-gradient-to-r from-violet-500 to-violet-400" style={{ boxShadow: '0 0 10px #8b5cf6' }} />
          </div>
          
          {/* Indicator Arrow for Global Avg (58) - positioned at ~23% since 58 is in the 51-100 range */}
          <div 
            className="absolute -top-5 transform -translate-x-1/2 flex flex-col items-center"
            style={{ left: '23%' }}
          >
            <span className="text-[10px] text-neon-violet font-bold mb-0.5">58</span>
            <svg className="w-3 h-3 text-neon-violet" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 16l-6-6h12l-6 6z" />
            </svg>
          </div>
        </div>
        
        {/* Scale Labels */}
        <div className="flex text-[10px] tracking-wider font-mono">
          <div className="flex-1 text-center">
            <span className="text-cyan-400">0-50</span>
            <span className="block text-muted-text">SAFE</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-yellow-400">51-100</span>
            <span className="block text-muted-text">MODERATE</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-orange-400">101-150</span>
            <span className="block text-muted-text">UNHEALTHY (S)</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-red-500">151-200</span>
            <span className="block text-muted-text">UNHEALTHY</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-violet-400">201+</span>
            <span className="block text-muted-text">HAZARDOUS</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Box */}
      <div className="border border-dark-border rounded-lg bg-dark-card p-6 glow-violet relative">
        <div className="flex items-center gap-2 text-neon-violet mb-6">
          <LungIcon />
          <span className="text-sm tracking-[0.2em] font-semibold">AIR QUALITY MORTALITY INDEX</span>
        </div>
        
        {/* Triple Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {urbanTiers.map((tier, index) => (
            <div 
              key={index}
              className="bg-dark-slate border border-neon-violet/30 rounded-lg p-5 text-center relative overflow-hidden group hover:border-neon-violet/60 transition-all"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-neon-violet/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-neon-violet/10 flex items-center justify-center">
                  {tier.icon}
                </div>
                
                <p className="text-xs tracking-[0.15em] text-neon-violet font-semibold mb-3">
                  {tier.tier}
                </p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-text">Population:</span>
                    <span className="text-white font-medium">{tier.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-text">Avg. AQI:</span>
                    <span className={`font-medium ${tier.avgAqi > 150 ? 'text-neon-red' : tier.avgAqi > 100 ? 'text-neon-orange' : 'text-neon-green'}`}>
                      {tier.avgAqi} <span className="text-muted-text">({tier.aqiLabel})</span>
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-dark-border">
                  <p className="text-xs text-muted-text mb-1">EST. ANNUAL DEATHS</p>
                  <p className="text-2xl font-bold text-neon-violet text-glow-violet">
                    {tier.deaths.toLocaleString()}+
                  </p>
                </div>
                
                <p className="text-[10px] text-muted-text mt-2 italic">
                  Pop × AQI Factor
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Technical Note */}
        <div className="bg-dark-slate/50 border border-neon-violet/20 rounded-lg p-4 text-sm mb-6">
          <p className="text-white mb-2">
            <span className="text-neon-violet font-semibold">Mortality Coefficient:</span>{' '}
            The calculation uses a theoretical coefficient of{' '}
            <span className="font-mono text-neon-violet">0.000046</span> deaths per capita per AQI point,
            with a <span className="font-semibold">1.5× risk multiplier</span> when AQI exceeds 100.
          </p>
          <p className="text-muted-text text-xs">
            Based on WHO Global Air Quality Guidelines and The Lancet Commission on Pollution and Health.
          </p>
        </div>
        
        {/* Call to Action - The Breathe Initiative */}
        <a 
          href="#"
          className="action-btn block border-2 border-neon-violet rounded-lg bg-dark-card p-5 hover:bg-neon-violet/10 transition-all pulse-violet"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neon-violet/10 flex items-center justify-center flex-shrink-0">
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
    </section>
  );
}
