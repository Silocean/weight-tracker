import { ClipboardPen, TrendingUp, Settings } from 'lucide-react'

export type TabKey = 'record' | 'trend' | 'settings'

interface BottomTabsProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

const TABS: { key: TabKey; label: string; icon: typeof ClipboardPen }[] = [
  { key: 'record', label: '记录', icon: ClipboardPen },
  { key: 'trend', label: '趋势', icon: TrendingUp },
  { key: 'settings', label: '设置', icon: Settings },
]

export default function BottomTabs({ active, onChange }: BottomTabsProps) {
  return (
    <nav className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)*-1)] z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 sm:hidden">
      <div className="flex items-stretch h-[calc(56px+env(safe-area-inset-bottom))] max-w-lg mx-auto">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex-1 flex flex-col items-center justify-end pb-2 gap-0.5 transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
