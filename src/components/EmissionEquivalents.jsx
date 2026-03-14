
export default function EmissionEquivalents() {
  const equivalents = [
    //{ metric: 'Deforestation Rate (Football Fields)', value: '~30/min' },
    //{ metric: 'Equivalent Passenger Cars Added (Daily)', value: '24.9M vehicles' },
    //{ metric: 'Coal Plants at Full Capacity (Equiv.)', value: '~10,959 plants' },
    //{ metric: 'Global Avg. Temperature Increase (2026)', value: '+1.45°C', isRed: true, suffix: '(pre-industrial)' },
    { metric: 'Atmospheric CO₂ Concentration', value: '~428 ppm', suffix: '(+51% since 1750)' },
    { metric: 'Ocean Acidification (pH decline)', value: '-0.1 pH', suffix: '(30% more acidic)' },
    { metric: 'Arctic Sea Ice Loss Rate', value: '13%/decade' },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        OTHER ESTIMATES
      </h2>
      
      <div className="border border-dark-border rounded-lg bg-dark-card overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y divide-dark-border">
            {equivalents.map((item, index) => (
              <tr key={index} className="hover:bg-dark-slate/50 transition-colors">
                <td className="px-6 py-4 text-sm text-white">{item.metric}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-semibold ${item.isRed ? 'text-neon-red' : 'text-neon-orange'}`}>
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-muted-text text-xs ml-1">{item.suffix}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
