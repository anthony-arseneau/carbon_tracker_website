
// Icon components
const TreeIcon = () => (
  <svg className="w-7 h-7 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L6 10h3v4H6l6 8 6-8h-3v-4h3L12 2z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22v-4"/>
  </svg>
);

const AirFlowIcon = () => (
  <svg className="w-7 h-7 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-7 h-7 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const WaveIcon = () => (
  <svg className="w-7 h-7 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15c2.483 0 4.345-3 6-3s3.517 3 6 3 4.517-3 6-3M3 9c2.483 0 4.345-3 6-3s3.517 3 6 3 4.517-3 6-3"/>
  </svg>
);

export default function AbsorptionAlternatives() {
  const alternatives = [
    {
      icon: <TreeIcon />,
      label: 'REFORESTATION',
      value: '1.8B',
      subtitle: 'trees needed annually',
      note: 'to offset 40 Gt/yr',
    },
    {
      icon: <AirFlowIcon />,
      label: 'DIRECT AIR CAPTURE',
      value: '40,000',
      subtitle: 'DAC facilities needed',
      note: 'at 1 MtCO₂/yr each',
    },
    {
      icon: <GlobeIcon />,
      label: 'SOIL SEQUESTRATION',
      value: '10 Gt',
      subtitle: 'potential via regen ag',
      note: '25% of annual emissions',
    },
    {
      icon: <WaveIcon />,
      label: 'OCEAN ABSORPTION',
      value: '~10 Gt',
      subtitle: 'absorbed annually',
      note: 'natural ocean sink',
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        WHAT COULD THIS ABSORPTION CAPACITY BUY?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alternatives.map((alt) => (
          <div 
            key={alt.label}
            className="border border-dark-border rounded-lg bg-dark-card p-6 text-center glow-green card-hover"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neon-green/10 flex items-center justify-center">
              {alt.icon}
            </div>
            <p className="text-xs tracking-[0.2em] text-muted-text mb-2">{alt.label}</p>
            <p className="text-3xl font-bold text-neon-green text-glow-green mb-1">{alt.value}</p>
            <p className="text-xs text-muted-text">{alt.subtitle}</p>
            <p className="text-xs text-neon-green/70 mt-2">{alt.note}</p>
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs text-muted-text mt-4">
        Note: These represent the scale of intervention needed to offset current emissions.{' '}
        <span className="text-neon-orange">Reducing emissions</span> remains far more effective than sequestration.
      </p>
    </section>
  );
}
