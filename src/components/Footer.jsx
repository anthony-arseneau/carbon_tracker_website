import { Link } from 'react-router-dom';

const GlobeIcon = () => (
  <svg className="w-5 h-5 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-dark-border pt-8 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-text">
        <div className="flex items-center gap-2">
          <GlobeIcon />
          <span>Emissions Budget · Built for environmental transparency</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          {/*<span className="text-dark-border">|</span>
          <Link to="#" className="hover:text-white transition-colors">Methodology</Link>*/}
          <span className="text-dark-border">|</span>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
      <p className="text-center text-xs text-muted-text mt-4">
        Data updated in real-time
      </p>
    </footer>
  );
}
