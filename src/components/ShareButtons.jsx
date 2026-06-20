

import { CircleCheck, Copy } from 'lucide-react';
import { useRef, useState } from 'react';
import { CONFIG, getAcceleratedTotalEmissions, getYearsUntilBudgetDepleted, INITIAL_BUDGET_20C } from '../config';
import { calculateTimeElapsed } from '../utils';

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const getYearsRemaining = () => {
    const elapsed = calculateTimeElapsed(CONFIG.startDate);
    const spent = getAcceleratedTotalEmissions(elapsed.totalSeconds);
    const remaining = Math.max(INITIAL_BUDGET_20C - spent, 0);
    return getYearsUntilBudgetDepleted(remaining, elapsed.totalSeconds);
  };

  const shareTwitter = () => {
    const yearsRemaining = getYearsRemaining();
    const text = `Global emissions since Jan 1, 2026 are rising rapidly. We have ~${yearsRemaining.toFixed(2)} years until the 2.0°C emissions budget is exhausted`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  };

  const shareThreads = () => {
    const yearsRemaining = getYearsRemaining();
    const text = `Global emissions since Jan 1, 2026 are rising rapidly. We have ~${yearsRemaining.toFixed(2)} years until the 2.0°C emissions budget is exhausted ${window.location.href}`;
    window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`, '_blank');
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
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1000);
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
          <span className="text-sm tracking-wider">Post</span>
        </button>

        <button
          onClick={shareThreads}
          className="flex items-center gap-2 px-5 py-2.5 border border-dark-border rounded-lg bg-dark-card hover:bg-dark-slate transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.36-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.235-13.04c-.36-.02-.74-.02-1.13.001-1.7.096-2.766.86-2.7 2.022.064 1.165 1.205 1.762 2.616 1.681 1.295-.073 2.992-.578 3.28-3.486a8.69 8.69 0 0 0-2.066-.218Z"/>
          </svg>
          <span className="text-sm tracking-wider">Threads</span>
        </button>
        
        <button 
          onClick={shareGeneric}
          className="flex items-center gap-2 px-5 py-2.5 border border-dark-border rounded-lg bg-dark-card hover:bg-dark-slate transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          <span className="text-sm tracking-wider">Share</span>
        </button>
        
        <button 
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-2.5 border border-dark-border rounded-lg bg-dark-card hover:bg-dark-slate transition-colors"
        >
          {copied ? (
            <CircleCheck className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="text-sm tracking-wider">
            {copied ? 'Link Copied!' : 'Copy Link'}
          </span>
        </button>
      </div>
    </section>
  );
}
