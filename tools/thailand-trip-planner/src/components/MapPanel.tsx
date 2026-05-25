import { useMemo, useState } from 'react'
import { getHotelHub } from '../data/transport'
import { getPlaceById, getPlacesForRegion } from '../data/places'
import { getRegionMeta } from '../data/regions'
import { googleMapsDirUrl } from '../data/reading'
import type { TripPlan } from '../types'

interface MapPanelProps {
  plan: TripPlan
  onSelectPlace?: (placeId: string) => void
}

export function MapPanel({ plan, onSelectPlace }: MapPanelProps) {
  const { config } = plan
  const hub = getHotelHub(config.regionId, config.hotelArea)
  const regionMeta = getRegionMeta(config.regionId)
  const pickedPlaces = useMemo(() => {
    const pickedIds = new Set(plan.days.flatMap((d) => d.items.map((i) => i.placeId)))
    return getPlacesForRegion(config.regionId)
      .filter((p) => pickedIds.has(p.id))
      .slice(0, 8)
  }, [plan.days, config.regionId])

  const [selectedId, setSelectedId] = useState<string | null>(
    () => pickedPlaces[0]?.id ?? null,
  )

  const selected = selectedId ? getPlaceById(selectedId) : null
  const mapLat = selected?.lat ?? hub.lat
  const mapLng = selected?.lng ?? hub.lng
  const mapLabel = selected?.nameZh ?? hub.nameZh

  const handleSelect = (placeId: string) => {
    setSelectedId(placeId)
    onSelectPlace?.(placeId)
  }

  return (
    <section className="panel-card map-panel rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-bold text-slate-900">地圖與路線</h3>
      <p className="mt-1 text-sm text-slate-600">
        住宿中心：{hub.nameZh}
        {selected && (
          <>
            {' '}
            · 目前標示：<strong>{mapLabel}</strong>
          </>
        )}
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
        <iframe
          title={`${regionMeta.labelZh} map`}
          className="map-panel-frame"
          loading="lazy"
          src={`https://www.google.com/maps?q=${mapLat},${mapLng}&z=${regionMeta.mapZoom}&output=embed`}
        />
      </div>

      {pickedPlaces.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          尚無行程景點。請在「行程」分頁加入景點後，地圖會列出可導航地點。
        </p>
      ) : (
        <ul className="map-panel-list">
          {pickedPlaces.map((place) => {
            const active = selectedId === place.id
            return (
              <li key={place.id}>
                <button
                  type="button"
                  className={`map-panel-row ${active ? 'map-panel-row--active' : ''}`}
                  onClick={() => handleSelect(place.id)}
                >
                  <div className="map-panel-row-text">
                    <p className="font-medium text-slate-900">{place.nameZh}</p>
                    <p className="text-xs text-slate-500">{place.transportHint}</p>
                  </div>
                  <a
                    href={googleMapsDirUrl(hub.lat, hub.lng, place.lat, place.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="map-panel-nav"
                    onClick={(e) => e.stopPropagation()}
                  >
                    導航 →
                  </a>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
