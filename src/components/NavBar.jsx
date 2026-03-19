import { useState } from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ item, onClick }) => {
  const baseClass =
    'flex items-center gap-2 text-xs tracking-widest font-mono text-slate-400 hover:text-white transition-colors duration-200';

  const inner = (
    <>
      {item.live && (
        <span className="animate-pulse bg-red-500 rounded-full h-2 w-2 shrink-0" />
      )}
      {item.label}
    </>
  );

  if (item.to) {
    return (
      <Link to={item.to} className={baseClass} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.href} className={baseClass} onClick={onClick}>
      {inner}
    </a>
  );
};

const NAV_ITEMS = [
  { label: 'LIVE DASHBOARD', to: '/', live: true },
  { label: 'SYSTEM DIAGNOSTICS', to: '/diagnostics' },
  { label: 'PROJECTION MODELS', to: '/projections' },
  { label: 'DATA & METHODOLOGY', to: '/methodology' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Branding */}
          <Link
            to="/"
            className="text-muted-text font-bold tracking-widest uppercase text-sm font-mono hover:text-neon-cyan transition-colors duration-200"
          >
            EMISSIONS BUDGET
          </Link>

          {/* Right: Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>

          {/* Right: Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white transition-colors leading-none p-2 text-xl font-mono"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            &#9776;
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/97 backdrop-blur-md flex flex-col">
          {/* Overlay header */}
          <div className="flex items-center justify-between px-6 h-14 border-b border-dark-border shrink-0">
            <span className="text-white font-bold tracking-widest uppercase text-sm font-mono">
              EMISSIONS BUDGET
            </span>
            <button
              className="text-slate-300 hover:text-white transition-colors text-lg font-mono p-2"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              &#10005;
            </button>
          </div>

          {/* Overlay links */}
          <ul className="flex flex-col flex-1 justify-center px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="border-b border-dark-border/50 last:border-0 py-5">
                <NavLink item={item} onClick={closeMenu} />
              </li>
            ))}
          </ul>

          {/* Overlay footer note */}
          <p className="text-center text-xs text-muted-text font-mono tracking-widest pb-8">
            REAL-TIME CLIMATE SIGNAL MONITORING
          </p>
        </div>
      )}
    </>
  );
}
