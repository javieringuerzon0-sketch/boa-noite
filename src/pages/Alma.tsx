import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollLink } from '../components/ui/ScrollLink';

/* ─────────────────────────────────────────────────────────────
   HOOK — Intersection Observer for scroll-triggered animations
───────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─────────────────────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const CHAPTERS = [
  {
    year: '2022',
    title: 'La chispa',
    border: 'border-l-[#ec4899]',
    yearColor: 'text-[#ec4899]',
    text:
      'Ignacio y Mane se conocieron en la Universidad estudiando Ingeniería Comercial. Compartían algo más que las aulas: una obsesión compartida por los festivales de música, el aire libre y una forma de vivir más consciente. En cada evento al que asistían, notaban lo mismo — la gastronomía era la parte olvidada de algo que debería ser mágico. El café era aguado, los helados eran industriales, y los stands parecían un afterthought.',
  },
  {
    year: '2023',
    title: 'La decisión',
    border: 'border-l-[#2dd4bf]',
    yearColor: 'text-[#2dd4bf]',
    text:
      'Después de un festival en el que el café tardó 20 minutos y sabía a nada, Ignacio miró a Mane y dijo: "Podemos hacerlo mejor." No fue solo una idea — fue una certeza. Tomaron sus conocimientos de Ingeniería Comercial y los pusieron al servicio de algo que amaban: crear experiencias. Consiguieron un camión clásico, lo convirtieron en el icónico vehículo de rayas rosas y turquesa que hoy recorre Santiago, y lo llamaron Boa Noite — "Buenas Noches" en portugués — un guiño a las noches mágicas en festivales brasileños que los habían inspirado.',
  },
  {
    year: '2024–Hoy',
    title: 'El movimiento',
    border: 'border-l-neon-purple',
    yearColor: 'text-neon-purple',
    text:
      'Hoy Boa Noite recorre la zona oriente de Santiago con café de especialidad, helados artesanales y una estética que convierte cada evento en algo memorable. No son solo un food truck — son una declaración de que la experiencia gastronómica merece el mismo cuidado que la música, el arte y el ambiente. Cada taza, cada cono, cada detalle del truck lleva la firma de dos personas que decidieron que lo ordinario simplemente no era suficiente.',
  },
];

const VALORES = [
  {
    icon: '✦',
    gradient: 'from-[#ec4899] to-[#c026d3]',
    title: 'Calidad sin compromiso',
    desc: 'Solo usamos ingredientes de grado especialidad. El café viene de orígenes únicos seleccionados cada semana. Los helados se preparan en el truck. Nada industrial. Nunca.',
  },
  {
    icon: '◈',
    gradient: 'from-neon-purple to-neon-blue',
    title: 'Experiencia sobre todo',
    desc: 'El espacio, la estética, el detalle visual — todo importa. Un buen café en un entorno feo sigue siendo una experiencia mediocre. Nosotros cuidamos el todo.',
  },
  {
    icon: '◎',
    gradient: 'from-[#2dd4bf] to-neon-blue',
    title: 'Movimiento y naturaleza',
    desc: 'No tenemos local fijo porque el mundo es nuestro local. Vamos a ti, a tus espacios abiertos, a tus festivales. Somos tan libres como los eventos que servimos.',
  },
];

const MILESTONES = [
  { year: '2022', text: 'Primera idea después de un festival en Santiago' },
  { year: 'Mar 2023', text: 'Adquisición y transformación del truck' },
  { year: 'Jun 2023', text: 'Primer evento oficial en Parque Araucano' },
  { year: 'Sep 2023', text: 'Debut en estadio con 8,000 asistentes' },
  { year: 'Ene 2024', text: 'Incorporación al circuito de festivales de verano' },
  { year: '2025', text: 'Expansión a eventos corporativos y festivales masivos' },
  { year: '2026', text: 'Referente de café de especialidad móvil en RM' },
];

/* ─────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────── */
export function Alma() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] overflow-x-hidden">

      {/* ── AMBIENT GLOWS — fixed, decorative ─────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="animate-glow-pulse absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c026d3 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="animate-glow-pulse absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '2s' }}
        />
        <div
          className="animate-glow-pulse absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '4s' }}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">

        {/* Background image — van full color, fetchpriority high para carga inmediata */}
        <img
          src="/hero-van2-hq.jpg"
          alt="Boa Noite van"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />

        {/* Overlay mínimo — preserva colores de la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/35 via-transparent to-transparent" />

        {/* Scan line effect */}
        <div
          className="animate-scan absolute inset-0 w-full h-px bg-gradient-to-r from-transparent via-[#ec4899]/30 to-transparent opacity-60"
          style={{ top: '0' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />

        {/* Content — bottom-left aligned */}
        <div className="relative z-10 w-full px-10 sm:px-14 pb-24 pt-32 flex flex-col items-start justify-end min-h-screen max-w-3xl">

          {/* Eyebrow */}
          <div className="animate-fade-up delay-100 inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ec4899]" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ec4899]">
              Boa Noite · La Historia
            </span>
          </div>

          {/* Main title */}
          <h1 className="animate-fade-up delay-200 text-6xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter leading-none mb-5">
            <span className="block text-white">El Alma de</span>
            <span className="block gradient-text-purple-blue text-glow-purple">
              Boa Noite
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-300 text-base sm:text-lg text-white/60 font-light tracking-wide max-w-md mb-10">
            Dos ingenieros comerciales, un sueño sobre ruedas
            <br />
            <span className="text-[#2dd4bf]/80">y una obsesión por hacerlo bien.</span>
          </p>

          {/* Stats row */}
          <div className="animate-fade-up delay-500 flex items-center justify-start gap-8 sm:gap-14 mb-0 flex-wrap">
            {[
              { val: '2022', label: 'Fundado' },
              { val: '100%', label: 'Café de Especialidad' },
              { val: '∞', label: 'Eventos' },
              { val: '1', label: 'Truck Icónico' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text-purple-blue leading-none">{s.val}</div>
                <div className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="animate-fade-up delay-700 flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-semibold">Descubre nuestra historia</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
            <div
              className="w-5 h-5 border border-white/20 rounded-full flex items-center justify-center"
              style={{ animation: 'float 2s ease-in-out infinite' }}
            >
              <div className="w-1 h-1 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Pink + teal corner accents */}
        <div className="absolute top-32 left-8 w-px h-20 bg-gradient-to-b from-[#ec4899]/60 to-transparent" />
        <div className="absolute top-32 left-8 w-20 h-px bg-gradient-to-r from-[#ec4899]/60 to-transparent" />
        <div className="absolute bottom-20 right-8 w-px h-20 bg-gradient-to-t from-[#2dd4bf]/60 to-transparent" />
        <div className="absolute bottom-20 right-8 w-20 h-px bg-gradient-to-l from-[#2dd4bf]/60 to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — ORIGEN (The Story)
      ════════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">

        {/* Grid background */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="relative z-10 container mx-auto px-6 lg:px-14 max-w-7xl">

          {/* Header */}
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-neon-purple" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-neon-purple">02 · Origen</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-neon-purple" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter text-white leading-none">
              Cómo nació
              <br />
              <span className="gradient-text-purple-blue">todo esto</span>
            </h2>
          </Reveal>

          {/* Split layout: pull quote + chapters */}
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

            {/* Pull quote — left */}
            <Reveal delay={100} className="lg:col-span-2 lg:sticky lg:top-32">
              <div className="relative">
                {/* Giant decorative quote mark */}
                <div
                  className="absolute -top-6 -left-4 text-[12rem] font-extrabold leading-none select-none pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #c026d3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    opacity: 0.25,
                  }}
                >
                  "
                </div>
                <div className="glass-strong rounded-2xl p-8 border border-[#ec4899]/20">
                  <blockquote className="text-2xl sm:text-3xl font-extrabold leading-tight text-white tracking-tight mb-6">
                    "Queríamos que cada taza<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>contara algo.</span>"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-gradient-to-r from-[#ec4899] to-transparent" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-white/50">
                      Ignacio Mac-Farlane
                    </span>
                  </div>
                </div>

                {/* Decorative badge */}
                <div className="mt-6 glass rounded-xl p-4 border border-[#2dd4bf]/20">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{ background: 'linear-gradient(135deg, #ec4899, #2dd4bf)' }}
                    >
                      🎵
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white/80">Inspirado en</div>
                      <div className="text-xs text-white/40 tracking-wide">Festivales de Brasil · 2021</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Chapters — right */}
            <div className="lg:col-span-3 space-y-6">
              {CHAPTERS.map((ch, i) => (
                <Reveal key={ch.year} delay={i * 120}>
                  <div className={`glass rounded-2xl p-7 border-l-4 ${ch.border} border-t border-r border-b border-white/5 group hover:border-white/10 transition-all duration-500`}>
                    <div className="flex items-start gap-5">
                      {/* Year pill */}
                      <div className="shrink-0 pt-1">
                        <span className={`text-[11px] font-extrabold tracking-[0.3em] uppercase ${ch.yearColor} block`}>
                          {ch.year}
                        </span>
                        <div className={`mt-2 w-6 h-px bg-gradient-to-r ${
                          i === 0 ? 'from-[#ec4899]' : i === 1 ? 'from-[#2dd4bf]' : 'from-neon-purple'
                        } to-transparent`} />
                      </div>
                      {/* Content */}
                      <div>
                        <h3 className="text-lg font-extrabold uppercase tracking-tight text-white mb-3">
                          {ch.title}
                        </h3>
                        <p className="text-sm text-white/55 leading-relaxed font-light">
                          {ch.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — FOUNDERS
      ════════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">

        {/* Pink ambient background */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-8 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #ec4899 0%, transparent 70%)', filter: 'blur(100px)' }}
        />

        <div className="relative z-10 container mx-auto px-6 lg:px-14 max-w-6xl">

          {/* Header */}
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ec4899]" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ec4899]">03 · Fundadores</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#ec4899]" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter text-white leading-none">
              Las personas
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>detrás del truck</span>
            </h2>
            <p className="mt-6 text-sm text-white/45 max-w-md mx-auto leading-relaxed font-light">
              Ingenieros Comerciales convertidos en artesanos de la experiencia gastronómica.
            </p>
          </Reveal>

          {/* Founders grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* IGNACIO */}
            <Reveal delay={0} className="h-full">
              <div className="group relative rounded-3xl overflow-hidden transition-all duration-700 cursor-default h-full flex flex-col bg-[#09090b]"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(236,72,153,0.15), 0 0 80px rgba(236,72,153,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Photo */}
                <div className="relative h-[420px] overflow-hidden">
                  <img
                    src="/ignacio3.png"
                    alt="Ignacio Mac-Farlane, Fundador de Boa Noite"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay at bottom of photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent" />

                  {/* Role badge floating on photo */}
                  <div className="absolute top-5 left-5">
                    <div className="glass-dark rounded-full px-4 py-1.5 border border-[#ec4899]/30">
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ec4899]">Founder</span>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-5 right-5 w-px h-8 bg-gradient-to-b from-[#ec4899]/60 to-transparent" />
                  <div className="absolute top-5 right-5 w-8 h-px bg-gradient-to-l from-[#ec4899]/60 to-transparent" />
                </div>

                {/* Info below */}
                <div className="bg-[#09090b] p-7 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-extrabold uppercase tracking-tighter text-white leading-tight">
                        Ignacio
                      </h3>
                      <h3 className="text-2xl font-extrabold uppercase tracking-tighter text-white/70 leading-tight">
                        Mac-Farlane
                      </h3>
                      <div className="mt-1 text-xs text-white/35 font-medium tracking-widest uppercase">
                        Ingeniero Comercial
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[#ec4899]/30 flex items-center justify-center text-lg">
                      ☕
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm text-white/60 leading-relaxed italic border-l-2 border-[#ec4899]/40 pl-4 mb-6 font-light">
                    "Queríamos que cada taza contara algo. Que cada evento tuviera alma."
                  </blockquote>

                  {/* Passion tags */}
                  <div className="flex flex-wrap gap-2">
                    {['🌿 Naturaleza', '🎵 Música', '☕ Café de especialidad'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold tracking-wide px-3 py-1.5 rounded-full border border-white/8 text-white/50 glass"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* MANE */}
            <Reveal delay={150} className="h-full">
              <div className="group relative rounded-3xl overflow-hidden transition-all duration-700 cursor-default h-full flex flex-col bg-[#09090b]"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(45,212,191,0.15), 0 0 80px rgba(45,212,191,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Photo */}
                <div className="relative h-[420px] overflow-hidden">
                  <img
                    src="/mane.jpg"
                    alt="Mane Irágüen, Co-founder de Boa Noite"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent" />

                  {/* Role badge */}
                  <div className="absolute top-5 left-5">
                    <div className="glass-dark rounded-full px-4 py-1.5 border border-[#2dd4bf]/30">
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#2dd4bf]">Co-founder</span>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-5 right-5 w-px h-8 bg-gradient-to-b from-[#2dd4bf]/60 to-transparent" />
                  <div className="absolute top-5 right-5 w-8 h-px bg-gradient-to-l from-[#2dd4bf]/60 to-transparent" />
                </div>

                {/* Info below */}
                <div className="bg-[#09090b] p-7 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-extrabold uppercase tracking-tighter text-white leading-tight">
                        Mane
                      </h3>
                      <h3 className="text-2xl font-extrabold uppercase tracking-tighter text-white/70 leading-tight">
                        Irágüen
                      </h3>
                      <div className="mt-1 text-xs text-white/35 font-medium tracking-widest uppercase">
                        Ingeniera Comercial
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[#2dd4bf]/30 flex items-center justify-center text-lg">
                      🌿
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm text-white/60 leading-relaxed italic border-l-2 border-[#2dd4bf]/40 pl-4 mb-6 font-light">
                    "Si el espacio es bonito y el café es bueno, la gente siempre vuelve."
                  </blockquote>

                  {/* Passion tags */}
                  <div className="flex flex-wrap gap-2">
                    {['🌿 Naturaleza', '🎵 Música', '✨ Vida sana'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold tracking-wide px-3 py-1.5 rounded-full border border-white/8 text-white/50 glass"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Shared credential banner */}
          <Reveal delay={200} className="mt-10">
            <div className="glass-strong rounded-2xl p-6 border border-white/6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)' }}
              >
                🎓
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide uppercase">Ingenieros Comerciales · Universidad Diego Portales</div>
                <div className="text-xs text-white/40 mt-1 font-light">Formación académica al servicio de una experiencia gastronómica premium.</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-extrabold gradient-text-purple-blue">2+</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/35">años juntos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold" style={{
                    background: 'linear-gradient(135deg, #ec4899, #2dd4bf)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>1</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/35">truck icónico</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — VALORES
      ════════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="relative z-10 container mx-auto px-6 lg:px-14 max-w-6xl">

          {/* Header */}
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-neon-blue" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-neon-blue">04 · Valores</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-neon-blue" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter text-white leading-none">
              Lo que nos
              <br />
              <span className="gradient-text-blue-purple">define</span>
            </h2>
          </Reveal>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {VALORES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="group glass-strong rounded-2xl p-8 border border-white/6 hover:border-white/14 transition-all duration-500 h-full flex flex-col gap-6"
                  style={{ transition: 'all 0.5s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(192,38,211,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold transition-transform duration-500 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-from, #ec4899), var(--tw-gradient-to, #2dd4bf))` }}
                  >
                    <span
                      className="font-extrabold text-white"
                      style={{ fontSize: '1.4rem', lineHeight: 1 }}
                    >
                      {v.icon}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      className="text-xl font-extrabold uppercase tracking-tighter leading-tight mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${
                          i === 0 ? '#ec4899, #c026d3' :
                          i === 1 ? '#c026d3, #38bdf8' :
                          '#2dd4bf, #38bdf8'
                        })`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {v.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {v.desc}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div
                      className="h-px w-12 transition-all duration-500 group-hover:w-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${
                          i === 0 ? '#ec4899, #c026d3' :
                          i === 1 ? '#c026d3, #38bdf8' :
                          '#2dd4bf, #38bdf8'
                        })`,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — EL TRUCK
      ════════════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">

        <div className="relative z-10 container mx-auto px-6 lg:px-14 max-w-7xl">

          {/* Header */}
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ec4899]" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ec4899]">05 · El Truck</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#ec4899]" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter text-white leading-none">
              El vehículo
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>de lo memorable</span>
            </h2>
          </Reveal>

          {/* Full-width truck image + overlay stats */}
          <Reveal delay={100}>
            <div className="relative rounded-3xl overflow-hidden border border-white/8 min-h-[480px]">
              <img
                src="/helado.jpg"
                alt="Helado artesanal Boa Noite"
                className="w-full h-full object-cover object-center"
                style={{ minHeight: '480px' }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/90 via-[#09090b]/50 to-[#09090b]/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent" />

              {/* Pink + teal corner decorations matching the truck */}
              <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-[#ec4899]/80 to-transparent" />
              <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-[#ec4899]/80 to-transparent" />
              <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-[#2dd4bf]/80 to-transparent" />
              <div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-[#2dd4bf]/80 to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 lg:p-16">

                {/* Top text */}
                <div className="max-w-lg">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tighter text-white leading-none mb-4">
                    2 fundadores<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #ec4899, #2dd4bf)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>1 truck</span><br />
                    Miles de sonrisas
                  </div>
                  <p className="text-sm text-white/50 font-light max-w-sm leading-relaxed">
                    De rayas rosas y turquesa, el truck de Boa Noite es inconfundible. Diseñado para ser tan memorable como lo que sirve.
                  </p>
                </div>

                {/* Bottom stats row */}
                <div className="flex flex-wrap gap-6 sm:gap-10">
                  {[
                    { val: '2', label: 'Fundadores', color: '#ec4899' },
                    { val: '1', label: 'Truck único', color: '#2dd4bf' },
                    { val: '100%', label: 'Especialidad', color: '#c026d3' },
                    { val: '+100', label: 'Eventos realizados', color: '#38bdf8' },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-dark rounded-xl px-5 py-3 border border-white/6">
                      <div className="text-2xl font-extrabold leading-none" style={{ color: stat.color }}>{stat.val}</div>
                      <div className="text-[9px] uppercase tracking-widest text-white/40 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Timeline milestones */}
          <Reveal delay={150} className="mt-12">
            <div className="glass rounded-2xl p-8 border border-white/6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#ec4899]" />
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-white/60">Línea de tiempo</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MILESTONES.map((m, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    {/* Node */}
                    <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 group-hover:scale-125"
                        style={{
                          borderColor: i % 2 === 0 ? '#ec4899' : '#2dd4bf',
                          backgroundColor: i % 2 === 0 ? 'rgba(236,72,153,0.2)' : 'rgba(45,212,191,0.2)',
                        }}
                      />
                      {i < MILESTONES.length - 1 && (
                        <div className="w-px h-4 bg-white/10" />
                      )}
                    </div>
                    {/* Text */}
                    <div>
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: i % 2 === 0 ? '#ec4899' : '#2dd4bf' }}
                      >
                        {m.year}
                      </span>
                      <p className="text-xs text-white/50 font-light mt-0.5 leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 6 — CTA
      ════════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(192,38,211,0.12) 0%, rgba(56,189,248,0.06) 50%, transparent 80%)',
          }}
        />

        {/* Grid */}
        <div className="absolute inset-0 grid-overlay opacity-15" />

        {/* Pink + teal horizontal lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ec4899]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2dd4bf]/30 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 lg:px-14 max-w-4xl text-center">

          <Reveal>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 glass-dark rounded-full px-5 py-2.5 border border-white/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-white/60">Disponible para eventos</span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase tracking-tighter leading-none text-white mb-6">
              ¿Quieres a Boa Noite
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #c026d3 50%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>en tu evento?</span>
            </h2>

            <p className="text-sm sm:text-base text-white/45 font-light leading-relaxed max-w-lg mx-auto mb-12">
              Llevamos el café de especialidad y los helados artesanales directamente a ti.
              Estadios, festivales, bodas, corporativos — donde sea que estés, estamos.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ScrollLink
                to="/contacto"
                className="group relative overflow-hidden rounded-sm text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 text-white inline-flex items-center gap-2"
              >
                <span
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #c026d3 50%, #2dd4bf 100%)' }}
                />
                <span className="absolute inset-0 animate-shimmer" />
                <span className="relative z-10">Agenda tu evento →</span>
              </ScrollLink>

              <ScrollLink
                to="/menu"
                className="glass-strong text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 rounded-sm text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 inline-flex items-center gap-2"
              >
                Ver el menú
              </ScrollLink>
            </div>

            {/* Social proof strip */}
            <div className="mt-16 flex items-center justify-center gap-8 flex-wrap">
              {[
                { icon: '⭐', text: '4.9 · 2,400+ reseñas' },
                { icon: '📍', text: 'Zona oriente · Santiago' },
                { icon: '🎵', text: 'Festivales · Estadios · Eventos' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[10px] font-semibold tracking-wide text-white/35 uppercase">{item.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
