import CO2SphereVisualization from '../components/CO2SphereVisualization';
import NavBar from '../components/NavBar';
import EmissionEquivalents from '../components/EmissionEquivalents';

const DIAGNOSTICS = [
  { id: 'ATMOS-01', label: 'Atmospheric CO₂ Sensor Array',    status: 'NOMINAL',  value: '424.6 ppm' },
  { id: 'CRBN-02',  label: 'Global Carbon Flux Monitor',      status: 'NOMINAL',  value: '±0.3 GtC/yr' },
  { id: 'TEMP-03',  label: 'Surface Temperature Anomaly Feed', status: 'DEGRADED', value: '+1.48°C baseline' },
  { id: 'BDGT-04',  label: '1.5°C Budget Depletion Engine',   status: 'NOMINAL',  value: 'LIVE' },
  { id: 'OCEН-05',  label: 'Ocean Heat Content Stream',        status: 'OFFLINE',  value: '—' },
  { id: 'ICEX-06',  label: 'Cryosphere Extent Telemetry',      status: 'OFFLINE',  value: '—' },
];

const STATUS_STYLES = {
  NOMINAL:  { dot: 'bg-neon-green',  text: 'text-neon-green' },
  DEGRADED: { dot: 'bg-neon-yellow', text: 'text-neon-yellow' },
  OFFLINE:  { dot: 'bg-neon-red',    text: 'text-neon-red' },
};

export default function SystemDiagnostics() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">

        {/* Page header */}
        {/* <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-3">
            MODULE · SYSTEM DIAGNOSTICS
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest font-mono mb-2">
            SENSOR ARRAY STATUS
          </h1>
          <p className="text-sm text-muted-text font-mono tracking-wide">
            Real-time health check of all data ingestion pipelines and monitoring modules.
          </p>
        </div> */}

        {/* Diagnostics table */}
        {/* <div className="mb-12 border border-dark-border rounded-xl overflow-hidden bg-dark-card">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-6 px-6 py-3 border-b border-dark-border bg-slate-950/60 text-[10px] tracking-[0.25em] text-muted-text font-mono uppercase">
            <span>ID</span>
            <span>MODULE</span>
            <span className="text-right">STATUS</span>
            <span className="text-right">LAST VALUE</span>
          </div>
          {DIAGNOSTICS.map((d, i) => {
            const s = STATUS_STYLES[d.status];
            return (
              <div
                key={d.id}
                className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-6 px-6 py-4 font-mono text-xs items-center ${i < DIAGNOSTICS.length - 1 ? 'border-b border-dark-border/40' : ''}`}
              >
                <span className="text-muted-text tracking-widest">{d.id}</span>
                <span className="text-slate-300 tracking-wide">{d.label}</span>
                <span className={`flex items-center gap-2 justify-end ${s.text} tracking-widest text-[10px]`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot} ${d.status === 'NOMINAL' ? 'animate-pulse' : ''}`} />
                  {d.status}
                </span>
                <span className="text-right text-slate-400 tracking-wider">{d.value}</span>
              </div>
            );
          })}
        </div> */}

        {/* CO₂ 1-Tonne Sphere Visualization */}
        {/* <CO2SphereVisualization /> */}

        {/* E. Emission Equivalents */}
        {/* <EmissionEquivalents /> */}

        {/* Under construction notice */}
        <div className="mt-10 border border-neon-yellow/30 rounded-xl bg-neon-yellow/5 px-6 py-5 flex items-start gap-4">
          <span className="text-neon-yellow text-lg font-mono shrink-0">⚠</span>
          <div>
            <p className="text-neon-yellow text-[10px] tracking-[0.3em] font-mono uppercase mb-1">
              MODULE UNDER CONSTRUCTION
            </p>
            <p className="text-muted-text text-xs font-mono leading-relaxed">
              Full interactive diagnostics, pipeline latency graphs, and data-freshness indicators are
              currently in development. Check back as the platform evolves.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
