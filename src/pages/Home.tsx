import { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowRight, Star, Quote, Zap, Trophy, Coffee, IceCream, Users, Volume2, VolumeX, MapPin, Navigation, ChevronDown, CheckCircle, Truck, Loader2, Instagram, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollLink } from '../components/ui/ScrollLink';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTruckLocation, timeAgo, reverseGeocode, fetchLocationFromDB, syncLocationToDB, clearLocationInDB, subscribeToLocation } from '../use-cases/location';

// Static color map — prevents Tailwind from purging dynamic class names
const C = {
  'neon-blue': {
    tag: 'text-neon-blue border-neon-blue/30',
    text: 'text-neon-blue',
    hoverName: 'group-hover:text-neon-blue',
    btn: 'border-neon-blue/20 text-neon-blue hover:bg-neon-blue/8',
    glow60: 'via-neon-blue/60',
    glow50: 'via-neon-blue/50',
  },
  'neon-purple': {
    tag: 'text-neon-purple border-neon-purple/30',
    text: 'text-neon-purple',
    hoverName: 'group-hover:text-neon-purple',
    btn: 'border-neon-purple/20 text-neon-purple hover:bg-neon-purple/8',
    glow60: 'via-neon-purple/60',
    glow50: 'via-neon-purple/50',
  },
} as const;
type NeonColor = keyof typeof C;

/* ── Ticker items ───────────────────────────── */
const TICKER = [
  'HELADOS ARTESANALES', 'ESTADIOS & FESTIVALES', 'CATERING PREMIUM', 'BARISTA SCA',
  'FOOD TRUCK', 'EVENTOS DE DÍA', 'GRANO ESPECIALIDAD', 'CALIDAD PREMIUM',
  'MUFFINS', 'ESTADIOS & FESTIVALES', 'CATERING PREMIUM', 'CREA MOMENTOS',
  'FOOD TRUCK', 'EVENTOS DE DÍA', 'GRANO ESPECIALIDAD', 'CALIDAD PREMIUM',
];

/* ── Stats ───────────────────────────────────── */
const STATS = [
  { value: '100', unit: '+', label: 'Eventos Realizados' },
  { value: '6', unit: '+', label: 'Tipos de Eventos' },
  { value: '100', unit: '%', label: 'Café de Especialidad' },
  { value: '4.9', unit: '★', label: '2,400+ Reseñas' },
];

/* ── Features ────────────────────────────────── */
const FEATURES = [
  { icon: Trophy,   color: 'neon-purple', hex: '#a855f7', num: '01', label: 'Estadios & Eventos',       desc: 'Fútbol, festivales y grandes escenarios' },
  { icon: IceCream, color: 'neon-blue',   hex: '#2dd4bf', num: '02', label: 'Helados Soft Artesanales', desc: 'Cono suave de vainilla, chocolate o mixto' },
  { icon: Coffee,   color: 'neon-purple', hex: '#a855f7', num: '03', label: 'Grano SCA',                desc: 'Origen único, selección semana a semana' },
  { icon: Users,    color: 'neon-blue',   hex: '#2dd4bf', num: '04', label: 'Catering Premium',         desc: 'Bodas, corporativos y lanzamientos' },
];

/* ── Products ────────────────────────────────── */
const PRODUCTS = [
  {
    img: '/products/americano.jpg',
    tag: 'Clásico del Truck',
    tagColor: 'neon-blue',
    name: 'Café Americano',
    desc: 'Espresso de origen único con agua filtrada en el punto exacto. Directo, limpio y sin pretensiones.',
    accentColor: 'neon-blue',
  },
  {
    img: '/products/helado-estadio.jpg',
    tag: 'Artesanal',
    tagColor: 'neon-purple',
    name: 'Helado Artesanal',
    desc: 'Soft cremoso en barquillo crocante. Lo hacemos en el truck, en cada evento — estadios, festivales, donde estemos.',
    accentColor: 'neon-purple',
  },
  {
    img: '/products/muffin.jpg',
    tag: 'Horneado del Día',
    tagColor: 'neon-blue',
    name: 'Muffin de Chocolate',
    desc: 'Masa húmeda con chips de cacao real. Crujiente por fuera, fundente por dentro.',
    accentColor: 'neon-blue',
  },
];


/* ── Itinerario semanal ─────────────────────── */
const DAYS = [
  { day: 'LUN', loc: 'Vitacura',         hours: '10:00', closeHour: 18 },
  { day: 'MAR', loc: 'Las Condes',       hours: '10:00', closeHour: 18 },
  { day: 'MIÉ', loc: 'Providencia',     hours: '10:00', closeHour: 19 },
  { day: 'JUE', loc: 'La Dehesa',       hours: '10:00', closeHour: 19 },
  { day: 'VIE', loc: 'Parque Arauco',   hours: '10:00', closeHour: 20 },
  { day: 'SÁB', loc: 'Est. Monumental', hours: '10:00', closeHour: 21 },
  { day: 'DOM', loc: 'Ñuñoa',           hours: '10:00', closeHour: 18 },
];
const jsDow = new Date().getDay();
const todayIdx = jsDow === 0 ? 6 : jsDow - 1;

const eventSchema = z.object({
  name:      z.string().min(2),
  eventType: z.string().min(1),
  date:      z.string().min(1),
  email:     z.string().email(),
  notes:     z.string().optional(),
});
type EventForm = z.infer<typeof eventSchema>;

function pad2(n: number) { return String(n).padStart(2, '0'); }

function useCloseCountdown(closeHour: number) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!closeHour) return;
    const calc = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(closeHour, 0, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      setT({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [closeHour]);
  return t;
}

/* ── Próxima parada ──────────────────────── */
const NEXT_EVENT = {
  label: 'Próxima Parada',
  name: 'Lollapalooza Chile 2026',
  venue: 'Parque Bicentenario Cerrillos',
  city: 'Santiago · Chile',
  date: new Date('2026-03-28T12:00:00'),
};

/* ── Testimonios rotativos ───────────────── */
const TRUST_TESTIMONIALS = [
  {
    quote: 'Fue el mejor momento del partido. Un café y un helado artesanal en pleno estadio... eso no se olvida. Boa Noite tiene otro nivel.',
    name: 'Sofi Mac-Farlane',
    role: 'Hincha del Colo-Colo',
    event: 'Estadio Monumental',
  },
  {
    quote: 'Contratamos a Boa Noite para nuestro lanzamiento. Todos los asistentes preguntaron quiénes eran. Pura calidad y estética.',
    name: 'Felipe Andrade',
    role: 'Director Creativo · Agencia Norte',
    event: 'Lanzamiento Corporativo',
  },
  {
    quote: 'El truck llegó al festival y se formó fila en 10 minutos. El café más comentado de todo el evento, sin discusión.',
    name: 'Catalina Morales',
    role: 'Organizadora de Eventos',
    event: 'Lollapalooza Chile',
  },
];

/* ── Lazy video hook: play only when in viewport, serves mobile src on small screens ── */
/* Mutes video when leaving viewport to prevent multiple audio tracks on mobile */
function useLazyVideo(threshold = 0.15) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Ocultar video completamente hasta que tenga frames renderizados
    el.style.visibility = 'hidden';
    el.style.opacity = '0';
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const src = (isMobile && el.dataset.srcMobile) ? el.dataset.srcMobile : (el.dataset.src ?? el.src);
    let loaded = false;
    let ready = false;
    const show = () => {
      if (ready) return;
      ready = true;
      // Doble rAF asegura que el browser ya pintó el frame correcto con object-cover
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        });
      });
    };
    el.addEventListener('playing', show, { once: true });
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            el.muted = true;
            el.src = src;
            el.load();
            loaded = true;
          }
          el.play().catch(() => {});
        } else {
          el.pause();
          el.muted = true;
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => { obs.disconnect(); el.removeEventListener('playing', show); };
  }, [threshold]);
  return ref;
}

export function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const metaVideoRef = useLazyVideo(0.1);
  const ctaVideoRef  = useLazyVideo(0.05);

  // Set hero video source based on device — mostrar solo al reproducir
  useEffect(() => {
    const el = mainVideoRef.current;
    if (!el) return;
    el.addEventListener('playing', () => { el.style.opacity = '1'; }, { once: true });
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    el.src = isMobile ? '/boa-noite-hero-mobile.mp4' : '/boa-noite-hero.mp4';
    el.load();
    el.play().catch(() => {});
  }, []);

  // Scroll to hash on mount (handles /#ubicacion from footer)
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    // Solo desmutear videos visibles en viewport, mutear los que no
    const videos = [mainVideoRef.current, metaVideoRef.current, ctaVideoRef.current];
    videos.forEach(v => {
      if (!v) return;
      if (next) {
        // Muteando todo
        v.muted = true;
      } else {
        // Desmuteando — solo el que está en viewport
        const rect = v.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        v.muted = !inView;
      }
    });
  };

  // GPS + Supabase
  const { location, setLocation, clearLocation } = useTruckLocation();
  const [timeAgoStr,  setTimeAgoStr]  = useState('');
  const [gpsLoading,  setGpsLoading]  = useState(false);
  const [gpsError,    setGpsError]    = useState<string | null>(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [sending,     setSending]     = useState(false);
  const [sendError,   setSendError]   = useState<string | null>(null);
  const isAdmin = new URLSearchParams(window.location.search).get('mode') === 'truck';

  const todayDay   = DAYS[todayIdx];
  const nextDay    = DAYS[(todayIdx + 1) % 7];
  const closeCount = useCloseCountdown(todayDay.closeHour);
  const mapSrc     = location ? `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed` : null;

  const { register: regEvent, handleSubmit: hsEvent, formState: { errors: evErrors } } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: { eventType: 'Boda / Social' },
  });

  useEffect(() => {
    fetchLocationFromDB().then((loc) => { if (loc) setLocation(loc); });
    const unsub = subscribeToLocation((loc) => { if (loc) setLocation(loc); else clearLocation(); });
    return unsub;
  }, [setLocation, clearLocation]);

  useEffect(() => {
    if (!location) return;
    const tick = () => setTimeAgoStr(timeAgo(location.updatedAt));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [location]);

  const handleUpdateLocation = useCallback(async () => {
    setGpsLoading(true); setGpsError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 15000 })
      );
      const { latitude: lat, longitude: lng } = pos.coords;
      const address = await reverseGeocode(lat, lng);
      const loc = { lat, lng, address, updatedAt: new Date().toISOString(), isActive: true };
      setLocation(loc); await syncLocationToDB(loc);
    } catch { setGpsError('No se pudo obtener la ubicación.'); }
    finally { setGpsLoading(false); }
  }, [setLocation]);

  const onEventSubmit = async (data: EventForm) => {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `🌙 Solicitud de evento — ${data.name} · ${data.eventType}`,
          from_name: data.name,
          name: data.name,
          email: data.email,
          message:
            `Nombre: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Tipo de evento: ${data.eventType}\n` +
            `Fecha tentativa: ${data.date}\n` +
            `Mensaje: ${data.notes || '—'}`,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error('Error al enviar');
      setSubmitted(true);
    } catch {
      setSendError('No se pudo enviar. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  // Countdown al próximo evento
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = NEXT_EVENT.date.getTime() - Date.now();
      if (diff <= 0) { setCountdown({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Testimonios rotativos
  const [activeTesti, setActiveTesti] = useState(0);
  const [testiFade, setTestiFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setTestiFade(false);
      setTimeout(() => {
        setActiveTesti(p => (p + 1) % TRUST_TESTIMONIALS.length);
        setTestiFade(true);
      }, 350);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full bg-[#09090b] text-white overflow-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden" style={{ backgroundImage: 'url(/poster-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>

        {/* Video de fondo — 2K desktop, 1080p mobile, color grading baked */}
        <video
          ref={mainVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/poster-hero.jpg"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ willChange: 'transform', transform: 'translateZ(0)', opacity: 0 }}
        />

        {/* Overlay — mínimo, solo legibilidad del texto izquierdo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/60 via-[#09090b]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/60 via-transparent to-transparent" />


        {/* Content */}
        <div className="container mx-auto px-8 lg:px-16 relative z-10 pt-40 pb-32">
          <div className="max-w-xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
              <span className="text-white/60 font-medium tracking-[0.3em] text-[10px] uppercase">
                Food Truck · Eventos & Estadios
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-extrabold uppercase leading-[0.9] tracking-tight mb-6 animate-fade-up delay-100">
              <span className="block text-4xl md:text-5xl lg:text-6xl text-white">El Café que</span>
              <span className="block text-4xl md:text-5xl lg:text-6xl gradient-text-purple-blue">Eleva Cada</span>
              <span className="block text-4xl md:text-5xl lg:text-6xl text-white">Evento</span>
            </h1>

            <p className="text-white/50 text-sm mb-10 max-w-sm font-light leading-relaxed animate-fade-up delay-200">
              Café de especialidad y repostería artesanal sobre ruedas.
              Estadios, festivales, eventos corporativos — siempre al nivel más alto.
            </p>

            <div className="flex flex-wrap items-center gap-3 animate-fade-up delay-300">
              <ScrollLink to="/contacto" className="relative overflow-hidden rounded-sm group font-bold tracking-widest uppercase text-[10px] px-8 py-3.5 text-white inline-flex items-center gap-2">
                <span className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue transition-opacity group-hover:opacity-85" />
                <span className="absolute inset-0 animate-shimmer" />
                <span className="relative z-10 flex items-center gap-2">Agenda tu Evento <ArrowRight size={12} /></span>
              </ScrollLink>
              <ScrollLink to="/menu" className="rounded-sm font-bold tracking-widest uppercase text-[10px] px-8 py-3.5 text-white/60 border border-white/15 hover:border-neon-blue/40 hover:text-white transition-all duration-300 inline-flex items-center gap-2">
                Ver Menú
              </ScrollLink>
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          MARQUEE TICKER — social proof
      ══════════════════════════════════════════ */}
      <div className="relative border-y border-white/5 overflow-hidden py-4 bg-[#09090b]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-[#09090b] z-10 pointer-events-none" />
        <div className="flex animate-marquee whitespace-nowrap">
          {TICKER.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 mx-5 text-[10px] font-bold uppercase tracking-[0.25em]">
              <span className={i % 4 === 0 ? 'text-neon-purple' : i % 4 === 2 ? 'text-neon-blue' : 'text-gray-600'}>
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/0 via-neon-purple/3 to-[#09090b]/0 pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 py-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {STATS.map((s, i) => (
              <div key={i} className="px-8 py-6 md:py-0 flex flex-col gap-1 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-extrabold gradient-text-purple-blue leading-none">{s.value}</span>
                  <span className="text-lg font-extrabold text-neon-blue leading-none mb-0.5">{s.unit}</span>
                </div>
                <span className="text-[10px] font-medium text-gray-600 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONCEPT — #nosotros
      ══════════════════════════════════════════ */}
      <section id="nosotros" className="py-32 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-neon-purple/5 blur-[180px] pointer-events-none animate-glow-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-neon-blue/4 blur-[150px] pointer-events-none animate-glow-pulse delay-1000" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">

          {/* ── Section header (full-width) ── */}
          <div className="mb-16 animate-fade-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-neon-purple to-neon-blue rounded-full" />
              <p className="text-neon-blue font-bold tracking-[0.25em] text-[10px] uppercase">El truck que va donde la acción está</p>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.86] max-w-4xl">
              Del estadio al festival.<br />
              <span className="gradient-text-blue-purple">Café de élite en cada evento.</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-16">

            {/* ── Video card — sin padding, video llena toda la tarjeta ── */}
            <div className="w-full lg:w-[42%] relative group shrink-0">
              <div className="absolute -inset-px bg-gradient-to-br from-neon-purple/30 via-transparent to-neon-blue/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />

              {/* Aspect ratio container — video llena 100% sin padding */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/8 aspect-[4/5]"
                style={{ backgroundImage: 'url(/poster-meta.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <video
                  ref={metaVideoRef}
                  data-src="/boa-noite-meta.mp4"
                  data-src-mobile="/boa-noite-meta-mobile.mp4"
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0) scale(1.35)',
                    objectPosition: 'center 60%',
                  }}
                />

                {/* Overlay — legibilidad de badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />

                {/* Badge TL — Eventos */}
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 glass-dark rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-neon-purple/30 animate-float">
                  <Trophy size={13} className="text-neon-purple mb-1" />
                  <p className="text-white font-extrabold text-[9px] sm:text-[10px]">Eventos de Día</p>
                  <p className="text-gray-500 text-[8px] sm:text-[9px]">Estadios & Festivales</p>
                </div>

                {/* Btn TR — Mute toggle */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 glass-dark rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 border border-white/10 hover:border-neon-blue/40 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group/mute"
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={13} className="text-gray-500 group-hover/mute:text-white transition-colors" />
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover/mute:text-white transition-colors">Sonido</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} className="text-neon-blue" />
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-neon-blue">Silenciar</span>
                    </>
                  )}
                </button>

                {/* Badge BR — Rating */}
                <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 glass-dark rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-neon-purple/20 animate-float delay-500">
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={9} className="text-neon-purple fill-neon-purple" />)}
                  </div>
                  <p className="text-white font-extrabold text-[11px] sm:text-xs">4.9 / 5.0</p>
                  <p className="text-gray-500 text-[8px] sm:text-[9px] mt-0.5">2,400+ reseñas</p>
                </div>

                {/* Badge BL — Barista */}
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 glass-dark rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-neon-blue/25 animate-float delay-300">
                  <Coffee size={13} className="text-neon-blue mb-1" />
                  <p className="text-white font-extrabold text-[9px] sm:text-[10px]">Barista SCA</p>
                  <p className="text-gray-500 text-[8px] sm:text-[9px]">Certificación int'l</p>
                </div>
              </div>
            </div>

            {/* ── Texto + features ── */}
            <div className="w-full lg:flex-1 flex flex-col justify-center">

              <p className="text-gray-300 text-base leading-relaxed mb-4 font-light animate-fade-up delay-100">
                Grano de origen único. Barista con certificación SCA. Food truck con carácter editorial.
                Lo llevamos a estadios de fútbol, festivales, bodas, lanzamientos y eventos corporativos.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-10 font-light animate-fade-up delay-200">
                Cada taza es un acto de precisión contra lo genérico. No importa el formato del evento:
                traemos el mejor café a donde está la gente, sin perder un gramo de calidad.
              </p>

              {/* Feature grid — premium */}
              <div className="grid grid-cols-2 gap-3 mb-10 animate-fade-up delay-300">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="relative rounded-2xl p-5 border border-white/8 hover:-translate-y-1 transition-all duration-300 group cursor-default overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = `${f.hex}40`;
                        el.style.boxShadow = `0 0 24px ${f.hex}18, inset 0 0 24px ${f.hex}08`;
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = 'rgba(255,255,255,0.08)';
                        el.style.boxShadow = '';
                      }}
                    >
                      {/* Accent top line */}
                      <div
                        className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to right, transparent, ${f.hex}, transparent)` }}
                      />

                      {/* Number */}
                      <span
                        className="absolute top-4 right-4 text-[10px] font-black tracking-widest opacity-20 group-hover:opacity-60 transition-opacity duration-300"
                        style={{ color: f.hex }}
                      >
                        {f.num}
                      </span>

                      {/* Icon */}
                      <div
                        className="mb-4 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{ background: `${f.hex}14`, border: `1px solid ${f.hex}25` }}
                      >
                        <Icon size={16} style={{ color: f.hex }} />
                      </div>

                      <p className="font-extrabold text-sm text-white mb-1 leading-tight">{f.label}</p>
                      <p className="text-white/30 text-[10px] font-medium leading-relaxed group-hover:text-white/50 transition-colors duration-300">{f.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Dual CTA */}
              <div className="flex flex-wrap gap-3 animate-fade-up delay-400">
                <ScrollLink
                  to="/contacto"
                  className="relative overflow-hidden group font-bold tracking-widest uppercase text-xs px-8 py-4 rounded-sm text-white inline-flex items-center gap-2"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue opacity-80 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute inset-0 animate-shimmer" />
                  <span className="relative z-10 flex items-center gap-2">Agenda tu Evento <ArrowRight size={13} /></span>
                </ScrollLink>
                <ScrollLink
                  to="/menu"
                  className="glass font-bold tracking-widest uppercase text-xs px-8 py-4 rounded-sm text-gray-300 border border-white/10 hover:border-neon-purple/30 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  Ver el Menú
                </ScrollLink>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCTS SHOWCASE
      ══════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-neon-blue/5 blur-[160px] pointer-events-none animate-glow-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[130px] pointer-events-none animate-glow-pulse delay-700" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-neon-blue to-neon-purple rounded-full" />
                <p className="text-neon-blue font-bold tracking-[0.25em] text-[10px] uppercase">Nuestros Favoritos</p>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-[0.88]">
                Ediciones<br />
                <span className="gradient-text-purple-blue">Exclusivas</span>
              </h2>
            </div>
            <ScrollLink to="/menu" className="text-gray-500 hover:text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-colors group">
              Ver todo el menú
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </ScrollLink>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => {
              const cc = C[p.accentColor as NeonColor];
              const tc = C[p.tagColor as NeonColor];
              return (
                <div key={i}
                  className="group relative rounded-2xl overflow-hidden bg-[#09090b] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {/* Top glow line on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${cc.glow60} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Image — sin overflow-hidden separado para evitar línea sub-pixel */}
                  <div className="relative h-[420px]">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-bottom opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/10 to-transparent" />

                    {/* Tag */}
                    <div className={`absolute top-4 left-4 glass-dark text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${tc.tag}`}>
                      {p.tag}
                    </div>
                  </div>

                  {/* Body — bg match gradient para eliminar seam */}
                  <div className="p-6 bg-[#09090b] relative">
                    <h3 className={`font-extrabold text-lg text-white mb-2 ${cc.hoverName} transition-colors duration-300`}>
                      {p.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed font-light">{p.desc}</p>
                  </div>

                  {/* Ambient hover glow — sin inset para evitar artefactos sub-pixel */}
                  <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ boxShadow: `0 0 40px rgba(${p.accentColor === 'neon-blue' ? '56,189,248' : '192,38,211'},0.08)` }} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS — trust signals
      ══════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-neon-purple/5 blur-[180px] pointer-events-none animate-glow-pulse" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="overflow-hidden xl:bg-neutral-950/60 border border-white/20 border-dashed relative">

            {/* Background radial gradients + grid */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 opacity-70 [mask-image:radial-gradient(65%_65%_at_50%_50%,black,transparent)] bg-[radial-gradient(1200px_400px_at_50%_-10%,rgba(192,38,211,0.18),transparent),radial-gradient(1200px_600px_at_50%_120%,rgba(56,189,248,0.15),transparent)]" />
              <div className="absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)] bg-[linear-gradient(to_right,rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.7)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
            </div>

            {/* Content */}
            <div className="flex flex-col p-6 md:p-8 relative">

              {/* Section header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
                  Lo que vivieron<br />en cada evento.
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
                  Del primer sorbo al último minuto. La experiencia Boa Noite habla por sí sola.
                </p>
              </div>

              <div className="w-full">

                {/* Featured testimonial — 2 cols */}
                <div className="grid lg:grid-cols-2 gap-6 items-stretch">

                  {/* Photo panel */}
                  <div className="overflow-hidden min-h-[360px] bg-white/5 ring-1 ring-white/10 relative">
                    <img
                      src="/sofi-estadio.jpg"
                      alt="Sofi Mac-Farlane en el estadio"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent mix-blend-multiply" />
                  </div>

                  {/* Quote panel */}
                  <div className="flex flex-col sm:p-10 sm:bg-neutral-950 text-left bg-black/40 ring-1 ring-white/10 pt-8 pr-8 pb-8 pl-8 relative justify-center">
                    <div className="mb-4">
                      <Quote size={32} className="text-neon-purple" />
                    </div>
                    <p className="text-white font-extrabold tracking-tight text-2xl sm:text-3xl lg:text-4xl leading-snug">
                      "Fue el mejor momento del partido. Un café y un helado artesanal en pleno estadio... eso no se olvida. Boa Noite tiene otro nivel."
                    </p>
                    <div className="mt-8">
                      <div className="text-white text-base font-medium">Sofi Mac-Farlane</div>
                      <div className="text-zinc-400 text-sm mt-1">Hincha del Colo-Colo</div>
                    </div>
                  </div>
                </div>

                {/* 3 cards with 2 rotating testimonials each */}
                <div className="grid lg:grid-cols-3 mt-6 gap-6 relative" style={{ minHeight: '220px' }}>
                  <style>{`
                    @keyframes slideLoop {
                      0%   { opacity: 0; transform: translateY(30px); }
                      10%  { opacity: 1; transform: translateY(0); }
                      45%  { opacity: 1; transform: translateY(0); }
                      55%  { opacity: 0; transform: translateY(-30px); }
                      100% { opacity: 0; transform: translateY(-30px); }
                    }
                  `}</style>

                  {/* Card 1 — 2 testimonios alternados */}
                  <div className="flex flex-col xl:bg-neutral-950 text-left bg-white/5 ring-1 ring-white/10 p-6 overflow-hidden relative" style={{ minHeight: '200px' }}>
                    <div className="absolute inset-6" style={{ animation: 'slideLoop 10s ease-in-out 0s infinite' }}>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        "El truck llegó al festival y se formó una fila de 50 personas en 10 minutos. El café más comentado del evento."
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80" alt="Catalina" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 shrink-0" />
                        <div>
                          <div className="text-white text-sm font-medium">Catalina Morales</div>
                          <div className="text-zinc-500 text-xs">Organizadora @ FestivalMX</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-6" style={{ animation: 'slideLoop 10s ease-in-out 5s infinite' }}>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        "Pedí un muffin de chocolate y quedé sin palabras. No esperaba ese nivel artesanal en medio de un partido."
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80" alt="Fernanda" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 shrink-0" />
                        <div>
                          <div className="text-white text-sm font-medium">Fernanda Lagos</div>
                          <div className="text-zinc-500 text-xs">Asistente @ Estadio Monumental</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 — 2 testimonios alternados */}
                  <div className="flex flex-col xl:bg-neutral-950 text-left bg-white/5 ring-1 ring-white/10 p-6 overflow-hidden relative" style={{ minHeight: '200px' }}>
                    <div className="absolute inset-6" style={{ animation: 'slideLoop 10s ease-in-out 0s infinite' }}>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        "Contratamos a Boa Noite para nuestro lanzamiento. Todos los asistentes preguntaron quiénes eran. Pura calidad y estética."
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="Felipe" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 shrink-0" />
                        <div>
                          <div className="text-white text-sm font-medium">Felipe Andrade</div>
                          <div className="text-zinc-500 text-xs">Director Creativo @ Agencia Norte</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-6" style={{ animation: 'slideLoop 10s ease-in-out 5s infinite' }}>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        "El helado de chocolate después de un gol es otra experiencia. No sé cómo lo lograron pero el truck siempre está en el momento exacto."
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80" alt="Ignacio" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 shrink-0" />
                        <div>
                          <div className="text-white text-sm font-medium">Ignacio Bravo</div>
                          <div className="text-zinc-500 text-xs">Hincha @ Estadio San Carlos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 — 2 testimonios alternados */}
                  <div className="flex flex-col xl:bg-neutral-950 text-left bg-white/5 ring-1 ring-white/10 p-6 overflow-hidden relative" style={{ minHeight: '200px' }}>
                    <div className="absolute inset-6" style={{ animation: 'slideLoop 10s ease-in-out 0s infinite' }}>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        "Nunca pensé que en plena cancha iba a tomar un espresso de este nivel. Boa Noite cambió mis estándares para siempre."
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80" alt="Valentina" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 shrink-0" />
                        <div>
                          <div className="text-white text-sm font-medium">Valentina Cruz</div>
                          <div className="text-zinc-500 text-xs">Asistente @ Lollapalooza Chile</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-6" style={{ animation: 'slideLoop 10s ease-in-out 5s infinite' }}>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        "Mi café favorito está en un food truck itinerante. Lo sigo a donde va. La calidad del grano y el servicio no tienen comparación."
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=80" alt="Pilar" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 shrink-0" />
                        <div>
                          <div className="text-white text-sm font-medium">Pilar Soto</div>
                          <div className="text-zinc-500 text-xs">Cliente frecuente · Santiago</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INSTAGRAM SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-0 w-[800px] h-[700px] rounded-full bg-neon-purple/5 blur-[180px] pointer-events-none animate-glow-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full bg-neon-blue/4 blur-[140px] pointer-events-none animate-glow-pulse delay-1000" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">

            {/* ── Phone mockup ── */}
            <div className="relative shrink-0 animate-float">
              <div className="absolute -inset-10 rounded-[70px] bg-neon-purple/8 blur-3xl pointer-events-none" />

              <div className="rounded-[44px] p-[1.5px] shadow-[0_60px_140px_rgba(0,0,0,0.95)]"
                style={{ background: 'linear-gradient(135deg, #c026d3 0%, #38bdf8 50%, #c026d3 100%)' }}>
                <div className="w-[290px] rounded-[43px] bg-[#07070a] overflow-hidden">

                  {/* Status bar */}
                  <div className="flex justify-between items-center px-6 pt-4 pb-1">
                    <span className="text-white text-[10px] font-bold">9:41</span>
                    <div className="w-[60px] h-[18px] bg-[#07070a] rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2" />
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5 items-end h-2.5">
                        <div className="w-0.5 h-1 bg-white/50 rounded-sm" />
                        <div className="w-0.5 h-1.5 bg-white/50 rounded-sm" />
                        <div className="w-0.5 h-2 bg-white/80 rounded-sm" />
                        <div className="w-0.5 h-2.5 bg-white rounded-sm" />
                      </div>
                      <div className="text-white/70 text-[9px]">▶</div>
                      <div className="w-5 h-2.5 rounded-sm border border-white/40 flex items-center justify-end pr-0.5">
                        <div className="w-3 h-1.5 bg-white/80 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Instagram top bar */}
                  <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5">
                    <span className="text-white font-extrabold text-[13px] tracking-tight italic">boanoitecafe</span>
                    <div className="flex gap-3.5">
                      <span className="text-white text-base leading-none">♡</span>
                      <span className="text-white text-base leading-none rotate-45 inline-block">➤</span>
                    </div>
                  </div>

                  {/* Stories row */}
                  <div className="flex gap-3 px-4 py-3">
                    {[
                      { label: 'Logo', img: '/instagram/ig1-logo.jpg' },
                      { label: 'Helado', img: '/instagram/ig2-helado-cup.jpg' },
                      { label: 'Estadio', img: '/instagram/ig3-helado-estadio.jpg' },
                      { label: 'Festival', img: '/instagram/ig4-promo.jpg' },
                    ].map((s, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-11 h-11 rounded-full p-[1.5px]"
                          style={{ background: 'linear-gradient(135deg, #c026d3, #38bdf8)' }}>
                          <div className="w-full h-full rounded-full overflow-hidden border-[1.5px] border-[#07070a]">
                            <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <span className="text-gray-400 text-[8px] font-medium">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Post header */}
                  <div className="px-4 pb-2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full p-[1.5px] shrink-0"
                      style={{ background: 'linear-gradient(135deg, #c026d3, #38bdf8)' }}>
                      <div className="w-full h-full rounded-full bg-[#07070a] flex items-center justify-center border border-[#07070a]">
                        <span className="text-white text-[7px] font-extrabold">BN</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-[9px] font-extrabold leading-none">boanoitecafe</p>
                      <p className="text-gray-500 text-[8px]">Santiago · Chile</p>
                    </div>
                    <span className="text-gray-500 text-[16px] leading-none">···</span>
                  </div>

                  {/* Post image */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    <img
                      src="/instagram/ig5-truck.jpg"
                      alt="Boa Noite food truck"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/30 to-transparent pointer-events-none" />
                  </div>

                  {/* Actions row */}
                  <div className="px-4 pt-2.5 pb-1 flex items-center gap-3.5">
                    <span className="text-white text-xl leading-none">♡</span>
                    <span className="text-white text-xl leading-none">💬</span>
                    <span className="text-white text-xl leading-none rotate-45 inline-block">➤</span>
                    <span className="text-white text-xl leading-none ml-auto">⊡</span>
                  </div>

                  {/* Likes + caption */}
                  <div className="px-4 pb-6">
                    <p className="text-white text-[9px] font-extrabold">2.108 me gusta</p>
                    <p className="text-[9px] mt-1 leading-relaxed">
                      <span className="text-white font-extrabold">boanoitecafe </span>
                      <span className="text-gray-400">El truck listo para el festival 🍦☕ ¿Nos vemos en la próxima? 👇</span>
                    </p>
                    <p className="text-gray-600 text-[8px] mt-1.5 uppercase tracking-widest">hace 2 horas</p>
                  </div>

                </div>
              </div>
            </div>

            {/* ── Stats & copy ── */}
            <div className="flex-1 max-w-md">

              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 bg-gradient-to-b from-neon-purple to-neon-blue rounded-full" />
                <p className="text-neon-blue font-bold tracking-[0.25em] text-[10px] uppercase">Presencia en Instagram</p>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[0.88] mb-5">
                Las publicaciones<br />
                <span className="gradient-text-purple-blue">que nos buscan.</span>
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                Cada evento queda documentado. Desde el primer sorbo hasta el último
                partido — nuestra comunidad sigue el viaje en tiempo real.
              </p>

              {/* Stats */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Trophy size={14} className="text-neon-purple" />, bg: 'bg-neon-purple/10 border-neon-purple/20', value: '50+', label: 'Eventos documentados', desc: 'Estadios, festivales y eventos privados a lo largo de Chile.' },
                  { icon: <Users size={14} className="text-neon-blue" />, bg: 'bg-neon-blue/10 border-neon-blue/20', value: '2.4K+', label: 'Seguidores activos', desc: 'Comunidad que crece con cada publicación y cada evento.' },
                  { icon: <Star size={14} className="text-neon-purple fill-neon-purple" />, bg: 'bg-neon-purple/10 border-neon-purple/20', value: '4.9★', label: 'Calificación promedio', desc: 'Basado en más de 2.400 reseñas verificadas en los eventos.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${s.bg}`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-white font-extrabold text-sm leading-none mb-0.5">
                        {s.value} <span className="text-gray-500 font-normal text-xs">{s.label}</span>
                      </p>
                      <p className="text-gray-600 text-[10px] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://www.instagram.com/boanoitecafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden group font-bold tracking-widest uppercase text-xs px-8 py-4 rounded-xl text-white inline-flex items-center gap-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-0 animate-shimmer" />
                <span className="relative z-10 flex items-center gap-2">
                  Ver en Instagram <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VIDEO BANNER
      ══════════════════════════════════════════ */}
      <section
        className="w-full relative overflow-hidden aspect-video"
        style={{ backgroundImage: 'url(/poster-cta.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <video
          ref={ctaVideoRef}
          data-src="/boa-noite-cta.mp4"
          data-src-mobile="/boa-noite-cta-mobile.mp4"
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ display: 'block', willChange: 'transform', transform: 'translateZ(0)' }}
        />
        {/* Líneas premium top/bottom */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════
          RASTREADOR EN VIVO & EVENTOS
      ══════════════════════════════════════════ */}
      <section id="ubicacion" className="relative overflow-hidden bg-[#09090b]">
        {/* Glows */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-neon-purple/8 blur-[200px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-neon-blue/6 blur-[180px] pointer-events-none -z-0" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none -z-0" />

        <div className="flex flex-col lg:flex-row min-h-screen relative z-10">

          {/* ═══ COLUMNA IZQUIERDA — GPS Hero ═══ */}
          <div className="lg:w-[55%] flex flex-col justify-center px-8 lg:px-14 py-20">

            <p className="text-neon-blue font-bold tracking-[0.3em] text-[9px] uppercase mb-4">Seguimiento en Vivo · Santiago de Chile</p>
            <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold uppercase tracking-tighter leading-[0.85] mb-5">
              <span className="gradient-text-purple-blue">Encuéntranos</span><br />Donde<br /><span className="text-white">Estemos</span>
            </h2>
            <p className="text-gray-500 text-sm font-light max-w-sm leading-relaxed mb-8">
              Ubicación en tiempo real del truck · Recorremos la zona oriente de Santiago llevando café de especialidad y experiencias de catering premium a cada evento.
            </p>

            {/* Terminal */}
            <div className="rounded-2xl overflow-hidden border border-neon-purple/20 bg-[#0c0c14]">
              {/* Barra terminal */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[9px] text-gray-600 font-mono ml-2 tracking-widest">boa-noite · live-tracker · santiago</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${location?.isActive ? 'bg-neon-blue animate-pulse' : 'bg-gray-600'}`} />
                  <span className="text-[8px] font-bold tracking-widest uppercase text-gray-500">{location?.isActive ? 'Online' : 'Sin señal'}</span>
                </div>
              </div>

              {/* Mapa */}
              <div className="relative h-[260px]">
                {mapSrc ? (
                  <iframe src={mapSrc} className="w-full h-full border-0" title="Ubicación del truck" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0a0a12] relative">
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,229,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.04) 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full border border-neon-blue/20 flex items-center justify-center">
                        <Truck size={24} className="text-neon-blue/30" />
                      </div>
                      <p className="text-gray-700 text-[10px] font-mono">Esperando señal GPS…</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Cards ubicación + countdown */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4 border border-white/8">
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Localización Actual</p>
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-neon-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-extrabold text-sm leading-tight">{location?.address ?? 'Sin ubicación activa'}</p>
                      {location && todayDay.closeHour > 0 && (
                        <p className="text-neon-blue text-[9px] mt-1 font-medium">Servicio hasta las {pad2(todayDay.closeHour)}:00 hrs</p>
                      )}
                      {timeAgoStr && <p className="text-gray-600 text-[8px] mt-0.5">Actualizado {timeAgoStr}</p>}
                    </div>
                  </div>
                </div>
                <div className="glass rounded-xl p-4 border border-neon-purple/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap size={10} className="text-neon-purple" />
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Próxima: <span className="text-neon-purple">{nextDay.loc}</span></p>
                  </div>
                  {todayDay.closeHour > 0 ? (
                    <>
                      <p className="text-[8px] text-gray-600 mb-1">EN</p>
                      <div className="flex items-baseline gap-0.5 font-mono font-extrabold text-white">
                        <span className="text-2xl">{pad2(closeCount.h)}</span>
                        <span className="text-neon-purple text-sm mx-0.5">h</span>
                        <span className="text-2xl">{pad2(closeCount.m)}</span>
                        <span className="text-neon-purple text-sm mx-0.5">m</span>
                        <span className="text-2xl">{pad2(closeCount.s)}</span>
                        <span className="text-neon-purple text-sm ml-0.5">s</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-600 text-xs font-medium">Mañana en {nextDay.loc}</p>
                  )}
                </div>
              </div>

              {/* Admin panel */}
              {isAdmin && (
                <div className="mx-4 mb-4 glass-dark rounded-xl p-4 border border-neon-purple/30">
                  <p className="text-neon-purple text-[9px] font-bold uppercase tracking-widest mb-3">🚛 Modo Truck — Actualizar Ubicación</p>
                  <button onClick={handleUpdateLocation} disabled={gpsLoading}
                    className="relative overflow-hidden w-full font-bold uppercase tracking-widest text-[10px] px-5 py-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-60">
                    <span className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue" />
                    <span className="relative z-10 flex items-center gap-2">
                      {gpsLoading ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
                      {gpsLoading ? 'Obteniendo GPS…' : 'Compartir mi ubicación'}
                    </span>
                  </button>
                  {location && (
                    <button onClick={async () => { clearLocation(); await clearLocationInDB(); }}
                      className="w-full text-[9px] text-gray-600 hover:text-red-400 mt-2 transition-colors">
                      Limpiar ubicación
                    </button>
                  )}
                  {gpsError && <p className="text-red-400 text-[9px] mt-2">{gpsError}</p>}
                </div>
              )}
            </div>

            {/* Links rápidos */}
            <div className="flex flex-wrap gap-2 mt-5">
              <a href="https://www.instagram.com/boanoitecafe/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 glass rounded-lg px-4 py-2.5 border border-white/8 hover:border-neon-purple/30 transition-all group">
                <Instagram size={13} className="text-neon-purple" />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">@boanoitecafe</span>
              </a>
              <a href="https://wa.me/56967270078?text=Hola%2C%20quiero%20saber%20d%C3%B3nde%20est%C3%A1n%20hoy%20%F0%9F%9A%9B" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 glass rounded-lg px-4 py-2.5 border border-white/8 hover:border-neon-blue/30 transition-all group">
                <MessageCircle size={13} className="text-neon-blue" />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">WhatsApp</span>
              </a>
              {location && (
                <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 glass rounded-lg px-4 py-2.5 border border-neon-blue/30 hover:border-neon-blue/60 transition-all glow-blue">
                  <Navigation size={13} className="text-neon-blue" />
                  <span className="text-[10px] font-bold text-neon-blue">Cómo llegar →</span>
                </a>
              )}
            </div>
          </div>

          {/* ═══ COLUMNA DERECHA — Itinerario + Form ═══ */}
          <div className="lg:w-[48%] flex flex-col px-8 lg:px-12 py-20 gap-10 border-l border-white/5">

            {/* ── Ruta Semanal ── */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-4 bg-gradient-to-b from-neon-purple to-neon-blue rounded-full" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ruta Semanal</p>
              </div>
              <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-6">
                Ruta <span className="gradient-text-purple-blue">Semanal</span>
              </h2>

              {/* Días — grid más alto */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {DAYS.map((d, i) => {
                  const isToday = i === todayIdx;
                  return (
                    <div key={i} className={`relative rounded-xl py-4 px-1 flex flex-col items-center text-center border overflow-hidden transition-all ${isToday ? 'border-neon-purple/50 bg-neon-purple/10' : 'border-white/8 bg-white/2 hover:border-white/15'}`}>
                      {isToday && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent" />}
                      <span className={`text-[10px] font-extrabold tracking-widest uppercase mb-2 ${isToday ? 'text-neon-purple' : 'text-gray-500'}`}>{d.day}</span>
                      {isToday && <span className="text-[8px] font-bold text-neon-purple bg-neon-purple/20 px-1.5 py-0.5 rounded-full mb-2 leading-none">HOY</span>}
                      <span className={`font-bold text-[10px] leading-tight mb-1.5 ${isToday ? 'text-white' : 'text-gray-300'}`}>{d.loc}</span>
                      <span className={`text-[9px] font-semibold ${isToday ? 'text-neon-blue' : 'text-gray-600'}`}>{d.hours}</span>
                    </div>
                  );
                })}
              </div>

              <div className="glass rounded-xl px-5 py-4 border border-neon-purple/20 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-purple animate-pulse shrink-0" />
                <p className="text-xs text-gray-300 font-medium">
                  Sold out el sábado en Estadio Monumental.{' '}
                  <span className="text-neon-purple font-bold">Reserva con anticipación.</span>
                </p>
              </div>
            </div>

            {/* ── Configurador de Experiencia ── */}
            <div className="rounded-2xl overflow-hidden border border-white/8 bg-[#0c0c14]">

              {/* Foto truck — banner superior */}
              <div className="relative h-64 overflow-hidden">
                <img src="/truck.jpg" alt="Boa Noite truck" className="w-full h-full object-cover object-[center_45%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/20 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-neon-blue/15 border border-neon-blue/25 rounded-full px-3 py-1 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                      <span className="text-[9px] font-bold text-neon-blue uppercase tracking-widest">Catering Premium</span>
                    </div>
                    <p className="text-2xl font-extrabold uppercase tracking-tight leading-tight">
                      Tu Evento.<br /><span className="gradient-text-purple-blue">Nuestra Firma.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div className="p-7">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-4 bg-gradient-to-b from-neon-purple to-neon-blue rounded-full" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reservaciones</p>
                </div>
                <h3 className="text-xl font-extrabold mb-5">Configurador de Experiencia</h3>

                {/* Pasos */}
                <div className="flex gap-2 mb-6">
                  {['Detalles', 'Tipo', 'Tentativa', 'Contacto'].map((s, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-[2px] rounded-full mb-1.5 bg-gradient-to-r from-neon-purple to-neon-blue" style={{ opacity: 0.25 + i * 0.25 }} />
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold truncate">P{i + 1}. {s}</p>
                    </div>
                  ))}
                </div>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                    <CheckCircle size={40} className="text-neon-blue" />
                    <p className="text-base font-extrabold">¡Solicitud enviada!</p>
                    <p className="text-gray-500 text-sm">Te redirigimos a WhatsApp.</p>
                    <button onClick={() => setSubmitted(false)} className="text-neon-blue text-xs font-bold uppercase tracking-widest mt-1">Otra solicitud</button>
                  </div>
                ) : (
                  <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={hsEvent(onEventSubmit)}>
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nombre completo</label>
                      <input {...regEvent('name')} type="text" placeholder="Nombre completo"
                        className={`glass bg-white/3 border text-white text-sm px-4 py-3 rounded-xl focus:outline-none transition-all placeholder:text-gray-600 ${evErrors.name ? 'border-red-500/50' : 'border-white/8 focus:border-neon-purple/50'}`} />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de evento</label>
                      <div className="relative">
                        <select {...regEvent('eventType')} className="appearance-none glass bg-white/3 border border-white/8 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neon-purple/50 transition-all w-full cursor-pointer">
                          <option className="bg-[#1a1a1c]">Boda / Social</option>
                          <option className="bg-[#1a1a1c]">Corporativo</option>
                          <option className="bg-[#1a1a1c]">Lanzamiento</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fecha tentativa</label>
                      <input {...regEvent('date')} type="datetime-local"
                        className={`glass bg-white/3 border text-white text-sm px-4 py-3 rounded-xl focus:outline-none transition-all [color-scheme:dark] ${evErrors.date ? 'border-red-500/50' : 'border-white/8 focus:border-neon-purple/50'}`} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                      <input {...regEvent('email')} type="email" placeholder="tu@email.com"
                        className={`glass bg-white/3 border text-white text-sm px-4 py-3 rounded-xl focus:outline-none transition-all placeholder:text-gray-600 ${evErrors.email ? 'border-red-500/50' : 'border-white/8 focus:border-neon-purple/50'}`} />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mensaje / Motivo</label>
                      <textarea {...regEvent('notes')} rows={3} placeholder="Cuéntanos sobre tu evento, número de personas, lugar, etc."
                        className="glass bg-white/3 border border-white/8 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neon-purple/50 transition-all placeholder:text-gray-600 resize-none" />
                    </div>

                    <div className="sm:col-span-2 mt-1">
                      <button type="submit" disabled={sending}
                        className="relative overflow-hidden w-full font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-70">
                        <span className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue" />
                        <span className="absolute inset-0 animate-shimmer" />
                        {sending
                          ? <Loader2 size={14} className="relative z-10 animate-spin" />
                          : <MessageCircle size={14} className="relative z-10" />}
                        <span className="relative z-10">{sending ? 'Enviando…' : 'Enviar Solicitud'}</span>
                      </button>
                      {sendError && <p className="text-red-400 text-xs mt-2 text-center">{sendError}</p>}
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
