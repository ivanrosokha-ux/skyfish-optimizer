import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Profile' },
    { path: '/optimizer', label: 'Optimizer' },
    { path: '/account', label: 'Account' },
  ];

  return (
    <header className="border-b border-[#3A2F29] bg-[#1A1411] px-8 py-5 flex items-center justify-between">
      <Link
        to="/"
        className="text-xl font-bold tracking-tight text-[#F5F1EC] hover:text-white transition"
      >
        SkyFish
      </Link>

      <nav className="flex items-center gap-8 text-sm">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative py-1 transition-colors ${
                isActive
                  ? 'text-[#1FA64A] font-semibold after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-[#1FA64A]'
                  : 'text-[#A39A92] hover:text-[#F5F1EC]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
