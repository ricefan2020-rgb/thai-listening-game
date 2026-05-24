import { FLIGHT_ORIGINS } from '../data/flights'
import {
  BUDGET_LABELS,
  INTEREST_LABELS,
  type BudgetLevel,
  type CurrencyCode,
  type FlightOrigin,
  type Interest,
  type TripConfig,
} from '../types'
import { CURRENCIES, getCurrency } from '../utils/currency'

const ALL_INTERESTS = Object.keys(INTEREST_LABELS) as Interest[]

interface ConfigPanelProps {
  config: TripConfig
  onChange: (config: TripConfig) => void
  onGenerate: () => void
}

export function ConfigPanel({ config, onChange, onGenerate }: ConfigPanelProps) {
  const toggleInterest = (id: Interest) => {
    const next = config.interests.includes(id)
      ? config.interests.filter((i) => i !== id)
      : [...config.interests, id]
    onChange({ ...config, interests: next })
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-teal-100">
      <h2>行程設定</h2>
      <p className="mt-1 text-stone-500">選好偏好後，一鍵自動排程，再手動微調</p>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-1.5 text-sm text-slate-600">
          行程名稱
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-sm text-slate-600">
            出發日期
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => onChange({ ...config, startDate: e.target.value })}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5 text-sm text-slate-600">
            天數
            <input
              type="number"
              min={1}
              max={7}
              value={config.days}
              onChange={(e) =>
                onChange({ ...config, days: Math.min(7, Math.max(1, Number(e.target.value))) })
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-sm text-slate-600">
            人數
            <input
              type="number"
              min={1}
              max={12}
              value={config.travelers}
              onChange={(e) =>
                onChange({
                  ...config,
                  travelers: Math.min(12, Math.max(1, Number(e.target.value))),
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            />
          </label>
          <label className="grid gap-1.5 text-sm text-slate-600">
            預算等級
            <select
              value={config.budget}
              onChange={(e) => onChange({ ...config, budget: e.target.value as BudgetLevel })}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            >
              {(Object.keys(BUDGET_LABELS) as BudgetLevel[]).map((b) => (
                <option key={b} value={b}>
                  {BUDGET_LABELS[b]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-sm text-slate-600">
            顯示幣別
            <select
              value={config.currency}
              onChange={(e) => {
                const code = e.target.value as CurrencyCode
                const meta = getCurrency(code)
                onChange({
                  ...config,
                  currency: code,
                  exchangeRate: meta.defaultUnitsPerThb,
                })
              }}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          {config.currency !== 'THB' ? (
            <label className="grid gap-1.5 text-sm text-slate-600">
              匯率（1 THB = ?）
              <input
                type="number"
                min={0.0001}
                step={0.001}
                value={config.exchangeRate}
                onChange={(e) =>
                  onChange({
                    ...config,
                    exchangeRate: Math.max(0.0001, Number(e.target.value) || config.exchangeRate),
                  })
                }
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
              />
            </label>
          ) : (
            <label className="grid gap-1.5 text-sm text-slate-600">
              整趟預算上限（฿，選填）
              <input
                type="number"
                min={0}
                step={1000}
                placeholder="例如 50000"
                value={config.tripBudgetForeign ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  onChange({
                    ...config,
                    tripBudgetForeign: v === '' ? undefined : Math.max(0, Number(v)),
                  })
                }}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
              />
            </label>
          )}
        </div>

        {config.currency !== 'THB' && (
          <label className="grid gap-1.5 text-sm text-slate-600">
            整趟預算上限（{getCurrency(config.currency).label}，選填）
            <input
              type="number"
              min={0}
              step={1000}
              placeholder="例如 30000"
              value={config.tripBudgetForeign ?? ''}
              onChange={(e) => {
                const v = e.target.value
                onChange({
                  ...config,
                  tripBudgetForeign: v === '' ? undefined : Math.max(0, Number(v)),
                })
              }}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            />
          </label>
        )}

        <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={config.includeFlights !== false}
              onChange={(e) =>
                onChange({
                  ...config,
                  includeFlights: e.target.checked,
                })
              }
              className="size-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            預算含來回機票
          </label>
          {config.includeFlights !== false && (
            <label className="mt-3 grid gap-1.5 text-sm text-slate-600">
              出發地
              <select
                value={config.flightOrigin ?? 'taiwan'}
                onChange={(e) =>
                  onChange({
                    ...config,
                    flightOrigin: e.target.value as FlightOrigin,
                  })
                }
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
              >
                {FLIGHT_ORIGINS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} — {o.airports}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-sm text-slate-600">
            行程節奏
            <select
              value={config.pace}
              onChange={(e) =>
                onChange({
                  ...config,
                  pace: e.target.value as TripConfig['pace'],
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            >
              <option value="relaxed">悠閒（每天約 3 段）</option>
              <option value="balanced">均衡（每天約 4 段）</option>
              <option value="packed">緊湊（每天最多 5 段）</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm text-slate-600">
            住宿區域
            <select
              value={config.hotelArea}
              onChange={(e) =>
                onChange({
                  ...config,
                  hotelArea: e.target.value as TripConfig['hotelArea'],
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            >
              <option value="central">市中心 / Beach Road</option>
              <option value="jomtien">喬提恩（較安靜）</option>
              <option value="north">北芭（近真理寺、人妖秀）</option>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-600">興趣主題（可多選）</legend>
          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS.map((id) => {
              const active = config.interests.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleInterest(id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {INTEREST_LABELS[id]}
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:from-teal-500 hover:to-cyan-500 active:scale-[0.98]"
      >
        自動生成行程
      </button>
    </section>
  )
}
