import { Link } from 'react-router-dom';

const DATA_PARTNERS = [
  { abbr: 'WMO',   name: 'World Meteorological Organization',         color: '#00D2FC' },
  { abbr: 'IPCC',  name: 'Intergovernmental Panel on Climate Change', color: '#28C76F' },
  { abbr: 'BERK',  name: 'Berkeley Earth',                            color: '#FF9F43' },
  { abbr: 'GCP',   name: 'Global Carbon Project',                     color: '#BB86FC' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-dark-card border-t border-dark-border py-12 relative z-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* 3-column grid → 1-column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8 mb-10 text-center md:text-left">

          {/* Column 1: Project Info */}
          <div>
            <h3 className="text-[10px] tracking-[0.28em] text-muted-text uppercase font-mono mb-5">
              Project Info
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-white text-xs font-mono tracking-widest transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              {/* <li>
                <a
                  href="mailto:contact@emissionsbudget.com"
                  className="text-slate-400 hover:text-white text-xs font-mono tracking-widest transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li> */}
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div>
            <h3 className="text-[10px] tracking-[0.28em] text-muted-text uppercase font-mono mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-slate-400 hover:text-white text-xs font-mono tracking-widest transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-slate-400 hover:text-white text-xs font-mono tracking-widest transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Data Partners */}
          <div>
            <h3 className="text-[10px] tracking-[0.28em] text-muted-text uppercase font-mono mb-5">
              Data Calibration &amp; Sources
            </h3>
            <div className="flex flex-row flex-wrap justify-center md:justify-start gap-3">
              {DATA_PARTNERS.map((p) => (
                <Link
                  to="/methodology"
                  key={p.abbr}
                  title={p.name}
                  className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default border rounded px-2.5 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em]"
                  style={{ color: p.color, borderColor: p.color }}
                >
                  {p.abbr}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-muted-text font-mono tracking-[0.2em]">
          <span>Emissions Budget &middot; Built for Environmental Transparency &middot; Tracking Since Jan 2026</span>
          <span className="flex items-center gap-2">
            <span className="animate-pulse bg-neon-green rounded-full h-1.5 w-1.5 shrink-0" />
            Data Updated in Real-Time
          </span>
        </div>

      </div>
    </footer>
  );
}
