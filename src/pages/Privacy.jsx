import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

const SECTIONS = [
  {
    title: 'Data Collection',
    body: 'This website is informational and does not require account creation. By default, we do not collect personal information directly through forms on this page.',
  },
  {
    title: 'Analytics',
    body: 'If analytics tools are used, they may collect limited technical data such as browser type, device type, and anonymous usage patterns to improve site performance and reliability.',
  },
  {
    title: 'Third-Party Links',
    body: 'External links (for example donation or educational resources) lead to third-party sites with their own privacy practices. Please review their policies separately.',
  },
  {
    title: 'Policy Updates',
    body: 'This policy may be updated as the project evolves. Material changes will be reflected on this page with an updated revision date.',
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      <NavBar />

      <main className="max-w-[900px] mx-auto px-4 py-12 relative z-10">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-muted-text font-mono mb-3">
            Legal · Privacy Policy
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest font-mono mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-text font-mono tracking-widest">
            Last Updated: March 2026
          </p>
        </div>

        {/* Privacy sections */}
        <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden">
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className={`px-6 py-5 ${i < SECTIONS.length - 1 ? 'border-b border-dark-border/50' : ''}`}
            >
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-slate-200 mb-2">
                {String(i + 1).padStart(2, '0')}. {s.title}
              </h2>
              <p className="text-muted-text text-xs font-mono leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
