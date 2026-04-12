import NavBar from '../components/NavBar';
import Sources from '../components/Sources.jsx'

const SOURCES = [
  {
    org:    'World Meteorological Organization',
    abbr:   'WMO',
    color:  '#00D2FC',
    role:   'Annual global CO₂ and GHG emission rates. Basis for the primary counter rate used on the live dashboard.',
    url:    'https://wmo.int',
  },
  {
    org:    'IPCC AR6 Working Group I',
    abbr:   'IPCC',
    color:  '#28C76F',
    role:   'Remaining carbon budgets for 1.5°C and 2.0°C temperature thresholds. Used to define the depletion gauges.',
    url:    'https://ipcc.ch',
  },
  {
    org:    'Berkeley Earth',
    abbr:   'BERK',
    color:  '#FF9F43',
    role:   'Surface temperature anomaly records and long-term warming trend data used in projection overlays.',
    url:    'https://berkeleyearth.org',
  },
  {
    org:    'Global Carbon Project',
    abbr:   'GCP',
    color:  '#BB86FC',
    role:   'Annual Global Carbon Budget publication. Cross-reference for land-use, ocean sink, and fossil emission estimates.',
    url:    'https://globalcarbonproject.org',
  },
];

const METHODOLOGY = [
  {
    q: 'How is the live counter calculated?',
    a: 'We take the latest published annual emission rate (WMO, in GtCO₂e/year) and divide by the number of seconds in a year to produce a per-second figure. The counter applies this rate continuously from a fixed reference date (January 1, 2026).',
  },
  {
    q: 'What counts as "CO₂ equivalent"?',
    a: 'The figures include CO₂ from fossil fuels and industry, land-use change, methane (CH₄), and nitrous oxide (N₂O) converted to CO₂e using 100-year global warming potentials from IPCC AR6.',
  },
  {
    q: 'How accurate is the real-time estimate?',
    a: 'The counter is an informative estimate, not a measured reading. Actual emissions fluctuate seasonally and by sector. The value reflects a smooth linear projection of the latest annual total and should be interpreted as an order-of-magnitude signal, not a precise measurement.',
  },
  {
    q: 'Where does the remaining budget figure come from?',
    a: 'The 1.5°C budget uses the IPCC AR6 median estimate of ~500 GtCO₂ remaining from Jan 2020, adjusted forward using cumulative emissions through the reference date. The 2.0°C budget uses the equivalent ~1150 GtCO₂ figure.',
  },
];

export default function DataMethodology() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      <NavBar />

      <main className="max-w-[900px] mx-auto px-4 py-12 relative z-10 space-y-12">

        {/* Page header */}
        <div>
          <p className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-3">
            Module · Data &amp; Methodology
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest font-mono mb-2">
            Data Calibration &amp; Sources
          </h1>
          <p className="text-sm text-muted-text font-mono tracking-wide">
            Transparency record for all data pipelines, assumptions, and scientific references used by this dashboard.
          </p>
        </div>

        {/* Data Sources */}
        <section>
          <h2 className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-5">
            Primary Data Sources
          </h2>
          <div className="flex flex-col gap-3">
            {SOURCES.map((s) => (
              <a
                key={s.abbr}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-dark-border rounded-xl bg-dark-card px-5 py-4 flex items-start gap-4 hover:border-slate-600 transition-colors duration-200 group"
                style={{ borderLeftColor: s.color, borderLeftWidth: '3px' }}
              >
                <span
                  className="text-[10px] font-mono font-bold tracking-[0.2em] mt-0.5 shrink-0 w-10"
                  style={{ color: s.color }}
                >
                  {s.abbr}
                </span>
                <div className="min-w-0">
                  <p className="text-slate-200 text-xs font-mono tracking-wide mb-1 group-hover:text-white transition-colors">
                    {s.org}
                  </p>
                  <p className="text-muted-text text-xs font-mono leading-relaxed">{s.role}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Methodology FAQ */}
        <section>
          <h2 className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-5">
            Methodology: Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4">
            {METHODOLOGY.map((item, i) => (
              <div key={i} className="border border-dark-border rounded-xl bg-dark-card px-5 py-4">
                <p className="text-slate-200 text-xs font-mono tracking-wide mb-2">{item.q}</p>
                <p className="text-muted-text text-xs font-mono leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* H. Sources */}
        <Sources />

        {/* Disclaimer */}
        <div className="border border-dark-border/50 rounded-xl bg-slate-950/60 px-6 py-5">
          <p className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-2">
            Disclaimer
          </p>
          <p className="text-muted-text text-xs font-mono leading-relaxed">
            All figures are informative estimates designed for public awareness and education. They are
            not intended for policy, legal, or compliance purposes. This is an independent project and
            is not affiliated with any of the cited organisations.
          </p>
        </div>

      </main>
    </div>
  );
}
