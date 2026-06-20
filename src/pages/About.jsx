import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

const SECTIONS = [
  {
    title: 'Overview',
    body: 'This website is an independent public-interest dashboard that visualizes real-time climate pressure signals using transparent assumptions and clearly labeled estimates.',
  },
  {
    title: 'Our Goal',
    body: 'The goal is to make abstract climate budgets tangible: what has already been emitted, what remains under the 1.5°C budget, and how fast current trajectories consume that remaining margin.',
  },
  {
    title: 'How to Read the Figures',
    body: 'Figures shown are informative estimates based on published annual-rate data and simple continuous-time projections. They are designed for awareness and education, not policy or legal compliance.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      <NavBar />

      <main className="max-w-[900px] mx-auto px-4 py-12 relative z-10">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-muted-text font-mono mb-3">
            About · This Project
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest font-mono mb-2">
            Global Carbon Emissions Tracker
          </h1>
          <p className="text-xs text-muted-text font-mono tracking-widest">
            Last Updated: March 2026
          </p>
        </div>

        {/* About sections */}
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
