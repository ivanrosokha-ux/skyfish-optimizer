import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Profile' },
    { path: '/optimizer', label: 'Optimizer' },
    { path: '/account', label: 'Account' },
  ];

  return (
    <header className="border-b border-surface-border bg-background/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
        <span className="text-emerald-500">🎣</span>
        <span>SkyFish</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm font-medium">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:bg-zinc-800 text-zinc-300 transition"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
