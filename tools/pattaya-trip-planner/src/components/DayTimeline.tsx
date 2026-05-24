import { PLACES, getPlaceById } from '../data/places'
import { SLOT_LABELS, type DayPlan, type ScheduledItem, type TimeSlot } from '../types'
import { formatMoneyDual } from '../utils/currency'
import type { BudgetLevel, CurrencyCode } from '../types'

interface DayTimelineProps {
  day: DayPlan
  budget: BudgetLevel
  travelers: number
  currency: CurrencyCode
  exchangeRate: number
  readOnly?: boolean
  onRemoveItem?: (itemId: string) => void
  onAddItem?: (slot: TimeSlot, placeId: string) => void
}

export function DayTimeline({
  day,
  budget,
  travelers,
  currency,
  exchangeRate,
  readOnly = false,
  onRemoveItem,
  onAddItem,
}: DayTimelineProps) {
  const slots = ['morning', 'afternoon', 'evening', 'night'] as TimeSlot[]

  return (
    <section className="panel-card rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="pt-subtitle">{day.label}</p>
      <div className="mt-3 space-y-4">
        {slots.map((slot) => {
          const items = day.items.filter((i) => i.slot === slot)
          return (
            <div key={slot}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                {SLOT_LABELS[slot]}
              </p>
              {items.length === 0 ? (
                readOnly ? (
                  <p className="text-sm text-slate-400">（未安排）</p>
                ) : (
                  onAddItem && <AddSlotControl slot={slot} onAdd={onAddItem} />
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
                      onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
                    />
                  ))}
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
  onRemove,
}: {
  item: ScheduledItem
  budget: BudgetLevel
  travelers: number
  currency: CurrencyCode
  exchangeRate: number
  readOnly?: boolean
  onRemove?: () => void
}) {
  const place = getPlaceById(item.placeId)
  if (!place) return null

  const cost = place.costThb[budget] * travelers
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery)}`

  return (
    <li className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-teal-50/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-slate-900">{place.nameZh}</h4>
            {place.adultOnly && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                18+
              </span>
            )}
          </div>
          <p className="thai text-sm text-teal-800">{place.nameTh}</p>
        </div>
        {!readOnly && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
            aria-label="移除"
          >
            移除
          </button>
        )}
      </div>
      <p className="mt-1.5 text-sm text-slate-600">{place.description}</p>
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
    </li>
  )
}

function AddSlotControl({
  slot,
  onAdd,
}: {
  slot: TimeSlot
  onAdd: (slot: TimeSlot, placeId: string) => void
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
      <span className="shrink-0">＋ 加入景點</span>
      <select
        className="min-w-0 flex-1 rounded-lg border-0 bg-transparent text-slate-800 outline-none"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            onAdd(slot, e.target.value)
            e.target.value = ''
          }
        }}
      >
        <option value="" disabled>
          選擇…
        </option>
        {PLACES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nameZh}
          </option>
        ))}
      </select>
    </label>
  )
}
