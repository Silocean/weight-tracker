import { useState } from 'react'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'

interface WeightInputProps {
  onAdd: (date: string, weight: number, note?: string) => void
}

export default function WeightInput({ onAdd }: WeightInputProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [weight, setWeight] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!w || w < 20 || w > 300) return
    onAdd(date, Math.round(w * 10) / 10, note.trim() || undefined)
    setWeight('')
    setNote('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      {/* Desktop: single row */}
      <div className="hidden sm:flex gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
        />
        <div className="relative flex-1">
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="输入体重"
            className="w-full h-11 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="备注（可选）"
          className="h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 flex-1 transition-shadow"
        />
        <button
          type="submit"
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium text-sm flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.97] transition-all"
        >
          <Plus className="w-4 h-4" />
          记录
        </button>
      </div>

      {/* Mobile: two-row stacked layout */}
      <div className="flex sm:hidden flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 h-12 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
          />
          <div className="relative flex-1">
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="输入体重"
              className="w-full h-12 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="备注（可选）"
            className="flex-1 h-12 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium text-sm flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.97] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            记录
          </button>
        </div>
      </div>
    </form>
  )
}
