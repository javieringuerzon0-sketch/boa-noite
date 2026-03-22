import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Power, PowerOff, Loader2, Shield, Coffee, Wifi, WifiOff } from 'lucide-react';
import { syncLocationToDB, clearLocationInDB, reverseGeocode } from '../use-cases/location';

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'boanoite2026';
const UPDATE_INTERVAL = 30_000; // 30 segundos

export function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [tracking, setTracking] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [gpsError, setGpsError] = useState('');
  const [syncing, setSyncing] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchRef = useRef<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setAuthed(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const updatePosition = useCallback(async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setLat(latitude);
    setLng(longitude);
    setGpsError('');

    const addr = await reverseGeocode(latitude, longitude);
    setAddress(addr);

    const now = new Date().toISOString();
    setLastUpdate(now);
    setSyncing(true);

    await syncLocationToDB({
      lat: latitude,
      lng: longitude,
      address: addr,
      updatedAt: now,
      isActive: true,
    });

    setSyncing(false);
  }, []);

  const handleGpsError = useCallback((err: GeolocationPositionError) => {
    const messages: Record<number, string> = {
      1: 'Permiso de ubicación denegado. Actívalo en la configuración del navegador.',
      2: 'No se pudo obtener la ubicación. Verifica tu GPS.',
      3: 'Tiempo de espera agotado. Intenta de nuevo.',
    };
    setGpsError(messages[err.code] || 'Error desconocido de GPS');
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Tu navegador no soporta geolocalización.');
      return;
    }

    setTracking(true);
    setGpsError('');

    // Posición inicial inmediata
    navigator.geolocation.getCurrentPosition(updatePosition, handleGpsError, {
      enableHighAccuracy: true,
      timeout: 15000,
    });

    // Watch continuo
    watchRef.current = navigator.geolocation.watchPosition(updatePosition, handleGpsError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
    });

    // Sync periódico cada 30s
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(updatePosition, handleGpsError, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    }, UPDATE_INTERVAL);
  }, [updatePosition, handleGpsError]);

  const stopTracking = useCallback(async () => {
    setTracking(false);

    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await clearLocationInDB();
    setAddress('');
    setLat(null);
    setLng(null);
    setLastUpdate('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ─── LOGIN SCREEN ─────────────────────────────────── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#c026d3] mb-4">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">Panel Admin</h1>
            <p className="text-sm text-white/40 mt-1">Boa Noite · Control del Truck</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#ec4899]/50 focus:outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #ec4899, #c026d3)' }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── ADMIN PANEL ──────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-24">
      <div className="max-w-lg mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <Coffee size={18} className="text-[#ec4899]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ec4899]">Boa Noite</span>
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">
            Control del Truck
          </h1>
          <p className="text-sm text-white/40 mt-2">
            Activa tu ubicación para que los clientes te encuentren en tiempo real.
          </p>
        </div>

        {/* Status card */}
        <div className="rounded-2xl p-6 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {tracking ? (
                <Wifi size={18} className="text-emerald-400" />
              ) : (
                <WifiOff size={18} className="text-white/30" />
              )}
              <div>
                <div className="text-sm font-bold uppercase tracking-wide">
                  {tracking ? 'Transmitiendo' : 'Desconectado'}
                </div>
                <div className="text-xs text-white/30">
                  {tracking ? 'GPS activo · Actualización cada 30s' : 'El truck no aparece en la web'}
                </div>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${tracking ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
          </div>

          {/* GPS Data */}
          {tracking && lat !== null && lng !== null && (
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <MapPin size={16} className="text-[#2dd4bf] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">{address || 'Obteniendo dirección...'}</div>
                  <div className="text-xs text-white/30 mt-0.5">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </div>
                </div>
              </div>

              {lastUpdate && (
                <div className="flex items-center justify-between text-xs text-white/30 px-1">
                  <span>Última actualización</span>
                  <span className="flex items-center gap-1.5">
                    {syncing && <Loader2 size={10} className="animate-spin" />}
                    {new Date(lastUpdate).toLocaleTimeString('es-CL')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {gpsError && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {gpsError}
            </div>
          )}

          {/* Action button */}
          {!tracking ? (
            <button
              onClick={startTracking}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              <Power size={18} />
              Estoy Operando
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 bg-red-600 hover:bg-red-700"
            >
              <PowerOff size={18} />
              Cerré · Desactivar
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="rounded-2xl p-5 border border-white/6 space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Instrucciones</h3>
          <ul className="space-y-2 text-sm text-white/40">
            <li className="flex items-start gap-2">
              <span className="text-[#ec4899] mt-0.5">1.</span>
              Abre esta página desde el celular del truck
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ec4899] mt-0.5">2.</span>
              Toca "Estoy Operando" al empezar tu jornada
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ec4899] mt-0.5">3.</span>
              Tu ubicación se actualiza automáticamente cada 30 segundos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ec4899] mt-0.5">4.</span>
              Toca "Cerré" cuando termines — el truck desaparece de la web
            </li>
          </ul>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
          Mantén el navegador abierto para que el GPS siga activo
        </p>
      </div>
    </div>
  );
}
