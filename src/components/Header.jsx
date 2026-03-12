import { CONFIG } from '../config';
import { formatLargeNumber } from '../utils';

export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 text-xs tracking-[0.3em] text-muted-text mb-4 flex-wrap">
        <span className="animate-blink text-neon-orange">●</span>
        <span>LIVE ESTIMATE</span>
        <span className="text-dark-border">·</span>
        <span>GLOBAL CARBON OUTPUT</span>
        <span className="text-dark-border">·</span>
        <span>TRACKING SINCE JAN 1, 2026</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-[0.15em] mb-3 text-white">
        GLOBAL CARBON EMISSIONS BUDGET
      </h1>
      
      <p className="text-sm text-muted-text tracking-[0.2em] mb-6">
        Estimated Metric Tonnes of CO₂e Released
      </p>
      
      <div className="inline-block px-6 py-2 rounded-full border border-dark-border bg-dark-card/50 text-xs tracking-[0.15em]">
        BASED ON THE{' '}
        <a href="#sources" className="text-neon-cyan hover:underline">
          OUR WORLD IN DATA ESTIMATE
        </a>{' '}
        OF{' '}
        <span className="text-white font-semibold">
          {formatLargeNumber(CONFIG.annualTonnes).replace(/\.\d+/, '').toUpperCase()}
        </span>{' '}
        TONNES PER YEAR
      </div>
    </header>
  );
}
