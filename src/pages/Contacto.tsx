import { useState, useRef } from 'react';
import {
  ArrowRight, ArrowLeft, Check, Instagram,
  MessageCircle, ChevronDown, ChevronUp,
  Heart, Building2, Cake, Music2, Sparkles,
  Users, Calendar, Mail, User, Send,
  MapPin, Star,
} from 'lucide-react';

/* ─── Constants ─────────────────────────────────────────── */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;
const WHATSAPP   = '56967270078';
const INSTAGRAM  = 'boanoitecafe';

/* ─── Step data ─────────────────────────────────────────── */
const EVENT_TYPES = [
  { id: 'matrimonio',  label: 'Matrimonio',   icon: Heart,     desc: 'Tu día más especial' },
  { id: 'corporativo', label: 'Corporativo',  icon: Building2, desc: 'Eventos de empresa' },
  { id: 'cumpleanos',  label: 'Cumpleaños',   icon: Cake,      desc: 'Celebra a lo grande' },
  { id: 'festival',   label: 'Festival',      icon: Music2,    desc: 'Masivos y memorables' },
  { id: 'otro',       label: 'Otro',          icon: Sparkles,  desc: 'Cuéntanos tu idea' },
];

const GUEST_RANGES = [
  { id: '50-100',   label: '50 – 100',  desc: 'Íntimo y especial' },
  { id: '100-300',  label: '100 – 300', desc: 'Evento mediano' },
  { id: '300-500',  label: '300 – 500', desc: 'Gran celebración' },
  { id: '500+',     label: '500 +',     desc: 'Masivo' },
];

const FAQS = [
  {
    q: '¿En qué comunas de Santiago operan?',
    a: 'Operamos principalmente en la zona oriente: Vitacura, Las Condes, Providencia, La Dehesa, Ñuñoa y alrededores. Para eventos fuera de esa zona, contáctanos y evaluamos.',
  },
  {
    q: '¿Qué incluye el servicio de catering?',
    a: 'Café de especialidad, helados artesanales, barista profesional, equipamiento completo y el truck como elemento visual del evento. Personalizamos el menú según el tipo de evento.',
  },
  {
    q: '¿Con cuánta anticipación debo reservar?',
    a: 'Recomendamos mínimo 3 semanas para eventos pequeños y 6-8 semanas para matrimonios y festivales. Los fines de semana se agotan rápido.',
  },
  {
    q: '¿Tienen precio mínimo?',
    a: 'Sí, tenemos un mínimo de servicio según tipo de evento. Te enviamos una propuesta personalizada dentro de las 24h de recibir tu consulta.',
  },
  {
    q: '¿Puedo personalizar el menú?',
    a: 'Absolutamente. Café de especialidad, helados artesanales, bebidas frías, snacks. Podemos adaptar todo a la temática y necesidades de tu evento.',
  },
];

const STATS = [
  { val: '+50', label: 'Eventos 2024' },
  { val: '100%', label: 'Café de Especialidad' },
  { val: '24h', label: 'Respuesta garantizada' },
  { val: '⭐ 5.0', label: 'Valoración promedio' },
];

/* ─── Types ─────────────────────────────────────────────── */
interface FormState {
  eventType: string;
  guests:    string;
  date:      string;
  location:  string;
  name:      string;
  email:     string;
  notes:     string;
}

const EMPTY: FormState = {
  eventType: '', guests: '', date: '', location: '',
  name: '', email: '', notes: '',
};

/* ─── Progress bar ──────────────────────────────────────── */
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full h-0.5 bg-white/8 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${((step + 1) / total) * 100}%`,
          background: 'linear-gradient(90deg, #ec4899, #2dd4bf)',
        }}
      />
    </div>
  );
}

/* ─── Step wrapper (slide animation) ────────────────────── */
function StepSlide({ children, dir }: { children: React.ReactNode; dir: 'forward' | 'back' }) {
  return (
    <div
      className="w-full"
      style={{
        animation: `slideIn${dir === 'forward' ? 'Right' : 'Left'} 0.4s cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── FAQ item ──────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full text-left glass rounded-2xl border border-white/6 hover:border-white/12 transition-all duration-300 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 p-6">
        <span className="text-sm font-semibold text-white leading-snug">{q}</span>
        <span className="shrink-0 text-white/40">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>
      {open && (
        <div className="px-6 pb-6 text-sm text-white/50 font-light leading-relaxed border-t border-white/6 pt-4">
          {a}
        </div>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export function Contacto() {
  const [step, setStep]       = useState(0);
  const [dir,  setDir]        = useState<'forward' | 'back'>('forward');
  const [form, setForm]       = useState<FormState>(EMPTY);
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');
  const [started, setStarted] = useState(false);
  const topRef                = useRef<HTMLDivElement>(null);

  const TOTAL_STEPS = 5;

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function next() {
    setDir('forward');
    setStep(s => s + 1);
    scrollTop();
  }

  function back() {
    setDir('back');
    setStep(s => s - 1);
    scrollTop();
  }

  function set(key: keyof FormState, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function submit() {
    setSending(true);
    setError('');
    try {
      const eventLabel = EVENT_TYPES.find(e => e.id === form.eventType)?.label ?? form.eventType;
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          from_name:  form.name,
          subject:    `Nueva consulta de evento — ${eventLabel} · Boa Noite`,
          name:       form.name,
          email:      form.email,
          message: [
            `Tipo de evento: ${eventLabel}`,
            `Invitados: ${form.guests}`,
            `Fecha tentativa: ${form.date}`,
            `Lugar / comuna: ${form.location}`,
            `Notas: ${form.notes || '—'}`,
          ].join('\n'),
        }),
      });
      const data = await res.json();
      if (data.success) { setSent(true); }
      else setError('Error al enviar. Intenta por WhatsApp.');
    } catch {
      setError('Sin conexión. Intenta por WhatsApp.');
    } finally {
      setSending(false);
    }
  }

  /* ── Validation per step ─────────── */
  function canNext(): boolean {
    if (step === 0) return !!form.eventType;
    if (step === 1) return !!form.guests;
    if (step === 2) return !!form.date && !!form.location;
    if (step === 3) return form.name.length >= 2 && /\S+@\S+\.\S+/.test(form.email);
    return true;
  }

  /* ── Render ─────────────────────── */
  return (
    <>
      {/* Slide animations injected inline */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">

        {/* ── AMBIENT GLOWS ───────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full opacity-12"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        {!started ? (
          <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center">
            <div className="relative z-10 max-w-3xl mx-auto">

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ec4899]" />
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ec4899]">
                  Agenda tu Evento
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#ec4899]" />
              </div>

              {/* Headline */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter leading-none mb-8">
                <span className="block text-white">Tu evento</span>
                <span className="block" style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>merece algo</span>
                <span className="block text-white">que se recuerde.</span>
              </h1>

              <p className="text-lg text-white/50 font-light max-w-lg mx-auto mb-14 leading-relaxed">
                Café de especialidad y helados artesanales para bodas, eventos corporativos y festivales en Santiago.
                <br />
                <span className="text-[#2dd4bf]/80">Respuesta en menos de 24 horas.</span>
              </p>

              {/* CTA */}
              <button
                onClick={() => setStarted(true)}
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-base uppercase tracking-widest text-white overflow-hidden transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #ec4899, #c026d3)' }}
              >
                <span>Comenzar consulta</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </button>

              {/* Quick alts */}
              <div className="mt-10 flex items-center justify-center gap-6 text-sm text-white/30">
                <span>O contáctanos directo</span>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#2dd4bf] hover:text-[#2dd4bf]/80 transition-colors font-medium"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={`https://instagram.com/${INSTAGRAM}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#ec4899] hover:text-[#ec4899]/80 transition-colors font-medium"
                >
                  <Instagram size={15} /> Instagram
                </a>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative z-10 mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl w-full mx-auto">
              {STATS.map(s => (
                <div key={s.label} className="glass rounded-2xl p-5 border border-white/6 text-center">
                  <div className="text-2xl font-extrabold" style={{
                    background: 'linear-gradient(135deg, #ec4899, #2dd4bf)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{s.val}</div>
                  <div className="text-[10px] text-white/35 uppercase tracking-widest mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40" />
              <span className="text-[9px] tracking-[0.3em] uppercase">Desliza</span>
            </div>
          </section>
        ) : (

        /* ══════════════════════════════════════════════════
            WIZARD
        ══════════════════════════════════════════════════ */
          <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <div ref={topRef} className="scroll-mt-24" />

            <div className="relative z-10 w-full max-w-2xl mx-auto">

              {sent ? (
                /* ── SUCCESS ──────────────────────────────── */
                <div className="text-center py-20">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #2dd4bf)' }}
                  >
                    <Check size={36} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-extrabold uppercase tracking-tighter text-white mb-4">
                    ¡Todo listo!
                  </h2>
                  <p className="text-white/50 font-light text-lg mb-3">
                    Recibimos tu consulta, <span className="text-white font-semibold">{form.name}</span>.
                  </p>
                  <p className="text-white/40 font-light mb-10">
                    Te escribiremos a <span className="text-[#2dd4bf]">{form.email}</span> en menos de 24 horas.
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=Hola, acabo de enviar una consulta por la web`}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-[#2dd4bf]/30 text-[#2dd4bf] text-sm font-semibold hover:border-[#2dd4bf]/60 transition-all"
                    >
                      <MessageCircle size={15} /> Escríbenos por WhatsApp
                    </a>
                    <button
                      onClick={() => { setSent(false); setForm(EMPTY); setStep(0); setStarted(false); }}
                      className="text-sm text-white/30 hover:text-white/60 transition-colors underline underline-offset-4"
                    >
                      Nueva consulta
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4 text-[11px] font-semibold tracking-widest uppercase text-white/30">
                      <span>Paso {step + 1} de {TOTAL_STEPS}</span>
                      <button
                        onClick={() => setStarted(false)}
                        className="hover:text-white/60 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                    <ProgressBar step={step} total={TOTAL_STEPS} />
                  </div>

                  {/* Steps */}
                  <StepSlide key={step} dir={dir}>

                    {/* ── STEP 0: Tipo de evento ──────────── */}
                    {step === 0 && (
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ec4899] mb-4">
                          01 · Tipo de evento
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-white leading-none mb-8">
                          ¿Qué<br />celebramos?
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {EVENT_TYPES.map(et => {
                            const Icon = et.icon;
                            const sel  = form.eventType === et.id;
                            return (
                              <button
                                key={et.id}
                                onClick={() => set('eventType', et.id)}
                                className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-300 ${
                                  sel
                                    ? 'border-[#ec4899]/60 bg-[#ec4899]/10'
                                    : 'border-white/8 glass hover:border-white/20'
                                }`}
                              >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                  sel ? 'bg-[#ec4899]' : 'bg-white/6'
                                }`}>
                                  <Icon size={20} className={sel ? 'text-white' : 'text-white/50'} />
                                </div>
                                <div>
                                  <div className={`font-bold text-sm uppercase tracking-wide transition-colors ${sel ? 'text-white' : 'text-white/70'}`}>
                                    {et.label}
                                  </div>
                                  <div className="text-xs text-white/35 mt-0.5">{et.desc}</div>
                                </div>
                                {sel && (
                                  <div className="ml-auto w-5 h-5 rounded-full bg-[#ec4899] flex items-center justify-center shrink-0">
                                    <Check size={12} className="text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 1: Invitados ───────────────── */}
                    {step === 1 && (
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ec4899] mb-4">
                          02 · Invitados
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-white leading-none mb-8">
                          ¿Cuántas<br />personas?
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                          {GUEST_RANGES.map(g => {
                            const sel = form.guests === g.id;
                            return (
                              <button
                                key={g.id}
                                onClick={() => set('guests', g.id)}
                                className={`flex flex-col items-start gap-1 p-6 rounded-2xl border text-left transition-all duration-300 ${
                                  sel
                                    ? 'border-[#2dd4bf]/60 bg-[#2dd4bf]/10'
                                    : 'border-white/8 glass hover:border-white/20'
                                }`}
                              >
                                <Users size={18} className={sel ? 'text-[#2dd4bf]' : 'text-white/30'} />
                                <div className={`text-2xl font-extrabold tracking-tighter mt-2 ${sel ? 'text-white' : 'text-white/60'}`}>
                                  {g.label}
                                </div>
                                <div className="text-xs text-white/35">{g.desc}</div>
                                {sel && (
                                  <div className="mt-2 w-5 h-5 rounded-full bg-[#2dd4bf] flex items-center justify-center">
                                    <Check size={12} className="text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: Cuándo y dónde ─────────── */}
                    {step === 2 && (
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ec4899] mb-4">
                          03 · Fecha y lugar
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-white leading-none mb-8">
                          ¿Cuándo<br />y dónde?
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2 flex items-center gap-2">
                              <Calendar size={12} /> Fecha tentativa
                            </label>
                            <input
                              type="date"
                              value={form.date}
                              onChange={e => set('date', e.target.value)}
                              className="w-full bg-white/4 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-medium focus:outline-none focus:border-[#ec4899]/60 transition-colors"
                              style={{ colorScheme: 'dark' }}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2 flex items-center gap-2">
                              <MapPin size={12} /> Comuna o lugar del evento
                            </label>
                            <input
                              type="text"
                              value={form.location}
                              onChange={e => set('location', e.target.value)}
                              placeholder="Ej: Vitacura, Hacienda, Providencia..."
                              className="w-full bg-white/4 border border-white/10 rounded-xl px-5 py-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#ec4899]/60 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 3: Datos de contacto ──────── */}
                    {step === 3 && (
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ec4899] mb-4">
                          04 · Tu contacto
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-white leading-none mb-8">
                          ¿Con quién<br />hablamos?
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2 flex items-center gap-2">
                              <User size={12} /> Nombre completo
                            </label>
                            <input
                              type="text"
                              value={form.name}
                              onChange={e => set('name', e.target.value)}
                              placeholder="Tu nombre"
                              className="w-full bg-white/4 border border-white/10 rounded-xl px-5 py-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#ec4899]/60 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2 flex items-center gap-2">
                              <Mail size={12} /> Email
                            </label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={e => set('email', e.target.value)}
                              placeholder="tucorreo@email.com"
                              className="w-full bg-white/4 border border-white/10 rounded-xl px-5 py-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#ec4899]/60 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 4: Notas + submit ─────────── */}
                    {step === 4 && (
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ec4899] mb-4">
                          05 · Últimos detalles
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-white leading-none mb-8">
                          ¿Algo más<br />que sepamos?
                        </h2>

                        {/* Summary */}
                        <div className="glass-strong rounded-2xl p-5 border border-white/6 mb-6 space-y-2 text-sm">
                          {[
                            { label: 'Evento', val: EVENT_TYPES.find(e => e.id === form.eventType)?.label },
                            { label: 'Invitados', val: form.guests },
                            { label: 'Fecha', val: form.date },
                            { label: 'Lugar', val: form.location },
                            { label: 'Contacto', val: `${form.name} · ${form.email}` },
                          ].map(r => (
                            <div key={r.label} className="flex items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 w-20 shrink-0">{r.label}</span>
                              <span className="text-white/70 font-medium">{r.val}</span>
                            </div>
                          ))}
                        </div>

                        <textarea
                          value={form.notes}
                          onChange={e => set('notes', e.target.value)}
                          placeholder="Detalles adicionales, solicitudes especiales, preguntas... (opcional)"
                          rows={4}
                          className="w-full bg-white/4 border border-white/10 rounded-xl px-5 py-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#ec4899]/60 transition-colors resize-none mb-2"
                        />

                        {error && (
                          <p className="text-sm text-red-400 font-medium mb-4">{error}</p>
                        )}
                      </div>
                    )}

                  </StepSlide>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-10">
                    {step > 0 ? (
                      <button
                        onClick={back}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors font-medium"
                      >
                        <ArrowLeft size={16} /> Atrás
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < TOTAL_STEPS - 1 ? (
                      <button
                        onClick={next}
                        disabled={!canNext()}
                        className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
                          canNext()
                            ? 'text-white hover:scale-105'
                            : 'opacity-30 cursor-not-allowed text-white/50'
                        }`}
                        style={canNext() ? { background: 'linear-gradient(135deg, #ec4899, #c026d3)' } : { background: 'rgba(255,255,255,0.06)' }}
                      >
                        Continuar <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={submit}
                        disabled={sending}
                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #2dd4bf)' }}
                      >
                        {sending ? (
                          <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                          <Send size={16} />
                        )}
                        {sending ? 'Enviando...' : 'Enviar consulta'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            TESTIMONIAL CAROUSEL
        ══════════════════════════════════════════════════ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-15" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ec4899]/20 to-transparent" />

          {/* Header */}
          <div className="relative z-10 text-center mb-14 px-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ec4899]" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ec4899]">Lo que dicen</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#ec4899]" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-white">
              Eventos que<br />
              <span style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>marcaron la diferencia</span>
            </h2>
          </div>

          {/* Carousel — infinite scroll */}
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .marquee-track { animation: marquee 40s linear infinite; }
            .marquee-track:hover { animation-play-state: paused; }
          `}</style>

          <div className="relative z-10 overflow-hidden">
            {/* Fade masks left/right */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
              style={{ background: 'linear-gradient(to right, #09090b, transparent)' }} />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
              style={{ background: 'linear-gradient(to left, #09090b, transparent)' }} />

            <div className="flex marquee-track" style={{ width: 'max-content' }}>
              {[...[
                { name: 'Sofía A.',     avatar: 'https://i.pravatar.cc/80?img=1',  event: 'Matrimonio · Vitacura',         text: 'El truck fue la atracción principal. El café de especialidad superó todas las expectativas. ¡Nuestros invitados siguen hablando de eso!' },
                { name: 'Tomás B.',     avatar: 'https://i.pravatar.cc/80?img=12', event: 'Corporativo · Las Condes',       text: 'Puntualidad, profesionalismo y un producto de calidad brutal. Lo hemos contratado tres veces para eventos de empresa.' },
                { name: 'Fernanda C.',  avatar: 'https://i.pravatar.cc/80?img=5',  event: 'Cumpleaños · Providencia',      text: 'El diseño del truck encajó perfecto con la decoración. Los helados artesanales fueron un hit total con los niños y adultos.' },
                { name: 'Andrés D.',    avatar: 'https://i.pravatar.cc/80?img=15', event: 'Festival · La Dehesa',           text: 'Para nuestro festival de verano fue el puesto más visitado. La gente formaba fila por el café frío. Increíble.' },
                { name: 'Isidora E.',   avatar: 'https://i.pravatar.cc/80?img=9',  event: 'Matrimonio · Lo Barnechea',     text: 'Gracias a Boa Noite nuestro matrimonio tuvo ese toque diferente que buscábamos. Muy recomendados, sin dudarlo.' },
                { name: 'Matías F.',    avatar: 'https://i.pravatar.cc/80?img=22', event: 'Corporativo · Ñuñoa',           text: 'Nuestro equipo quedó encantado en el team building. Servicio impecable, sabores únicos y una presentación top.' },
                { name: 'Javiera G.',   avatar: 'https://i.pravatar.cc/80?img=16', event: 'Aniversario · Las Condes',      text: 'El detalle del truck rosa y turquesa fue la foto más compartida de la noche. Un 10/10 en todo sentido.' },
                { name: 'Sebastián H.', avatar: 'https://i.pravatar.cc/80?img=33', event: 'Lanzamiento · Providencia',     text: 'El lanzamiento de producto necesitaba algo memorable. Boa Noite lo dio. Los clientes llegaron por el café y se quedaron por el helado.' },
                { name: 'Camila I.',    avatar: 'https://i.pravatar.cc/80?img=25', event: 'Boda · Vitacura',               text: 'Desde el primer contacto hasta el último café, todo fue perfecto. Son serios, creativos y el resultado superó lo esperado.' },
                { name: 'Felipe J.',    avatar: 'https://i.pravatar.cc/80?img=51', event: 'Evento Social · La Dehesa',     text: 'Contraté Boa Noite para el cumpleaños de mi madre y fue un éxito rotundo. La calidad del café es otra categoría.' },
                { name: 'Renata K.',    avatar: 'https://i.pravatar.cc/80?img=47', event: 'Matrimonio · Ñuñoa',            text: 'Nuestros invitados no podían creer que un food truck sirviera café de esa calidad. Absolutamente recomendados.' },
                { name: 'Diego L.',     avatar: 'https://i.pravatar.cc/80?img=60', event: 'Corporativo · Santiago Centro', text: 'Gran experiencia de principio a fin. El truck es instagrameable y el servicio, impecable. Volvemos a contratarlos.' },
              ], ...[
                { name: 'Sofía A.',     avatar: 'https://i.pravatar.cc/80?img=1',  event: 'Matrimonio · Vitacura',         text: 'El truck fue la atracción principal. El café de especialidad superó todas las expectativas. ¡Nuestros invitados siguen hablando de eso!' },
                { name: 'Tomás B.',     avatar: 'https://i.pravatar.cc/80?img=12', event: 'Corporativo · Las Condes',       text: 'Puntualidad, profesionalismo y un producto de calidad brutal. Lo hemos contratado tres veces para eventos de empresa.' },
                { name: 'Fernanda C.',  avatar: 'https://i.pravatar.cc/80?img=5',  event: 'Cumpleaños · Providencia',      text: 'El diseño del truck encajó perfecto con la decoración. Los helados artesanales fueron un hit total con los niños y adultos.' },
                { name: 'Andrés D.',    avatar: 'https://i.pravatar.cc/80?img=15', event: 'Festival · La Dehesa',           text: 'Para nuestro festival de verano fue el puesto más visitado. La gente formaba fila por el café frío. Increíble.' },
                { name: 'Isidora E.',   avatar: 'https://i.pravatar.cc/80?img=9',  event: 'Matrimonio · Lo Barnechea',     text: 'Gracias a Boa Noite nuestro matrimonio tuvo ese toque diferente que buscábamos. Muy recomendados, sin dudarlo.' },
                { name: 'Matías F.',    avatar: 'https://i.pravatar.cc/80?img=22', event: 'Corporativo · Ñuñoa',           text: 'Nuestro equipo quedó encantado en el team building. Servicio impecable, sabores únicos y una presentación top.' },
                { name: 'Javiera G.',   avatar: 'https://i.pravatar.cc/80?img=16', event: 'Aniversario · Las Condes',      text: 'El detalle del truck rosa y turquesa fue la foto más compartida de la noche. Un 10/10 en todo sentido.' },
                { name: 'Sebastián H.', avatar: 'https://i.pravatar.cc/80?img=33', event: 'Lanzamiento · Providencia',     text: 'El lanzamiento de producto necesitaba algo memorable. Boa Noite lo dio. Los clientes llegaron por el café y se quedaron por el helado.' },
                { name: 'Camila I.',    avatar: 'https://i.pravatar.cc/80?img=25', event: 'Boda · Vitacura',               text: 'Desde el primer contacto hasta el último café, todo fue perfecto. Son serios, creativos y el resultado superó lo esperado.' },
                { name: 'Felipe J.',    avatar: 'https://i.pravatar.cc/80?img=51', event: 'Evento Social · La Dehesa',     text: 'Contraté Boa Noite para el cumpleaños de mi madre y fue un éxito rotundo. La calidad del café es otra categoría.' },
                { name: 'Renata K.',    avatar: 'https://i.pravatar.cc/80?img=47', event: 'Matrimonio · Ñuñoa',            text: 'Nuestros invitados no podían creer que un food truck sirviera café de esa calidad. Absolutamente recomendados.' },
                { name: 'Diego L.',     avatar: 'https://i.pravatar.cc/80?img=60', event: 'Corporativo · Santiago Centro', text: 'Gran experiencia de principio a fin. El truck es instagrameable y el servicio, impecable. Volvemos a contratarlos.' },
              ]].map((t, i) => (
                <div
                  key={i}
                  className="shrink-0 w-80 min-h-[420px] mx-3 glass rounded-2xl p-8 border border-white/6 flex flex-col gap-5 hover:border-[#ec4899]/30 transition-colors duration-300"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={11} className="fill-[#ec4899] text-[#ec4899]" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-base text-white/55 font-light leading-relaxed flex-1 italic">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-white/6 pt-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                    />
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{t.name}</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{t.event}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════ */}
        <section className="relative py-24">
          <div className="relative z-10 container mx-auto px-6 lg:px-14 max-w-3xl">

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#2dd4bf]" />
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#2dd4bf]">Preguntas frecuentes</span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#2dd4bf]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-white">
                Todo lo que<br />
                <span style={{
                  background: 'linear-gradient(135deg, #2dd4bf, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>necesitas saber</span>
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            QUICK CONTACT STRIP
        ══════════════════════════════════════════════════ */}
        <section className="relative py-16">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2dd4bf]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ec4899]/20 to-transparent" />

          <div className="relative z-10 container mx-auto px-6 max-w-3xl">
            <div className="glass-strong rounded-3xl p-8 border border-white/6 flex flex-col sm:flex-row items-center justify-between gap-8">

              <div>
                <h3 className="text-xl font-extrabold uppercase tracking-tighter text-white mb-1">
                  ¿Prefieres escribirnos directo?
                </h3>
                <p className="text-sm text-white/40 font-light">Respondemos en minutos durante horario de operación.</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hola Boa Noite, quiero consultar por un evento`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2dd4bf]/30 text-[#2dd4bf] text-sm font-bold hover:bg-[#2dd4bf]/10 hover:border-[#2dd4bf]/60 transition-all duration-300"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={`https://instagram.com/${INSTAGRAM}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#ec4899]/30 text-[#ec4899] text-sm font-bold hover:bg-[#ec4899]/10 hover:border-[#ec4899]/60 transition-all duration-300"
                >
                  <Instagram size={15} /> Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
