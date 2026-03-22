import { Instagram, MessageCircle, ArrowRight, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollLink } from '../ui/ScrollLink';

const NAV_LINKS = [
  { to: '/',          label: 'Inicio',     hash: false },
  { to: '/menu',      label: 'Menú',       hash: false },
  { to: '/alma',      label: 'Alma',       hash: false },
  { to: '/contacto',  label: 'Contacto',   hash: false },
];
const HASH_LINKS = [
  { href: '/#ubicacion', label: 'Ubicación' },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#09090b] text-white relative overflow-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[300px] rounded-full opacity-8"
        style={{ background: 'radial-gradient(ellipse, #ec4899 0%, transparent 70%)', filter: 'blur(120px)' }} />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[250px] rounded-full opacity-6"
        style={{ background: 'radial-gradient(ellipse, #2dd4bf 0%, transparent 70%)', filter: 'blur(100px)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ec4899]/25 to-transparent" />

      {/* ── Main grid ─────────────────────────────────────── */}
      <div className="relative z-10 container mx-auto px-6 lg:px-14 pt-20 pb-14 grid grid-cols-1 md:grid-cols-12 gap-14 border-b border-white/5">

        {/* Brand — 5 cols */}
        <div className="md:col-span-5 flex flex-col">

          {/* Logo — idéntico al navbar */}
          <ScrollLink to="/" className="group flex items-center gap-2 mb-7 w-fit">
            <span className="text-[11px] font-extrabold tracking-[0.35em] text-white uppercase">
              BOA{' '}
              <span className="text-neon-blue group-hover:animate-neon-flicker transition-all">
                NOITE
              </span>
            </span>
            <Coffee
              size={15}
              className="text-neon-blue/80 group-hover:text-neon-blue transition-colors duration-300 -mt-0.5 shrink-0"
              strokeWidth={2.2}
            />
          </ScrollLink>

          <p className="text-sm text-white/30 leading-relaxed font-light max-w-xs mb-8">
            Café de especialidad y helados artesanales sobre ruedas.
            Presentes en los mejores eventos de Santiago zona oriente.
          </p>

          {/* Social icons */}
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/boanoitecafe/"
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 glass rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-[#ec4899] hover:border-[#ec4899]/30 transition-all duration-300"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://wa.me/56967270078?text=Hola%20Boa%20Noite%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios%20%E2%98%95"
              target="_blank" rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 glass rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-[#2dd4bf] hover:border-[#2dd4bf]/30 transition-all duration-300"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>

        {/* Nav links — 3 cols */}
        <div className="md:col-span-3 flex flex-col">
          <h3 className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/25 mb-5">Navegar</h3>
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map(({ to, label }) => (
              <ScrollLink
                key={to}
                to={to}
                className="group flex items-center gap-2 text-sm text-white/40 hover:text-white transition-all duration-200 font-medium w-fit"
              >
                <span className="w-1 h-px bg-white/15 group-hover:bg-[#ec4899] group-hover:w-3 transition-all duration-300" />
                {label}
              </ScrollLink>
            ))}
            {HASH_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="group flex items-center gap-2 text-sm text-white/40 hover:text-white transition-all duration-200 font-medium w-fit"
              >
                <span className="w-1 h-px bg-white/15 group-hover:bg-[#ec4899] group-hover:w-3 transition-all duration-300" />
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* WhatsApp CTA — 4 cols */}
        <div className="md:col-span-4 flex flex-col">
          <h3 className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/25 mb-5">Novedades</h3>
          <p className="text-sm text-white/30 font-light leading-relaxed mb-6">
            Alertas de ubicación, nuevos menús y eventos especiales — directo a tu WhatsApp.
          </p>
          <a
            href="https://wa.me/56967270078?text=Hola%20Boa%20Noite%2C%20quiero%20recibir%20novedades%20%E2%98%95"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          >
            <span className="flex items-center gap-2">
              <MessageCircle size={14} />
              Recibir novedades
            </span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
          <p className="text-[10px] text-white/20 mt-3 font-light">Contacto directo, sin intermediarios.</p>
        </div>
      </div>

      {/* ── Copyright ─────────────────────────────────────── */}
      <div className="relative z-10 container mx-auto px-6 lg:px-14 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-white/20 uppercase tracking-widest font-medium">
          © {new Date().getFullYear()} Boa Noite · Santiago de Chile
        </p>
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] animate-pulse" />
          <span className="text-[10px] text-white/20 uppercase tracking-widest">Café de Especialidad · Zona Oriente</span>
        </div>
      </div>

    </footer>
  );
}
