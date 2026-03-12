import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen text-white">
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      <main className="max-w-[900px] mx-auto px-4 py-8 relative z-10">
        <div className="border border-dark-border rounded-xl bg-dark-card p-7 glow-cyan">
          <p className="text-xs tracking-[0.26em] text-muted-text mb-4 uppercase">About This Project</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-wide">Global Carbon Emissions Tracker</h1>

          <p className="text-muted-text leading-relaxed mb-4">
            This website is an independent public-interest dashboard that visualizes real-time climate
            pressure signals using transparent assumptions and clearly labeled estimates.
          </p>
          <p className="text-muted-text leading-relaxed mb-4">
            The goal is to make abstract climate budgets tangible: what has already been emitted,
            what remains under the 1.5°C budget, and how fast current trajectories consume that
            remaining margin.
          </p>
          <p className="text-muted-text leading-relaxed mb-4">
            Figures shown are informative estimates based on published annual-rate data and simple
            continuous-time projections. They are designed for awareness and education, not policy or
            legal compliance.
          </p>

          <Link
            to="/"
            className="inline-block mt-4 text-neon-cyan border border-neon-cyan rounded-lg px-4 py-2.5 text-sm transition-all hover:bg-neon-cyan/10 hover:-translate-y-0.5"
          >
            ← Go Back To Main Page
          </Link>
        </div>
      </main>
    </div>
  );
}
