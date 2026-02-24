import { TrendingDown, TrendingUp, Minus, Target, Activity, Calendar } from 'lucide-react'
import type { WeightStats, UserSettings } from '../types'
import { calculateBMI, getBMICategory, BMI_LABELS, BMI_COLORS } from '../utils/bmi'

interface StatsCardsProps {
  stats: WeightStats
  settings: UserSettings
}

function ChangeIndicator({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-400 text-sm">--</span>
  const icon =
    value < 0 ? (
      <TrendingDown className="w-4 h-4" />
    ) : value > 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <Minus className="w-4 h-4" />
    )
  const color =
    value < 0
      ? 'text-emerald-500'
      : value > 0
        ? 'text-rose-500'
        : 'text-gray-400'
  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${color}`}>
      {icon}
      {value > 0 ? '+' : ''}
      {value} kg
    </span>
  )
}

export default function StatsCards({ stats, settings }: StatsCardsProps) {
  const bmi =
    stats.current && settings.height
      ? calculateBMI(stats.current, settings.height)
      : null
  const bmiCat = bmi ? getBMICategory(bmi) : null
  const goalDiff =
    stats.current && settings.goalWeight
      ? Math.round((stats.current - settings.goalWeight) * 10) / 10
      : null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Current Weight */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-medium">当前体重</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {stats.current !== null ? `${stats.current}` : '--'}
          <span className="text-sm font-normal text-gray-400 ml-1">kg</span>
        </div>
        <div className="mt-1">
          <ChangeIndicator value={stats.change7d} />
        </div>
      </div>

      {/* BMI */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-medium">BMI</span>
        </div>
        {bmi && bmiCat ? (
          <>
            <div className="text-2xl font-bold tracking-tight">
              {bmi.toFixed(1)}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (bmi / 40) * 100)}%`,
                    backgroundColor: BMI_COLORS[bmiCat],
                  }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: BMI_COLORS[bmiCat] }}
              >
                {BMI_LABELS[bmiCat]}
              </span>
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">
            --
          </div>
        )}
      </div>

      {/* Goal */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
          <Target className="w-4 h-4" />
          <span className="text-xs font-medium">距目标</span>
        </div>
        {goalDiff !== null ? (
          <>
            <div className="text-2xl font-bold tracking-tight">
              {goalDiff > 0 ? '+' : ''}
              {goalDiff}
              <span className="text-sm font-normal text-gray-400 ml-1">
                kg
              </span>
            </div>
            {stats.current && settings.goalWeight > 0 && (
              <div className="mt-1.5 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{
                    width: `${Math.max(5, Math.min(100, goalDiff <= 0 ? 100 : Math.max(0, (1 - goalDiff / stats.current) * 100)))}%`,
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">
            --
          </div>
        )}
      </div>

      {/* Streak */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-xs font-medium">连续记录</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {stats.streak}
          <span className="text-sm font-normal text-gray-400 ml-1">天</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          共 {stats.totalDays} 条记录
        </div>
      </div>
    </div>
  )
}
