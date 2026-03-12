import { TONNES_PER_DAY, TONNES_PER_MINUTE, TONNES_PER_SECOND } from '../config';
import { formatNumber } from '../utils';

export default function RateCards() {
  const rates = [
    { label: 'PER SECOND', value: TONNES_PER_SECOND, decimals: 2 },
    { label: 'PER MINUTE', value: TONNES_PER_MINUTE, decimals: 2 },
    { label: 'PER DAY', value: TONNES_PER_DAY, decimals: 0 },
  ];

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rates.map((rate) => (
          <div 
            key={rate.label}
            className="border border-dark-border rounded-lg bg-dark-card p-6 text-center card-hover"
          >
            <p className="text-xs tracking-[0.3em] text-muted-text mb-3">{rate.label}</p>
            <p className="text-2xl md:text-3xl font-bold text-neon-orange text-glow-orange">
              {formatNumber(rate.value, rate.decimals)}
            </p>
            <p className="text-xs text-muted-text mt-2">tonnes CO₂e</p>
          </div>
        ))}
      </div>
    </section>
  );
}
