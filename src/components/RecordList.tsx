import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { WeightRecord } from '../types'

interface RecordListProps {
  records: WeightRecord[]
  onDelete: (id: string) => void
}

export default function RecordList({ records, onDelete }: RecordListProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? records : records.slice(0, 7)

  if (records.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center text-gray-400 text-sm">
        还没有任何记录，开始记录你的第一笔体重吧
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          历史记录
        </h2>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
        {visible.map((record, idx) => {
          const prev = records[idx + 1]
          const diff = prev
            ? Math.round((record.weight - prev.weight) * 10) / 10
            : null
          return (
            <div
              key={record.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {format(parseISO(record.date), 'M月d日 EEEE', {
                      locale: zhCN,
                    })}
                  </span>
                  {record.note && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
                      <MessageSquare className="w-3 h-3" />
                      {record.note}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {diff !== null && diff !== 0 && (
                  <span
                    className={`text-xs font-medium ${diff < 0 ? 'text-emerald-500' : 'text-rose-500'}`}
                  >
                    {diff > 0 ? '+' : ''}
                    {diff}
                  </span>
                )}
                <span className="text-sm font-bold tabular-nums w-16 text-right">
                  {record.weight} kg
                </span>
                <button
                  onClick={() => onDelete(record.id)}
                  className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-all"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {records.length > 7 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-center gap-1 transition-colors border-t border-gray-100 dark:border-gray-800"
        >
          {expanded ? (
            <>
              收起 <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              查看全部 {records.length} 条记录 <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
