import { getHotelHub } from '../data/transport'
import { getPlacesForRegion } from '../data/places'
import { getRegionMeta } from '../data/regions'
import { googleMapsDirUrl } from '../data/reading'
import type { TripPlan } from '../types'

interface MapPanelProps {
  plan: TripPlan
}

export function MapPanel({ plan }: MapPanelProps) {
  const { config } = plan
  const hub = getHotelHub(config.regionId, config.hotelArea)
  const regionMeta = getRegionMeta(config.regionId)
  const pickedIds = new Set(plan.days.flatMap((d) => d.items.map((i) => i.placeId)))
  const pickedPlaces = getPlacesForRegion(config.regionId)
    .filter((p) => pickedIds.has(p.id))
    .slice(0, 8)

  return (
    <section className="panel-card rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-bold text-slate-900">地圖與路線</h3>
      <p className="mt-1 text-sm text-slate-600">住宿中心：{hub.nameZh}</p>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
        <iframe
          title={`${regionMeta.labelZh} map`}
          className="h-64 w-full"
          loading="lazy"
          src={`https://www.google.com/maps?q=${hub.lat},${hub.lng}&z=${regionMeta.mapZoom}&output=embed`}
        />
      </div>

      <div className="mt-3 space-y-2">
        {pickedPlaces.map((place) => (
          <div key={place.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <div>
              <p className="font-medium text-slate-900">{place.nameZh}</p>
              <p className="text-xs text-slate-500">{place.transportHint}</p>
            </div>
            <a
              href={googleMapsDirUrl(hub.lat, hub.lng, place.lat, place.lng)}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 font-semibold text-teal-700 hover:underline"
            >
              導航 →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
