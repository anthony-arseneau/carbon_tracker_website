
export default function Sources() {
  const sources = [
    {
      title: 'Our World in Data',
      description: 'Annual CO₂ emissions',
      url: 'https://ourworldindata.org/grapher/annual-co2-emissions-per-country?country=USA~GBR~IND~CHN~FRA~DEU~BRA~OWID_WRL',
    },{
      title: 'IPCC',
      description: 'Remaining Carbon Budget, Climate Projections',
      url: 'https://www.ipcc.ch/sr15/',
    },
    {
      title: 'Global Carbon Budget',
      description: 'Remaining Carbon Budget at the End of 2025',
      url: 'https://globalcarbonbudget.org/fossil-fuel-co2-emissions-hit-record-high-in-2025/#:~:text=Over%20the%202015%2D2024%20period,as%20a%20peer%2Dreviewed%20paper.',
    },


    {
      title: 'The Guardian',
      description: 'Square Kilometers Burned per Year',
      url: 'https://www.theguardian.com/world/ng-interactive/2026/jan/13/mapped-how-the-world-is-losing-its-forests-to-wildfires',
    },


    {
      title: 'WHO',
      description: 'Heat-Related Deaths per Year',
      url: 'https://www.who.int/news-room/fact-sheets/detail/climate-change-heat-and-health#:~:text=Key%20facts,heatwave%20in%20the%20Russian%20Federation.',
    },
    {
      title: 'Zurich',
      description: 'Number of Climate Refugees per Year',
      url: 'https://www.zurich.com/insights/business/there-could-be-1-2-billion-climate-refugees-by-2050-here-s-what-you-need-to-know',
    },
    {
      title: 'IQAir',
      description: 'Air Pollution Deaths per Year',
      url: 'https://www.iqair.com/ca/newsroom/air-pollution-kills-7-million-every-year',
    },







    {
      title: 'Global Forest Watch',
      description: 'Real-time deforestation monitoring',
      url: 'https://www.globalforestwatch.org/',
    },
    {
      title: 'WHO Air Pollution Data',
      description: 'Health impacts of fossil fuel combustion',
      url: 'https://www.who.int/health-topics/air-pollution',
    },

    {
      title: 'World Economic Forum',
      description: 'Global GDP Loss per Year',
      url: 'https://www.weforum.org/stories/2023/10/climate-loss-and-damage-cost-16-million-per-hour/',
    },
    
  ];

  return (
    <section className="mb-12" id="sources">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        SOURCES
      </h2>
      
      <div className="border border-dark-border rounded-lg bg-dark-card p-6">
        <ul className="space-y-3 text-sm">
          {sources.map((source, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-neon-cyan">●</span>
              <span className="text-white">
                <a 
                  href={source.url} 
                  target="_blank"
                  className="font-semibold hover:text-neon-cyan transition-colors"
                >
                  {source.title}
                </a>
                {' — '}{source.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
