import { useState } from 'react'
import { getPlaceById, getPlacesForRegion } from '../data/places'
import {
  SLOT_LABELS,
  type DayPlan,
  type ScheduledItem,
  type ThailandRegionId,
  type TimeSlot,
} from '../types'
import { formatMoneyDual } from '../utils/currency'
import type { BudgetLevel, CurrencyCode } from '../types'

interface DayTimelineProps {
  regionId: ThailandRegionId
  day: DayPlan
  budget: BudgetLevel
  travelers: number
  currency: CurrencyCode
  exchangeRate: number
  readOnly?: boolean
  onRemoveItem?: (itemId: string) => void
  onAddItem?: (slot: TimeSlot, placeId: string) => void
  onUpdateItem?: (itemId: string, patch: Partial<ScheduledItem>) => void
}

export function DayTimeline({
  regionId,
  day,
  budget,
  travelers,
  currency,
  exchangeRate,
  readOnly = false,
  onRemoveItem,
  onAddItem,
  onUpdateItem,
}: DayTimelineProps) {
  const slots = ['morning', 'afternoon', 'evening', 'night'] as TimeSlot[]
  const regionPlaces = getPlacesForRegion(regionId)

  return (
    <section className="panel-card rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="pt-subtitle">{day.label}</p>
      <p className="mt-1 text-xs text-slate-500">
        {readOnly
          ? '點開卡片可看交通與備註'
          : '點標題展開細節；可改時段、加備註或增刪景點'}
      </p>
      <div className="mt-3 space-y-4">
        {slots.map((slot) => {
          const items = day.items.filter((i) => i.slot === slot)
          return (
            <div key={slot} className="activity-slot">
              <p className="activity-slot-label">{SLOT_LABELS[slot]}</p>
              {items.length === 0 ? (
                readOnly ? (
                  <p className="text-sm text-slate-400">（未安排）</p>
                ) : (
                  onAddItem && (
                    <AddSlotControl
                      slot={slot}
                      places={regionPlaces}
                      onAdd={onAddItem}
                    />
                  )
                )
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <ActivityCard
                      key={item.id}
                      item={item}
                      budget={budget}
                      travelers={travelers}
                      currency={currency}
                      exchangeRate={exchangeRate}
                      readOnly={readOnly}
                      editable={!readOnly && !!onUpdateItem}
                      onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
                      onUpdate={
                        onUpdateItem
                          ? (patch) => onUpdateItem(item.id, patch)
                          : undefined
                      }
                    />
                  ))}
                  {!readOnly && onAddItem && (
                    <AddSlotControl
                      slot={slot}
                      places={regionPlaces}
                      onAdd={onAddItem}
                      compact
                    />
                  )}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ActivityCard({
  item,
  budget,
  travelers,
  currency,
  exchangeRate,
  readOnly,
  editable,
  onRemove,
  onUpdate,
}: {
  item: ScheduledItem
  budget: BudgetLevel
  travelers: number
  currency: CurrencyCode
  exchangeRate: number
  readOnly?: boolean
  editable?: boolean
  onRemove?: () => void
  onUpdate?: (patch: Partial<ScheduledItem>) => void
}) {
  const place = getPlaceById(item.placeId)
  const [expanded, setExpanded] = useState(false)
  if (!place) return null

  const cost = place.costThb[budget] * travelers
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery)}`
  const slots = ['morning', 'afternoon', 'evening', 'night'] as TimeSlot[]

  return (
    <li
      className={`activity-card ${expanded ? 'activity-card--open' : ''}`}
    >
      <div className="activity-card-head">
        <button
          type="button"
          className="activity-card-toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span className="activity-card-chevron" aria-hidden>
            {expanded ? '▾' : '▸'}
          </span>
          <span className="activity-card-head-text">
            <span className="activity-card-title-row">
              <span className="font-semibold text-slate-900">{place.nameZh}</span>
              {place.adultOnly && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  18+
                </span>
              )}
            </span>
            <span className="thai text-sm text-teal-800">{place.nameTh}</span>
          </span>
        </button>
        <div className="activity-card-head-actions">
          {!readOnly && editable && onUpdate && (
            <select
              className="activity-card-slot-select"
              value={item.slot}
              aria-label="時段"
              onChange={(e) =>
                onUpdate({ slot: e.target.value as TimeSlot })
              }
              onClick={(e) => e.stopPropagation()}
            >
              {slots.map((s) => (
                <option key={s} value={s}>
                  {SLOT_LABELS[s]}
                </option>
              ))}
            </select>
          )}
          {!readOnly && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="activity-card-remove"
              aria-label="移除"
            >
              移除
            </button>
          )}
        </div>
      </div>

      {!expanded && (
        <p className="activity-card-summary">{place.description}</p>
      )}

      {expanded && (
        <div className="activity-card-body">
          <p className="text-sm text-slate-600">{place.description}</p>
          <p className="mt-1 text-xs text-sky-800">🚗 {place.transportHint}</p>
          <p className="mt-1 text-xs text-amber-800">💡 {place.tip}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{place.area}</span>
            <span>·</span>
            <span>約 {place.durationHours} 小時</span>
            <span>·</span>
            <span className="font-medium text-slate-700">
              {formatMoneyDual(cost, currency, exchangeRate)}
            </span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-auto font-medium text-teal-700 hover:underline"
            >
              地圖 →
            </a>
          </div>
          {!readOnly && editable && onUpdate && (
            <label className="activity-card-note">
              <span>我的備註</span>
              <textarea
                rows={2}
                placeholder="例如：需預約、避開週末人潮…"
                value={item.note ?? ''}
                onChange={(e) => onUpdate({ note: e.target.value })}
              />
            </label>
          )}
          {readOnly && item.note && (
            <p className="activity-card-note-readonly">
              <span>備註</span> {item.note}
            </p>
          )}
        </div>
      )}
    </li>
  )
}

function AddSlotControl({
  slot,
  places,
  onAdd,
  compact = false,
}: {
  slot: TimeSlot
  places: ReturnType<typeof getPlacesForRegion>
  onAdd: (slot: TimeSlot, placeId: string) => void
  compact?: boolean
}) {
  return (
    <label
      className={`activity-add ${compact ? 'activity-add--compact' : ''}`}
    >
      <span className="shrink-0">{compact ? '＋' : '＋ 加入景點'}</span>
      <select
        className="activity-add-select"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            onAdd(slot, e.target.value)
            e.target.value = ''
          }
        }}
      >
        <option value="" disabled>
          選擇景點…
        </option>
        {places.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nameZh}
          </option>
        ))}
      </select>
    </label>
  )
}
