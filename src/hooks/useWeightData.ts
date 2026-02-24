import { useState, useCallback, useEffect } from 'react'
import type { WeightRecord, UserSettings } from '../types'
import { uploadToGist, downloadFromGist } from '../utils/gistSync'

const RECORDS_KEY = 'weight-tracker-records'
const SETTINGS_KEY = 'weight-tracker-settings'

const DEFAULT_SETTINGS: UserSettings = {
  height: 0,
  goalWeight: 0,
  darkMode: 'system',
  gistToken: '',
  gistId: '',
  lastSyncAt: '',
}

function loadRecords(): WeightRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecords(records: WeightRecord[]) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: UserSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export type SyncStatus = 'idle' | 'uploading' | 'downloading' | 'success' | 'error'

export function useWeightData() {
  const [records, setRecords] = useState<WeightRecord[]>(loadRecords)
  const [settings, setSettingsState] = useState<UserSettings>(loadSettings)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [syncError, setSyncError] = useState('')

  useEffect(() => {
    saveRecords(records)
  }, [records])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const addRecord = useCallback(
    (date: string, weight: number, note?: string) => {
      setRecords((prev) => {
        const existing = prev.findIndex((r) => r.date === date)
        const record: WeightRecord = {
          id: existing >= 0 ? prev[existing].id : crypto.randomUUID(),
          date,
          weight,
          note,
        }
        if (existing >= 0) {
          const next = [...prev]
          next[existing] = record
          return next
        }
        return [...prev, record]
      })
    },
    [],
  )

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...patch }))
  }, [])

  const sortedRecords = [...records].sort((a, b) =>
    b.date.localeCompare(a.date),
  )

  const exportData = useCallback(() => {
    const data = JSON.stringify({ records, settings }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weight-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [records, settings])

  const importData = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (Array.isArray(data.records)) {
          setRecords(data.records)
        }
        if (data.settings) {
          setSettingsState((prev) => ({ ...prev, ...data.settings }))
        }
      } catch {
        alert('导入失败：文件格式不正确')
      }
    }
    reader.readAsText(file)
  }, [])

  const syncUp = useCallback(async () => {
    if (!settings.gistToken) {
      setSyncError('请先填写 GitHub Token')
      setSyncStatus('error')
      return
    }
    setSyncStatus('uploading')
    setSyncError('')
    try {
      const newGistId = await uploadToGist(
        settings.gistToken,
        settings.gistId,
        records,
        settings,
      )
      const now = new Date().toISOString()
      setSettingsState((prev) => ({
        ...prev,
        gistId: newGistId,
        lastSyncAt: now,
      }))
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : '上传失败')
      setSyncStatus('error')
    }
  }, [settings, records])

  const syncDown = useCallback(async () => {
    if (!settings.gistToken) {
      setSyncError('请先填写 GitHub Token')
      setSyncStatus('error')
      return
    }
    if (!settings.gistId) {
      setSyncError('尚未同步过，请先上传数据')
      setSyncStatus('error')
      return
    }
    setSyncStatus('downloading')
    setSyncError('')
    try {
      const data = await downloadFromGist(settings.gistToken, settings.gistId)
      if (Array.isArray(data.records)) {
        setRecords(data.records)
      }
      if (data.settings) {
        setSettingsState((prev) => ({
          ...prev,
          ...data.settings,
          gistToken: prev.gistToken,
          gistId: prev.gistId,
          lastSyncAt: new Date().toISOString(),
        }))
      }
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : '下载失败')
      setSyncStatus('error')
    }
  }, [settings.gistToken, settings.gistId])

  return {
    records: sortedRecords,
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
  }
}
