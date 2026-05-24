import { estimateFlightCost } from '../data/flights'
import {
  estimateItineraryLegTransport,
  estimateLocalTransportCost,
  estimateRoundTripTransferCost,
} from '../data/transport'
import type { TripConfig, TripPlan } from '../types'
import { foreignToThb, getFoodEstimateThb, getHotelEstimateThb } from './currency'
import { estimateTripCost } from './planner'

export interface BudgetLine {
  id: string
  label: string
  minThb: number
  maxThb: number
  note?: string
}

export interface TripBudgetSummary {
  lines: BudgetLine[]
  totalMinThb: number
  totalMaxThb: number
  activitiesThb: number
  transportMinThb: number
  transportMaxThb: number
  userBudgetThb: number | null
  overBudget: boolean | null
}

function nightsForTrip(days: number): number {
  return Math.max(1, days - 1)
}

export function calculateTripBudget(plan: TripPlan): TripBudgetSummary {
  const { config } = plan
  const activitiesThb = estimateTripCost(plan)
  const nights = nightsForTrip(config.days)
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

  const hotel = getHotelEstimateThb(config.budget, nights)
  const food = getFoodEstimateThb(config.budget, config.days, config.travelers)
  const flight = estimateFlightCost(config)

  const lines: BudgetLine[] = []

  if (flight) {
    lines.push({
      id: 'flight',
      label: '來回機票',
      minThb: flight.min,
      maxThb: flight.max,
      note: flight.note,
    })
  }

  lines.push(
    {
      id: 'activities',
      label: '景點／活動（行程表）',
      minThb: activitiesThb,
      maxThb: activitiesThb,
      note: '依目前排程景點加總',
    },
    {
      id: 'transport-local',
      label: '市區日常交通',
      minThb: local.min,
      maxThb: local.max,
      note: `雙條／Grab 等 · ${config.days} 天`,
    },
    {
      id: 'transport-legs',
      label: '景點間交通',
      minThb: legs.min,
      maxThb: legs.max,
      note: activityCount > 0 ? `約 ${activityCount} 趟` : '尚無排程景點',
    },
    {
      id: 'transport-bkk',
      label: '曼谷↔芭提雅來回',
      minThb: roundTrip.min,
      maxThb: roundTrip.max,
      note: roundTrip.option.nameZh,
    },
    {
      id: 'hotel',
      label: `住宿（約 ${nights} 晚）`,
      minThb: hotel.min,
      maxThb: hotel.max,
      note: '不含押金與旺季漲價',
    },
    {
      id: 'food',
      label: '餐飲',
      minThb: food.min,
      maxThb: food.max,
      note: `${config.days} 天 · ${config.travelers} 人`,
    },
  )

  const transportMinThb = local.min + legs.min + roundTrip.min
  const transportMaxThb = local.max + legs.max + roundTrip.max

  const totalMinThb = lines.reduce((s, l) => s + l.minThb, 0)
  const totalMaxThb = lines.reduce((s, l) => s + l.maxThb, 0)

  let userBudgetThb: number | null = null
  let overBudget: boolean | null = null
  if (config.tripBudgetForeign != null && config.tripBudgetForeign > 0) {
    userBudgetThb = foreignToThb(config.tripBudgetForeign, config.exchangeRate)
    overBudget = userBudgetThb < totalMinThb
  }

  return {
    lines,
    totalMinThb,
    totalMaxThb,
    activitiesThb,
    transportMinThb,
    transportMaxThb,
    userBudgetThb,
    overBudget,
  }
}

