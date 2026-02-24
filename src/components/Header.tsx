import { Scale, Moon, Sun, Monitor, Settings } from 'lucide-react'
import type { UserSettings } from '../types'

interface HeaderProps {
  settings: UserSettings
  onToggleDarkMode: () => void
  onOpenSettings?: () => void
  settingsActive?: boolean
}

export default function Header({ settings, onToggleDarkMode, onOpenSettings, settingsActive }: HeaderProps) {
  const icon =
    settings.darkMode === 'dark' ? (
      <Moon className="w-5 h-5" />
    ) : settings.darkMode === 'light' ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Monitor className="w-5 h-5" />
    )

  return (
    <header className="shrink-0 z-30 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 pt-[env(safe-area-inset-top)]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            体重记录
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className={`hidden sm:flex p-2 rounded-lg transition-colors ${
                settingsActive
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              title="设置"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title="切换主题"
          >
            {icon}
          </button>
        </div>
      </div>
    </header>
  )
}
