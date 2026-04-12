import { CONFIG } from '../config';
import { formatNumber } from '../utils';
import { Wind } from 'lucide-react'

// Icon components
const SunIcon = () => (
  <svg className="w-6 h-6 text-neon-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6 text-neon-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

export default function HumanImpact() {
  const impacts = [
    {
      icon: <SunIcon />,
      label: 'Excess Heat Deaths',
      value: `${formatNumber(CONFIG.heatDeaths)}+`,
      subtitle: 'annually worldwide',
      colorClass: 'text-neon-red text-glow-red',
      bgClass: 'bg-neon-red/10',
    },
    {
      icon: <LocationIcon />,
      label: 'Climate Refugees',
      value: `${formatNumber(CONFIG.climateRefugees / 1000000, 1)}M+`,
      subtitle: 'displaced annually',
      colorClass: 'text-neon-red text-glow-red',
      bgClass: 'bg-neon-red/10',
    },
    {
      icon: <Wind className="w-6 h-6 text-neon-red"/>,
      label: 'Air Pollution Deaths',
      value: `${formatNumber(CONFIG.pollutionDeaths / 1000000, 1)}M+`,
      subtitle: 'annually from fossil fuels',
      colorClass: 'text-neon-red text-glow-red',
      bgClass: 'bg-neon-red/10',
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        Estimated Human Impact
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {impacts.map((impact) => (
          <div 
            key={impact.label}
            className="border border-dark-border rounded-lg bg-dark-card p-6 text-center"
          >
            <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${impact.bgClass} flex items-center justify-center`}>
              {impact.icon}
            </div>
            <p className="text-xs tracking-[0.2em] text-muted-text mb-2">{impact.label}</p>
            <p className={`text-3xl font-bold mb-1 ${impact.colorClass}`}>{impact.value}</p>
            <p className="text-xs text-muted-text">{impact.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
