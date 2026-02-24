import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { WeightRecord, TimeRange } from '../types'
import { filterByRange } from '../utils/stats'

interface WeightChartProps {
  records: WeightRecord[]
  goalWeight: number
}

const RANGES: { key: TimeRange; label: string }[] = [
  { key: '7d', label: '7天' },
  { key: '30d', label: '30天' },
  { key: '90d', label: '90天' },
  { key: 'all', label: '全部' },
]

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <div className="text-gray-500 dark:text-gray-400 text-xs">{d.label}</div>
      <div className="font-bold text-base">{d.weight} kg</div>
      {d.note && (
        <div className="text-gray-400 text-xs mt-0.5">{d.note}</div>
      )}
    </div>
  )
}

export default function WeightChart({ records, goalWeight }: WeightChartProps) {
  const [range, setRange] = useState<TimeRange>('30d')
  const filtered = filterByRange(records, range).sort((a, b) =>
    a.date.localeCompare(b.date),
  )

  const data = filtered.map((r) => ({
    ...r,
    label: format(parseISO(r.date), 'M/d', { locale: zhCN }),
  }))

  const weights = data.map((d) => d.weight)
  const min = weights.length ? Math.floor(Math.min(...weights) - 1) : 50
  const max = weights.length ? Math.ceil(Math.max(...weights) + 1) : 80

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          体重趋势
        </h2>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                range === r.key
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          暂无数据，请先记录体重
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              className="text-gray-400"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[min, max]}
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              className="text-gray-400"
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            {goalWeight > 0 && (
              <ReferenceLine
                y={goalWeight}
                stroke="#a78bfa"
                strokeDasharray="6 3"
                label={{
                  value: `目标 ${goalWeight}`,
                  position: 'right',
                  fontSize: 11,
                  fill: '#a78bfa',
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="weight"
              stroke="url(#gradient)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#7566f1', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#7566f1', stroke: '#fff', strokeWidth: 2 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7566f1" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
