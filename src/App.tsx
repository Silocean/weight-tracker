import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import WeightInput from './components/WeightInput'
import StatsCards from './components/StatsCards'
import WeightChart from './components/WeightChart'
import RecordList from './components/RecordList'
import Settings from './components/Settings'
import BottomTabs, { type TabKey } from './components/BottomTabs'
import { useWeightData } from './hooks/useWeightData'
import { computeStats } from './utils/stats'

function applyDarkMode(mode: 'system' | 'light' | 'dark') {
  const isDark =
    mode === 'dark' ||
    (mode === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export default function App() {
  const {
    records,
    settings,
    addRecord,
    deleteRecord,
    updateSettings,
    exportData,
    importData,
    syncUp,
    syncDown,
    syncStatus,
    syncError,
  } = useWeightData()

  const stats = computeStats(records)
  const [tab, setTab] = useState<TabKey>('record')
  const [desktopPage, setDesktopPage] = useState<'main' | 'settings'>('main')

  useEffect(() => {
    applyDarkMode(settings.darkMode)
    if (settings.darkMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyDarkMode('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [settings.darkMode])

  const toggleDarkMode = useCallback(() => {
    const order: Array<'system' | 'light' | 'dark'> = [
      'system',
      'light',
      'dark',
    ]
    const idx = order.indexOf(settings.darkMode)
    updateSettings({ darkMode: order[(idx + 1) % order.length] })
  }, [settings.darkMode, updateSettings])

  const settingsProps = {
    settings,
    onUpdate: updateSettings,
    onExport: exportData,
    onImport: importData,
    onSyncUp: syncUp,
    onSyncDown: syncDown,
    syncStatus,
    syncError,
  } as const

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header
        settings={settings}
        onToggleDarkMode={toggleDarkMode}
        onOpenSettings={() => setDesktopPage(desktopPage === 'settings' ? 'main' : 'settings')}
        settingsActive={desktopPage === 'settings'}
      />

      {/* Desktop */}
      <div className="hidden sm:block flex-1 overflow-y-auto">
        {desktopPage === 'main' ? (
          <main className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
            <WeightInput onAdd={addRecord} />
            <StatsCards stats={stats} settings={settings} />
            <WeightChart records={records} goalWeight={settings.goalWeight} />
            <RecordList records={records} onDelete={deleteRecord} />
          </main>
        ) : (
          <main className="max-w-2xl mx-auto px-4 py-4 animate-fade-in">
            <Settings {...settingsProps} alwaysOpen />
          </main>
        )}
      </div>

      {/* Mobile */}
      <div className="sm:hidden flex-1 overflow-y-auto">
        <main className="max-w-lg mx-auto px-4 pt-4 pb-[calc(1rem+56px)] flex flex-col gap-4">
          {tab === 'record' && (
            <>
              <div className="animate-fade-in">
                <WeightInput onAdd={addRecord} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
                <StatsCards stats={stats} settings={settings} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <RecordList records={records} onDelete={deleteRecord} />
              </div>
            </>
          )}
          {tab === 'trend' && (
            <div className="animate-fade-in">
              <WeightChart records={records} goalWeight={settings.goalWeight} />
            </div>
          )}
          {tab === 'settings' && (
            <div className="animate-fade-in">
              <Settings {...settingsProps} alwaysOpen />
            </div>
          )}
        </main>
      </div>

      <BottomTabs active={tab} onChange={setTab} />
    </div>
  )
}
