import { CONFIG } from '../config';

const DollarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

export default function EconomicCost() {
  const costs = [
    { label: 'GLOBAL GDP LOSS', value: '$2.8T', subtitle: 'annually by 2030' },
    { label: 'EXTREME WEATHER COST', value: '$313B', subtitle: 'in 2025 alone' },
    { label: 'SOCIAL COST OF CARBON', value: '$185', subtitle: 'per tonne CO₂' },
  ];

  const socialCost = 185;
  const annualCost = (CONFIG.annualTonnes * socialCost) / 1e12;

  return (
    <section className="mb-12">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        ECONOMIC COST OF INACTION
      </h2>
      
      <div className="border border-dark-border rounded-lg bg-dark-card p-6">
        <div className="flex items-center gap-2 text-neon-red mb-6">
          <DollarIcon />
          <span className="text-sm tracking-[0.2em] font-semibold">ANNUAL CLIMATE DAMAGES</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {costs.map((cost) => (
            <div key={cost.label} className="bg-dark-slate rounded-lg p-4 text-center">
              <p className="text-xs text-muted-text mb-1">{cost.label}</p>
              <p className="text-2xl font-bold text-neon-red text-glow-red">{cost.value}</p>
              <p className="text-xs text-muted-text">{cost.subtitle}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-dark-slate/50 border border-neon-red/30 rounded-lg p-4">
          <p className="text-sm text-white">
            At current emission rates of <span className="font-semibold">38B t/year</span> and a social cost of{' '}
            <span className="font-semibold">$185/tonne</span>, the annual hidden cost to society is{' '}
            <span className="text-neon-red font-semibold text-lg text-glow-red">${annualCost.toFixed(1)} trillion</span>—equivalent to{' '}
            <span>~7.5% of global GDP</span>.
          </p>
        </div>
        
      </div>
    </section>
  );
}
