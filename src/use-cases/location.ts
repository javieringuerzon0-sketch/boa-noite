import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export interface TruckLocation {
  lat: number
  lng: number
  address: string
  updatedAt: string
  isActive: boolean
}

interface LocationStore {
  location: TruckLocation | null
  setLocation: (loc: TruckLocation) => void
  clearLocation: () => void
}

export const useTruckLocation = create<LocationStore>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (loc) => set({ location: loc }),
      clearLocation: () => set({ location: null }),
    }),
    { name: 'boa-noite-truck-location' }
  )
)

// ── Supabase sync ──────────────────────────────────────────────

export async function fetchLocationFromDB(): Promise<TruckLocation | null> {
  const { data, error } = await supabase
    .from('truck_location')
    .select('*')
    .eq('id', 1)
    .single()
  if (error || !data) return null
  return {
    lat: data.lat,
    lng: data.lng,
    address: data.address,
    updatedAt: data.updated_at,
    isActive: data.is_active,
  }
}

export async function syncLocationToDB(loc: TruckLocation): Promise<void> {
  await supabase.from('truck_location').upsert({
    id: 1,
    lat: loc.lat,
    lng: loc.lng,
    address: loc.address,
    updated_at: loc.updatedAt,
    is_active: loc.isActive,
  })
}

export async function clearLocationInDB(): Promise<void> {
  await supabase
    .from('truck_location')
    .update({ is_active: false })
    .eq('id', 1)
}

export function subscribeToLocation(
  callback: (loc: TruckLocation | null) => void
) {
  const channel = supabase
    .channel('truck-location')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'truck_location', filter: 'id=eq.1' },
      (payload) => {
        const d = payload.new as Record<string, unknown>
        if (!d || !d.is_active) {
          callback(null)
          return
        }
        callback({
          lat: d.lat as number,
          lng: d.lng as number,
          address: d.address as string,
          updatedAt: d.updated_at as string,
          isActive: d.is_active as boolean,
        })
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}

// ── Utilities ──────────────────────────────────────────────────

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { 'Accept-Language': 'es' } }
    )
    const data = await res.json()
    const { road, suburb, neighbourhood, city, town } = (data.address ?? {}) as Record<string, string>
    return [road, suburb ?? neighbourhood, city ?? town].filter(Boolean).join(', ') || data.display_name
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora mismo'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)} días`
}
