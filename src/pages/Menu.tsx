import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollLink } from '../components/ui/ScrollLink';
import { ArrowRight, Coffee, IceCream, Cookie } from 'lucide-react';

/* ─── Categories ─────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'bebidas', num: '01', label: 'Bebidas',  icon: Coffee,   accent: '#ec4899' },
  { id: 'helados', num: '02', label: 'Helados',  icon: IceCream, accent: '#2dd4bf' },
  { id: 'dulces',  num: '03', label: 'Dulces',   icon: Cookie,   accent: '#c026d3' },
];

/* ─── Products ───────────────────────────────────────────── */
const BEBIDAS = [
  {
    name: 'Café Americano',
    desc: 'Café negro de especialidad, limpio y equilibrado. La base de todo lo que hacemos.',
    tag: 'Clásico',
    img: '/menu/cafe-americano.jpg',
    wide: true,
  },
  {
    name: 'Café Sabores',
    desc: 'Cappuccino, vainilla, mocaccino o chocolate caliente. Elige tu versión favorita.',
    tag: 'Cappuccino · Vainilla · Mocaccino · Chocolate',
    img: '/menu/cafe-sabores.jpg',
    wide: false,
  },
  {
    name: 'Té',
    desc: 'Selección de tés naturales. La opción perfecta para quienes prefieren algo suave y aromático.',
    tag: 'Natural',
    img: '/menu/te.jpg',
    wide: false,
  },
  {
    name: 'Agua',
    desc: 'Con o sin gas. Bien fría, siempre disponible para acompañar cualquier experiencia en el truck.',
    tag: 'Con o Sin Gas',
    img: '/menu/agua.jpg',
    wide: false,
  },
  {
    name: 'Coca Cola',
    desc: 'Normal o Zero. El clásico de siempre para los que prefieren algo frío y efervescente.',
    tag: 'Normal · Zero',
    img: '/menu/coca-cola.jpg',
    wide: false,
  },
];

const HELADOS = [
  {
    name: 'Soft de Chocolate',
    desc: 'Helado suave de chocolate intenso, servido en cono o vaso. Cremoso, sin pretensiones.',
    tag: 'El Más Pedido',
    img: '/menu/soft-chocolate.jpg',
    wide: false,
  },
  {
    name: 'Soft de Vainilla',
    desc: 'Vainilla suave y cremosa. Simple, honesta y siempre perfecta con cualquier topping.',
    tag: 'Clásico',
    img: '/menu/soft-vainilla.jpg',
    wide: false,
  },
  {
    name: 'Soft Mixto',
    desc: 'Lo mejor de ambos mundos — vainilla y chocolate en un solo cono. El favorito de los eventos.',
    tag: 'Vainilla & Chocolate',
    img: '/menu/soft-mixto.jpg',
    wide: true,
  },
];

const DULCES = [
  {
    name: 'Cuchuflí de Manjar',
    desc: 'Barquillo crujiente relleno de manjar, bañado en chocolate. El snack chileno más icónico, elevado.',
    tag: 'Bañado en Chocolate',
    img: '/menu/cuchufli.jpg',
    wide: true,
  },
  {
    name: 'Muffin de Vainilla',
    desc: 'Esponjoso por dentro, dorado por fuera. Con chips de chocolate en cada bocado.',
    tag: 'Chips de Chocolate',
    img: '/menu/muffin-vainilla.jpg',
    wide: false,
  },
  {
    name: 'Muffin de Arándano',
    desc: 'Masa suave con arándanos frescos incrustados. Húmedo, aromático y siempre a punto.',
    tag: 'Artesanal',
    img: '/menu/muffin-arandano.jpg',
    wide: false,
  },
  {
    name: 'Muffin de Chocolate',
    desc: 'Intenso y húmedo, con ganache de chocolate y chips en cada capa. Para los amantes del cacao.',
    tag: 'Chocolate Intenso',
    img: '/menu/muffin-chocolate.jpg',
    wide: false,
  },
];

const TOPPINGS = ['M&M\'s', 'Galletas Oreo', 'Obleas'];

const SECTIONS: Record<string, typeof BEBIDAS> = {
  bebidas: BEBIDAS, helados: HELADOS, dulces: DULCES,
};

/* ─── Product card ───────────────────────────────────────── */
function ProductCard({ item, accent }: {
  item: typeof BEBIDAS[0];
  accent: string;
}) {
  return (
    /* outline en vez de inset box-shadow — no produce artefactos sub-pixel con rounded + overflow */
    <div
      className={`group relative rounded-3xl overflow-hidden ${item.wide ? 'md:col-span-2' : 'md:col-span-1'}`}
      style={{
        minHeight: item.wide ? '400px' : '340px',
        outline: '1px solid rgba(255,255,255,0.06)',
        outlineOffset: '-1px',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.outline = '1px solid rgba(255,255,255,0.14)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.outline = '1px solid rgba(255,255,255,0.06)'; }}
    >
        {/* Image — scale via Tailwind, backface-hidden para suavizar animación */}
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-[1.02] group-hover:scale-110"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-[#09090b]/5" />

      {/* Tag */}
      <div className="absolute top-5 left-5 z-10">
        <span
          className="text-[9px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border"
          style={{ color: accent, borderColor: `${accent}40`, background: `${accent}14` }}
        >
          {item.tag}
        </span>
      </div>

      {/* Corner accent */}
      <div className="absolute top-5 right-5 w-px h-6 opacity-50 z-10" style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }} />
      <div className="absolute top-5 right-5 w-6 h-px opacity-50 z-10" style={{ background: `linear-gradient(to left, ${accent}, transparent)` }} />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
        <h3 className="text-2xl font-extrabold uppercase tracking-tighter text-white leading-tight mb-2">
          {item.name}
        </h3>
        <p className="text-sm text-white/55 font-light leading-relaxed max-w-sm">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export function Menu() {
  const [activeId, setActiveId] = useState('bebidas');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    CATEGORIES.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">

      {/* ── AMBIENT GLOWS ─────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 px-6 lg:px-14 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-15" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ec4899]/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className="inline-flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ec4899]" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ec4899]">Cafetería & Heladería</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-end">
            <div>
              <h1 className="text-7xl sm:text-8xl lg:text-[9rem] font-extrabold uppercase tracking-tighter leading-none">
                <span className="block text-white">Nuestra</span>
                <span className="block" style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Carta</span>
              </h1>
            </div>
            <div className="lg:pb-4">
              <p className="text-lg text-white/40 font-light leading-relaxed max-w-md">
                Café americano y sabores especiales, helados soft artesanales, cuchuflíes de manjar con chocolate y muffins recién hechos.
              </p>
              <p className="text-sm text-white/25 font-light mt-4">
                Todo elaborado con ingredientes seleccionados. Disponible en el truck y en tu próximo evento.
              </p>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-3 mt-14">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const active = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollTo(cat.id)}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg select-none cursor-pointer"
                  style={{
                    borderColor: active ? cat.accent : `${cat.accent}30`,
                    color: active ? '#fff' : cat.accent,
                    background: active ? cat.accent : `${cat.accent}0a`,
                    boxShadow: active ? `0 0 20px ${cat.accent}50` : undefined,
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.background = `${cat.accent}22`;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${cat.accent}80`;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 16px ${cat.accent}35`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.background = `${cat.accent}0a`;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${cat.accent}30`;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                    }
                  }}
                >
                  <Icon size={14} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BODY — sticky nav + sections
      ══════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14 py-20 lg:flex lg:gap-20">

        {/* Sticky sidebar */}
        <aside className="hidden lg:block w-44 shrink-0">
          <div className="sticky top-28 flex flex-col gap-1">
            <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4">Secciones</p>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const active = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollTo(cat.id)}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:translate-x-1 active:scale-95 select-none cursor-pointer"
                  style={{
                    background: active ? `${cat.accent}18` : 'transparent',
                    borderLeft: `2px solid ${active ? cat.accent : 'transparent'}`,
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = `${cat.accent}10`;
                      el.style.borderLeft = `2px solid ${cat.accent}50`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = 'transparent';
                      el.style.borderLeft = '2px solid transparent';
                    }
                  }}
                >
                  <Icon
                    size={14}
                    className="transition-all duration-200 group-hover:scale-125"
                    style={{ color: active ? cat.accent : 'rgba(255,255,255,0.2)' }}
                  />
                  <span
                    className="text-xs font-semibold tracking-wide transition-colors duration-200"
                    style={{ color: active ? 'white' : 'rgba(255,255,255,0.3)' }}
                  >
                    {cat.label}
                  </span>
                  {active && (
                    <span
                      className="ml-auto w-1 h-1 rounded-full shrink-0"
                      style={{ background: cat.accent, boxShadow: `0 0 6px ${cat.accent}` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Sections */}
        <div className="flex-1 space-y-32">
          {CATEGORIES.map(cat => {
            const items = SECTIONS[cat.id];
            const Icon  = cat.icon;
            return (
              <section
                key={cat.id}
                id={cat.id}
                ref={el => { sectionRefs.current[cat.id] = el; }}
                className="scroll-mt-28"
              >
                {/* Chapter header */}
                <div className="mb-12 flex items-end gap-6">
                  <div className="relative">
                    <span className="absolute -top-8 -left-2 text-[8rem] font-extrabold leading-none select-none pointer-events-none"
                      style={{ color: `${cat.accent}10` }}>
                      {cat.num}
                    </span>
                    <div className="relative flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: `${cat.accent}18`, border: `1px solid ${cat.accent}30` }}>
                        <Icon size={20} style={{ color: cat.accent }} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold tracking-[0.4em] uppercase mb-1" style={{ color: cat.accent }}>
                          {cat.num}
                        </div>
                        <h2 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tighter text-white leading-none">
                          {cat.label}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 hidden sm:block">
                    <div className="h-px" style={{ background: `linear-gradient(to right, ${cat.accent}40, transparent)` }} />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items.map((item, i) => (
                    <ProductCard key={i} item={item} accent={cat.accent} />
                  ))}
                </div>

                {/* Toppings note for helados */}
                {cat.id === 'helados' && (
                  <div className="mt-6 glass rounded-2xl px-6 py-4 border border-[#2dd4bf]/15 inline-flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
                    <p className="text-sm text-white/45 font-light">
                      Todos los helados pueden llevar toppings:{' '}
                      {TOPPINGS.map((t, i) => (
                        <span key={t}>
                          <span className="text-[#2dd4bf]/80 font-medium">{t}</span>
                          {i < TOPPINGS.length - 1 && <span className="text-white/20"> · </span>}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CTA BOTTOM
      ══════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ec4899]/20 to-transparent" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ec4899]" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ec4899]">¿Lo quieres en tu evento?</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#ec4899]" />
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter leading-none mb-8 text-white">
            Llevamos toda<br />
            <span style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>la carta a ti.</span>
          </h2>

          <p className="text-base text-white/40 font-light mb-12 max-w-md mx-auto leading-relaxed">
            Matrimonios, eventos corporativos, festivales y cumpleaños en Santiago zona oriente. Personalizamos la oferta para cada ocasión.
          </p>

          <ScrollLink
            to="/contacto"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #ec4899, #c026d3)' }}
          >
            Agendar mi evento
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </ScrollLink>
        </div>
      </section>

    </div>
  );
}
