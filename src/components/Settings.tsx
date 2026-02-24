import { useState, useRef } from 'react'
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  CloudUpload,
  CloudDownload,
  ChevronDown,
  ChevronUp,
  Ruler,
  Cloud,
  HardDrive,
  Check,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { UserSettings } from '../types'
import type { SyncStatus } from '../hooks/useWeightData'

interface SettingsProps {
  settings: UserSettings
  onUpdate: (patch: Partial<UserSettings>) => void
  onExport: () => void
  onImport: (file: File) => void
  onSyncUp: () => void
  onSyncDown: () => void
  syncStatus: SyncStatus
  syncError: string
  alwaysOpen?: boolean
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Ruler
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function SyncButton({
  onClick,
  disabled,
  icon: Icon,
  label,
  loading,
}: {
  onClick: () => void
  disabled: boolean
  icon: typeof CloudUpload
  label: string
  loading: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      {label}
    </button>
  )
}

export default function Settings({
  settings,
  onUpdate,
  onExport,
  onImport,
  onSyncUp,
  onSyncDown,
  syncStatus,
  syncError,
  alwaysOpen = false,
}: SettingsProps) {
  const [open, setOpen] = useState(alwaysOpen)
  const [showToken, setShowToken] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const isOpen = alwaysOpen || open

  const lastSync = settings.lastSyncAt
    ? new Date(settings.lastSyncAt).toLocaleString('zh-CN')
    : '从未同步'

  const content = (
    <div className="space-y-4 animate-fade-in">
      {/* Personal Info */}
      <SectionCard icon={Ruler} title="个人信息">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              身高 (cm)
            </label>
            <input
              type="number"
              min="100"
              max="250"
              step="1"
              value={settings.height || ''}
              onChange={(e) =>
                onUpdate({ height: parseFloat(e.target.value) || 0 })
              }
              placeholder="例如 175"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              目标体重 (kg)
            </label>
            <input
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={settings.goalWeight || ''}
              onChange={(e) =>
                onUpdate({ goalWeight: parseFloat(e.target.value) || 0 })
              }
              placeholder="例如 65.0"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
            />
          </div>
        </div>
      </SectionCard>

      {/* Cloud Sync */}
      <SectionCard icon={Cloud} title="云同步">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              GitHub Token
              <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
                (需要 gist 权限)
              </span>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={settings.gistToken}
                onChange={(e) => onUpdate({ gistToken: e.target.value.trim() })}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full h-11 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showToken ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {settings.gistId && (
            <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <span>Gist ID: {settings.gistId.slice(0, 8)}...</span>
              <span className="mx-1">·</span>
              <span>上次同步: {lastSync}</span>
            </div>
          )}

          {syncStatus === 'success' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <Check className="w-3.5 h-3.5" />
              同步成功
            </div>
          )}
          {syncStatus === 'error' && syncError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {syncError}
            </div>
          )}

          <div className="flex gap-3">
            <SyncButton
              onClick={onSyncUp}
              disabled={syncStatus === 'uploading' || syncStatus === 'downloading'}
              icon={CloudUpload}
              label="上传到云端"
              loading={syncStatus === 'uploading'}
            />
            <SyncButton
              onClick={onSyncDown}
              disabled={syncStatus === 'uploading' || syncStatus === 'downloading' || !settings.gistId}
              icon={CloudDownload}
              label="从云端下载"
              loading={syncStatus === 'downloading'}
            />
          </div>
        </div>
      </SectionCard>

      {/* Data Management */}
      <SectionCard icon={HardDrive} title="数据管理">
        <div className="flex gap-3">
          <button
            onClick={onExport}
            className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出数据
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4" />
            导入数据
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImport(file)
              e.target.value = ''
            }}
          />
        </div>
      </SectionCard>
    </div>
  )

  if (alwaysOpen) return content

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <SettingsIcon className="w-4 h-4" />
          设置
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="p-4 border-t border-gray-100 dark:border-gray-800">{content}</div>}
    </div>
  )
}
