import { CONFIG } from '../config';
import { formatLargeNumber } from '../utils';

export default function Header() {
  return (
    <header className="text-center mb-12">
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-[0.15em] mb-3 text-white">
        GLOBAL EMISSIONS BUDGET
      </h1>
      
      {/* <p className="text-sm text-muted-text tracking-[0.2em] mb-6">
        Estimated Metric Tonnes of CO₂e Released
      </p> */}
      
      <div className="inline-block text-muted-text px-6 py-2 rounded-full border border-dark-border bg-dark-card/50 text-xs tracking-[0.15em]">
        Based on the{' '}
        <a
          href="#sources"
          className="text-muted-text hover:underline"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('sources')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          World Meteorological Organization
        </a>{' '}
        of{' '}
        <span className="text-muted-text font-semibold">
          {formatLargeNumber(CONFIG.annualTonnes).replace(/\.\d+/, '').toUpperCase()}
        </span>{' '}
        tonnes per year
      </div>
    </header>
  );
}
