import { FLIGHT_ORIGINS, getFlightTips } from '../data/flights'
import { getRegionMeta } from '../data/regions'
import { calculateTripBudget } from '../utils/budget'
import type { FlightOrigin } from '../types'
import {
  CURRENCIES,
  formatForeign,
  formatMoneyDual,
  formatRangeDual,
  formatThb,
  getCurrency,
} from '../utils/currency'
import type { CurrencyCode, TripConfig, TripPlan } from '../types'

interface BudgetPanelProps {
  plan: TripPlan
  onConfigChange?: (config: TripConfig) => void
  readOnly?: boolean
}

export function BudgetPanel({ plan, onConfigChange, readOnly = false }: BudgetPanelProps) {
  const { config } = plan
  const summary = calculateTripBudget(plan)
  const currencyMeta = getCurrency(config.currency)
  const rate = config.exchangeRate
  const regionMeta = getRegionMeta(config.regionId)
  const hubTransferNote = regionMeta.needsHubTransfer
    ? `、${regionMeta.hubTransferLabel}`
    : ''

  const patch = (partial: Partial<TripConfig>) => {
    onConfigChange?.({ ...config, ...partial })
  }

  const handleCurrencyChange = (code: CurrencyCode) => {
    const meta = getCurrency(code)
    patch({
      currency: code,
      exchangeRate: meta.defaultUnitsPerThb,
    })
  }

  return (
    <section className="panel-card rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-semibold text-slate-900">預算試算</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        含機票（可關閉）、景點、市區／景點間交通{hubTransferNote}、住宿、餐飲
      </p>

      {!readOnly && (
      <div className="mt-3 grid gap-3">
        <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={config.includeFlights !== false}
              onChange={(e) =>
                patch({
                  includeFlights: e.target.checked,
                  ...(e.target.checked ? {} : { customFlightTotalThb: undefined }),
                })
              }
              className="size-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            計入來回機票
          </label>

          {config.includeFlights !== false && (
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-xs text-slate-600">
                出發地
                <select
                  value={config.flightOrigin ?? 'taiwan'}
                  onChange={(e) =>
                    patch({ flightOrigin: e.target.value as FlightOrigin })
                  }
                  className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 outline-none ring-teal-400 focus:ring-2"
                >
                  {FLIGHT_ORIGINS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}（{o.airports}）
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-xs text-slate-600">
                自訂機票總價（泰銖，選填）
                <input
                  type="number"
                  min={0}
                  step={500}
                  placeholder="留空則依出發地自動估算"
                  value={config.customFlightTotalThb ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    patch({
                      customFlightTotalThb:
                        v === '' ? undefined : Math.max(0, Number(v)),
                    })
                  }}
                  className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 outline-none ring-teal-400 focus:ring-2"
                />
              </label>
            </div>
          )}
        </div>
        <label className="grid gap-1 text-xs text-slate-600">
          顯示幣別
          <select
            value={config.currency}
            onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
            className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 outline-none ring-teal-400 focus:ring-2"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}（{c.symbol}）
              </option>
            ))}
          </select>
        </label>

        {config.currency !== 'THB' && (
          <label className="grid gap-1 text-xs text-slate-600">
            匯率（1 泰銖 = ? {currencyMeta.label}）
            <div className="flex gap-2">
              <input
                type="number"
                min={0.0001}
                step={0.001}
                value={rate}
                onChange={(e) =>
                  patch({ exchangeRate: Math.max(0.0001, Number(e.target.value) || rate) })
                }
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 outline-none ring-teal-400 focus:ring-2"
              />
              <button
                type="button"
                onClick={() => patch({ exchangeRate: currencyMeta.defaultUnitsPerThb })}
                className="shrink-0 rounded-lg bg-slate-100 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
              >
                參考值
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              參考：1 THB ≈ {currencyMeta.defaultUnitsPerThb} {config.currency}；
              港幣／人民幣另以列表參考值換算（可切換幣別單獨調整）
            </span>
          </label>
        )}

        <label className="grid gap-1 text-xs text-slate-600">
          整趟預算上限（選填，{currencyMeta.label}）
          <input
            type="number"
            min={0}
            step={1000}
            placeholder="例如 30000"
            value={config.tripBudgetForeign ?? ''}
            onChange={(e) => {
              const v = e.target.value
              patch({ tripBudgetForeign: v === '' ? undefined : Math.max(0, Number(v)) })
            }}
            className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 outline-none ring-teal-400 focus:ring-2"
          />
        </label>
      </div>
      )}

      {config.includeFlights !== false && (
        <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
          {getFlightTips(config.regionId).map((tip) => (
            <li key={tip}>· {tip}</li>
          ))}
        </ul>
      )}

      <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
        {summary.lines.map((line) => (
          <li key={line.id} className="flex flex-col gap-0.5">
            <div className="flex justify-between gap-2">
              <span className="text-slate-700">{line.label}</span>
              <span className="shrink-0 text-right font-medium text-slate-900">
                {line.minThb === line.maxThb
                  ? formatMoneyDual(line.minThb, config.currency, rate)
                  : formatRangeDual(line.minThb, line.maxThb, config.currency, rate)}
              </span>
            </div>
            {line.note && <span className="text-[11px] text-slate-400">{line.note}</span>}
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl bg-amber-50 px-3 py-3 ring-1 ring-amber-100">
        <p className="text-xs font-medium text-amber-900">預估總花費</p>
        <p className="mt-1 text-lg font-bold text-amber-950">
          {formatRangeDual(summary.totalMinThb, summary.totalMaxThb, config.currency, rate)}
        </p>
      </div>

      {summary.userBudgetThb != null && config.tripBudgetForeign != null && (
        <div
          className={`mt-3 rounded-xl px-3 py-2.5 text-sm ${
            summary.overBudget
              ? 'bg-rose-50 text-rose-800 ring-1 ring-rose-100'
              : 'bg-teal-50 text-teal-800 ring-1 ring-teal-100'
          }`}
        >
          <p>你的預算：{formatForeign(config.tripBudgetForeign, config.currency)}</p>
          {summary.overBudget ? (
            <p className="mt-1 text-xs">
              低標估算已超出約 {formatThb(summary.totalMinThb - summary.userBudgetThb)}
              ，建議刪減景點或調整預算。
            </p>
          ) : (
            <p className="mt-1 text-xs">
              以低標估算，尚可保留約 {formatThb(summary.userBudgetThb - summary.totalMinThb)}
              ；高標總計約 {formatThb(summary.totalMaxThb)}。
            </p>
          )}
        </div>
      )}
    </section>
  )
}
