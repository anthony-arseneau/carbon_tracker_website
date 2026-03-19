import NavBar from '../components/NavBar';

const MODELS = [
  {
    id:     'RCP-2.6',
    label:  'Aggressive Mitigation Scenario',
    color:  '#28C76F',
    temp:   '+1.5°C',
    year:   '2055',
    status: 'TARGET',
    desc:   'Peak emissions before 2030, rapid drawdown. Requires halving global CO₂ output by 2030 and net-zero by 2050.',
  },
  {
    id:     'RCP-4.5',
    label:  'Moderate Stabilisation Scenario',
    color:  '#FFD93D',
    temp:   '+2.4°C',
    year:   '2070',
    status: 'PLAUSIBLE',
    desc:   'Stabilisation through policy and technology without optimistic assumptions. Overshoot is likely before stabilization.',
  },
  {
    id:     'RCP-6.0',
    label:  'High Emissions Scenario',
    color:  '#FF9F43',
    temp:   '+3.1°C',
    year:   '2080',
    status: 'CURRENT TREND',
    desc:   'Emissions peak mid-century with limited carbon capture. Reflects current policy ambitions without enforcement.',
  },
  {
    id:     'RCP-8.5',
    label:  'Business-as-Usual Scenario',
    color:  '#FF4757',
    temp:   '+4.8°C',
    year:   '2100',
    status: 'WORST CASE',
    desc:   'Unconstrained fossil fuel use through the century. Considered an extreme upper bound; increasingly unlikely due to energy transition.',
  },
];

export default function ProjectionModels() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      <NavBar />

      <main className="max-w-[900px] mx-auto px-4 py-12 relative z-10">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-3">
            MODULE · PROJECTION MODELS
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest font-mono mb-2">
            CLIMATE SCENARIO MATRIX
          </h1>
          <p className="text-sm text-muted-text font-mono tracking-wide">
            IPCC Representative Concentration Pathways (RCPs) — projected outcomes by end of century.
          </p>
        </div>

        {/* Model cards */}
        <div className="flex flex-col gap-4">
          {MODELS.map((m) => (
            <div
              key={m.id}
              className="border border-dark-border rounded-xl bg-dark-card px-6 py-5 flex flex-col md:flex-row md:items-center gap-4"
              style={{ borderLeftColor: m.color, borderLeftWidth: '3px' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] font-bold" style={{ color: m.color }}>
                    {m.id}
                  </span>
                  <span
                    className="text-[9px] font-mono tracking-[0.2em] border rounded px-1.5 py-0.5"
                    style={{ color: m.color, borderColor: m.color + '60' }}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="text-slate-200 text-sm font-mono tracking-wide mb-1">{m.label}</p>
                <p className="text-muted-text text-xs font-mono leading-relaxed">{m.desc}</p>
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-1 shrink-0">
                <span className="text-2xl font-bold font-mono" style={{ color: m.color }}>
                  {m.temp}
                </span>
                <span className="text-[10px] text-muted-text font-mono tracking-widest">
                  BY {m.year}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Under construction notice */}
        <div className="mt-10 border border-neon-cyan/30 rounded-xl bg-neon-cyan/5 px-6 py-5 flex items-start gap-4">
          <span className="text-neon-cyan text-lg font-mono shrink-0">◈</span>
          <div>
            <p className="text-neon-cyan text-[10px] tracking-[0.3em] font-mono uppercase mb-1">
              INTERACTIVE MODELLING — COMING SOON
            </p>
            <p className="text-muted-text text-xs font-mono leading-relaxed">
              Interactive trajectory charts, scenario comparison tools, and custom variable controls
              are in development. Source data references IPCC AR6 WG1.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
