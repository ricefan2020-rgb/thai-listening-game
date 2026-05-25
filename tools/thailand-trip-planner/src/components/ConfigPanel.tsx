import { FLIGHT_ORIGINS } from '../data/flights'
import { getRegionMeta, REGION_LIST } from '../data/regions'
import {
  BUDGET_LABELS,
  INTEREST_LABELS,
  type BudgetLevel,
  type CurrencyCode,
  type FlightOrigin,
  type Interest,
  type ThailandRegionId,
  type TripConfig,
} from '../types'
import { CURRENCIES, getCurrency } from '../utils/currency'
import { NumericInput } from './NumericInput'

const ALL_INTERESTS = Object.keys(INTEREST_LABELS) as Interest[]

interface ConfigPanelProps {
  config: TripConfig
  onChange: (config: TripConfig) => void
  onGenerate: () => void
}

export function ConfigPanel({ config, onChange, onGenerate }: ConfigPanelProps) {
  const regionMeta = getRegionMeta(config.regionId)

  const setRegion = (regionId: ThailandRegionId) => {
    const meta = getRegionMeta(regionId)
    const interests = config.interests.filter(
      (i) => i !== 'adultNightlife' || meta.supportsAdultNightlife,
    )
    onChange({
      ...config,
      regionId,
      hotelArea: meta.defaultHotelArea,
      title: meta.defaultTitle,
      arrivalTransportId: undefined,
      interests,
    })
  }

  const toggleInterest = (id: Interest) => {
    const next = config.interests.includes(id)
      ? config.interests.filter((i) => i !== id)
      : [...config.interests, id]
    onChange({ ...config, interests: next })
  }

  return (
    <section className="setup-form rounded-2xl bg-white p-5 shadow-sm ring-1 ring-teal-100">
      <header className="setup-form-header">
        <h2>行程設定</h2>
        <p>選好偏好後一鍵排程，之後可在文章內微調</p>
      </header>

      <div className="setup-form-body">
        <fieldset className="setup-form-block">
          <legend>基本資料</legend>
        <label className="setup-field setup-field--full">
          目的地
          <select
            value={config.regionId}
            onChange={(e) => setRegion(e.target.value as ThailandRegionId)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
          >
            {REGION_LIST.map((r) => (
              <option key={r.id} value={r.id}>
                {r.labelZh}
              </option>
            ))}
          </select>
        </label>
        <label className="setup-field setup-field--full">
          行程名稱
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
          />
        </label>

        <div className="setup-field-row">
          <label className="setup-field">
            出發日期
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => onChange({ ...config, startDate: e.target.value })}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            />
          </label>
          <label className="setup-field">
            天數
            <NumericInput
              aria-label="天數"
              min={1}
              max={7}
              value={config.days}
              onChange={(days) => onChange({ ...config, days })}
              className="field-touch rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            />
          </label>
        </div>

        </fieldset>

        <fieldset className="setup-form-block">
          <legend>預算與幣別</legend>
        <div className="setup-field-row">
          <label className="setup-field">
            人數
            <NumericInput
              aria-label="人數"
              min={1}
              max={12}
              value={config.travelers}
              onChange={(travelers) => onChange({ ...config, travelers })}
              className="field-touch rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            />
          </label>
          <label className="setup-field">
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

        <div className="setup-field-row">
          <label className="setup-field">
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
            <label className="setup-field">
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
            <label className="setup-field">
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
          <label className="setup-field setup-field--full">
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

        <div className="setup-flight-box">
          <label className="setup-checkbox">
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
            <label className="setup-field setup-field--full">
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

        </fieldset>

        <fieldset className="setup-form-block">
          <legend>偏好</legend>
        <div className="setup-field-row">
          <label className="setup-field">
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
          <label className="setup-field">
            住宿區域
            <select
              value={config.hotelArea}
              onChange={(e) =>
                onChange({
                  ...config,
                  hotelArea: e.target.value,
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none ring-teal-400 focus:ring-2"
            >
              {regionMeta.hotelAreas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="setup-interests">
          <p className="setup-interests-label">興趣主題（可多選）</p>
          <div className="setup-interest-pills">
            {ALL_INTERESTS.map((id) => {
              if (id === 'adultNightlife' && !regionMeta.supportsAdultNightlife) {
                return null
              }
              const active = config.interests.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleInterest(id)}
                  className={`setup-interest-pill ${active ? 'setup-interest-pill--active' : ''}`}
                >
                  {INTEREST_LABELS[id]}
                </button>
              )
            })}
          </div>
        </div>
        </fieldset>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        className="setup-form-submit"
      >
        自動生成行程
      </button>
    </section>
  )
}
