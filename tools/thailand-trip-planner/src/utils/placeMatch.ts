import { getPlacesForRegion } from '../data/places'
import type { ThailandRegionId } from '../types'

/** 依中文名稱在景點庫中找可加入行程的 placeId（美食／住宿推介用） */
export function findLinkedPlaceId(
  regionId: ThailandRegionId,
  nameZh: string,
): string | undefined {
  const normalized = nameZh.replace(/\s+/g, '').toLowerCase()
  const places = getPlacesForRegion(regionId)
  const exact = places.find((p) => p.nameZh.replace(/\s+/g, '').toLowerCase() === normalized)
  if (exact) return exact.id
  const partial = places.find((p) => {
    const pn = p.nameZh.replace(/\s+/g, '').toLowerCase()
    return pn.includes(normalized) || normalized.includes(pn)
  })
  return partial?.id
}
