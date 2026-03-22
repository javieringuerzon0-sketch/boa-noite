import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollLink } from '../ui/ScrollLink';
import { Menu, X, Coffee } from 'lucide-react';

const NAV_LINKS = [
  { to: '/menu',      label: 'Menú' },
  { to: '/alma', label: 'Alma' },
  { to: '/contacto',  label: 'Contacto' },
];

export function Header() {
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-[#09090b]/90 backdrop-blur-2xl py-3'
        : 'bg-transparent py-6'
    }`}>
      {/* Neon border line — visible only when scrolled */}
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
        isScrolled
          ? 'opacity-100 bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent'
          : 'opacity-0'
      }`} />

      <div className="container mx-auto px-6 lg:px-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <span className="text-[11px] font-extrabold tracking-[0.35em] text-white uppercase">
            BOA <span className="text-neon-blue group-hover:animate-neon-flicker transition-all">NOITE</span>
          </span>
          <Coffee
            size={15}
            className="text-neon-blue/80 group-hover:text-neon-blue transition-colors duration-300 -mt-0.5 shrink-0"
            strokeWidth={2.2}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <ScrollLink
              key={to}
              to={to}
              className={`relative px-4 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 group ${
                isActive(to) ? 'text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <span className="relative z-10">{label}</span>
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-300 rounded-full ${
                isActive(to) ? 'w-5' : 'w-0 group-hover:w-5'
              }`} />
            </ScrollLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <ScrollLink
            to="/contacto"
            className="relative overflow-hidden rounded-sm text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 text-white group inline-flex items-center gap-1.5"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue opacity-85 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 animate-shimmer" />
            <span className="relative z-10">Agenda →</span>
          </ScrollLink>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menú"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#09090b]/95 backdrop-blur-xl border-t border-white/6 md:hidden">
          <nav className="flex flex-col py-6 px-6 gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <ScrollLink
                key={to}
                to={to}
                className={`text-sm font-semibold tracking-widest uppercase py-3 px-2 transition-colors border-b border-white/5 ${
                  isActive(to) ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                {label}
              </ScrollLink>
            ))}
            <ScrollLink
              to="/contacto"
              className="relative overflow-hidden rounded-sm mt-5 text-white text-[10px] font-bold tracking-widest uppercase px-6 py-4 text-center inline-block"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue" />
              <span className="absolute inset-0 animate-shimmer" />
              <span className="relative z-10">Agenda tu Evento</span>
            </ScrollLink>
          </nav>
        </div>
      )}
    </header>
  );
}
