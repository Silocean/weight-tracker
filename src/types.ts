export interface WeightRecord {
  id: string
  date: string // YYYY-MM-DD
  weight: number // kg
  note?: string
}

export interface UserSettings {
  height: number // cm, 0 means not set
  goalWeight: number // kg, 0 means not set
  darkMode: 'system' | 'light' | 'dark'
  gistToken: string
  gistId: string
  lastSyncAt: string // ISO string, '' means never
}

export interface WeightStats {
  current: number | null
  highest: number | null
  lowest: number | null
  average: number | null
  change7d: number | null
  changeTotal: number | null
  totalDays: number
  streak: number
}

export type TimeRange = '7d' | '30d' | '90d' | 'all'
