import {
  GETTING_TO_PATTAYA,
  LOCAL_TRANSPORT,
  TRANSPORT_PHRASES,
  estimateItineraryLegTransport,
  estimateLocalTransportCost,
  estimateRoundTripTransferCost,
  estimateTransportOptionCost,
  getTransportTipsForArea,
} from '../data/transport'
import { formatRangeWithCnyHkd } from '../utils/currency'
import type { TripConfig, TripPlan } from '../types'

interface TransportGuideProps {
  plan: TripPlan
  onConfigChange?: (config: TripConfig) => void
  readOnly?: boolean
}

export function TransportGuide({ plan, onConfigChange, readOnly = false }: TransportGuideProps) {
  const { config } = plan
  const { currency, exchangeRate } = config
  const activityCount = plan.days.reduce((n, d) => n + d.items.length, 0)
  const local = estimateLocalTransportCost(config.budget, config.days, config.travelers)
  const legs = estimateItineraryLegTransport(
    activityCount,
    config.budget,
    config.travelers,
  )
  const roundTrip = estimateRoundTripTransferCost(
    config.budget,
    config.travelers,
    config.arrivalTransportId,
  )
  const areaTips = getTransportTipsForArea(config.hotelArea)

  const transportTotalMin = local.min + legs.min + roundTrip.min
  const transportTotalMax = local.max + legs.max + roundTrip.max

  return (
    <section className="panel-card rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-bold text-slate-900">交通指南與費用</h3>
      <p className="mt-1 text-sm text-slate-600">
        交通費試算（含來回曼谷）：
        <span className="mt-1 block font-semibold text-teal-800">
          {formatRangeWithCnyHkd(transportTotalMin, transportTotalMax, currency, exchangeRate)}
        </span>
      </p>

      {!readOnly && onConfigChange ? (
        <label className="mt-3 grid gap-1 text-xs text-slate-600">
          曼谷↔芭提雅交通方式（影響來回預算）
          <select
            value={config.arrivalTransportId ?? ''}
            onChange={(e) =>
              onConfigChange({
                ...config,
                arrivalTransportId: e.target.value || undefined,
              })
            }
            className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 outline-none ring-teal-400 focus:ring-2"
          >
            <option value="">依預算等級自動（{roundTrip.option.nameZh}）</option>
            {GETTING_TO_PATTAYA.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nameZh}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="mt-3 text-sm text-slate-600">
          曼谷來回採用：<span className="font-medium">{roundTrip.option.nameZh}</span>
        </p>
      )}

      <ul className="mt-3 space-y-1 rounded-xl bg-teal-50/60 px-3 py-2 text-sm text-slate-700">
        <li className="flex justify-between gap-2">
          <span>市區日常</span>
          <span className="shrink-0 text-right font-medium">
            {formatRangeWithCnyHkd(local.min, local.max, currency, exchangeRate)}
          </span>
        </li>
        <li className="flex justify-between gap-2">
          <span>景點間（{activityCount} 趟）</span>
          <span className="shrink-0 text-right font-medium">
            {formatRangeWithCnyHkd(legs.min, legs.max, currency, exchangeRate)}
          </span>
        </li>
        <li className="flex justify-between gap-2">
          <span>曼谷來回</span>
          <span className="shrink-0 text-right font-medium">
            {formatRangeWithCnyHkd(roundTrip.min, roundTrip.max, currency, exchangeRate)}
          </span>
        </li>
      </ul>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {GETTING_TO_PATTAYA.map((item) => {
          const cost = estimateTransportOptionCost(item, config.budget, config.travelers)
          const roundMin = cost.min * 2
          const roundMax = cost.max * 2
          const selected =
            (config.arrivalTransportId ?? roundTrip.option.id) === item.id
          return (
            <article
              key={item.id}
              className={`rounded-xl border p-3 ${
                selected
                  ? 'border-teal-300 bg-teal-50/80 ring-1 ring-teal-200'
                  : 'border-slate-100 bg-slate-50'
              }`}
            >
              <p className="font-semibold text-slate-900">{item.nameZh}</p>
              <p className="thai text-sm text-teal-800">{item.nameTh}</p>
              <p className="mt-1 text-xs text-slate-500">{item.duration}</p>
              <p className="mt-1 text-sm font-medium text-amber-900">
                單程{' '}
                {formatRangeWithCnyHkd(cost.min, cost.max, currency, exchangeRate)}
              </p>
              <p className="text-xs text-amber-800">
                來回{' '}
                {formatRangeWithCnyHkd(roundMin, roundMax, currency, exchangeRate)}
              </p>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <p className="mt-1 text-xs text-amber-800">💡 {item.tip}</p>
            </article>
          )
        })}
      </div>

      <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 p-3">
        <p className="text-sm font-semibold text-teal-900">芭提雅市區移動（參考單價）</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {LOCAL_TRANSPORT.map((item) => (
            <li key={item.id}>
              <span className="font-medium">{item.nameZh}</span>（{item.nameTh}）· {item.priceHint}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-900">依住宿區提醒</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {areaTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
        <p className="text-sm font-semibold text-amber-900">交通泰文句型</p>
        <ul className="mt-2 space-y-1 text-sm">
          {TRANSPORT_PHRASES.map((p) => (
            <li key={p.th}>
              <span className="thai text-teal-900">{p.th}</span>
              <span className="mx-2 text-slate-400">—</span>
              <span className="text-slate-700">{p.zh}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
