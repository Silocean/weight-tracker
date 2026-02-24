import { subDays, parseISO, format } from 'date-fns'
import type { WeightRecord, WeightStats } from '../types'

export function computeStats(records: WeightRecord[]): WeightStats {
  if (records.length === 0) {
    return {
      current: null,
      highest: null,
      lowest: null,
      average: null,
      change7d: null,
      changeTotal: null,
      totalDays: 0,
      streak: 0,
    }
  }

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
  const weights = sorted.map((r) => r.weight)
  const current = weights[0]
  const highest = Math.max(...weights)
  const lowest = Math.min(...weights)
  const average = weights.reduce((s, w) => s + w, 0) / weights.length

  const today = format(new Date(), 'yyyy-MM-dd')
  const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')
  const recordsBeforeOrOn7d = sorted.filter((r) => r.date <= sevenDaysAgo)
  const change7d =
    recordsBeforeOrOn7d.length > 0
      ? current - recordsBeforeOrOn7d[0].weight
      : null

  const oldest = sorted[sorted.length - 1]
  const changeTotal = sorted.length > 1 ? current - oldest.weight : null

  const streak = computeStreak(sorted, today)

  return {
    current,
    highest,
    lowest,
    average: Math.round(average * 10) / 10,
    change7d: change7d !== null ? Math.round(change7d * 10) / 10 : null,
    changeTotal:
      changeTotal !== null ? Math.round(changeTotal * 10) / 10 : null,
    totalDays: records.length,
    streak,
  }
}

function computeStreak(
  sortedDesc: WeightRecord[],
  today: string,
): number {
  const dateSet = new Set(sortedDesc.map((r) => r.date))
  let streak = 0
  let day = parseISO(today)
  while (dateSet.has(format(day, 'yyyy-MM-dd'))) {
    streak++
    day = subDays(day, 1)
  }
  return streak
}

export function filterByRange(
  records: WeightRecord[],
  range: '7d' | '30d' | '90d' | 'all',
): WeightRecord[] {
  if (range === 'all') return records
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const cutoff = format(subDays(new Date(), days), 'yyyy-MM-dd')
  return records.filter((r) => r.date >= cutoff)
}
