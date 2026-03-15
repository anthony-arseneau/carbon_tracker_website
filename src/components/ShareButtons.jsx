

import { CONFIG, INITIAL_BUDGET_20C, SECONDS_PER_YEAR, TONNES_PER_SECOND } from '../config';
import { calculateTimeElapsed } from '../utils';

export default function ShareButtons() {
  const getYearsRemaining = () => {
    const elapsed = calculateTimeElapsed(CONFIG.startDate);
    const spent = elapsed.totalSeconds * TONNES_PER_SECOND;
    const remaining = Math.max(INITIAL_BUDGET_20C - spent, 0);
    return remaining / (TONNES_PER_SECOND * SECONDS_PER_YEAR);
  };

  const shareTwitter = () => {
    const yearsRemaining = getYearsRemaining();
    const text = `Global emissions since Jan 1, 2026 are rising rapidly. We have ~${yearsRemaining.toFixed(2)} years until the 2.0°C emissions budget is exhausted`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  };

  const shareGeneric = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Global Carbon Emissions Budget',
        text: 'Track global carbon emissions in real-time',
        url: window.location.href
      });
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <section className="mb-12">
      <div className="flex justify-center gap-4 flex-wrap">
        <button 
          onClick={shareTwitter}
          className="flex items-center gap-2 px-5 py-2.5 border border-dark-border rounded-lg bg-dark-card hover:bg-dark-slate transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span className="text-sm tracking-wider">POST</span>
        </button>
        
        <button 
          onClick={shareGeneric}
          className="flex items-center gap-2 px-5 py-2.5 border border-dark-border rounded-lg bg-dark-card hover:bg-dark-slate transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          <span className="text-sm tracking-wider">SHARE</span>
        </button>
        
        <button 
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-2.5 border border-dark-border rounded-lg bg-dark-card hover:bg-dark-slate transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
          </svg>
          <span className="text-sm tracking-wider">COPY LINK</span>
        </button>
      </div>
    </section>
  );
}
