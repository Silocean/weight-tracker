import type { WeightRecord, UserSettings } from '../types'

const GIST_FILENAME = 'weight-tracker-data.json'
const API_BASE = 'https://api.github.com/gists'

interface GistData {
  records: WeightRecord[]
  settings: Omit<UserSettings, 'gistToken' | 'gistId' | 'lastSyncAt'>
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
  }
}

function stripSyncFields(settings: UserSettings): GistData['settings'] {
  const { gistToken: _, gistId: __, lastSyncAt: ___, ...rest } = settings
  return rest
}

export async function uploadToGist(
  token: string,
  gistId: string,
  records: WeightRecord[],
  settings: UserSettings,
): Promise<string> {
  const payload: GistData = { records, settings: stripSyncFields(settings) }
  const body = {
    description: '体重记录 - Weight Tracker Data',
    public: false,
    files: {
      [GIST_FILENAME]: { content: JSON.stringify(payload, null, 2) },
    },
  }

  const isUpdate = gistId.length > 0
  const res = await fetch(isUpdate ? `${API_BASE}/${gistId}` : API_BASE, {
    method: isUpdate ? 'PATCH' : 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API 错误 (${res.status})`)
  }

  const gist = await res.json()
  return gist.id as string
}

export async function downloadFromGist(
  token: string,
  gistId: string,
): Promise<GistData> {
  if (!gistId) throw new Error('尚未同步过，请先上传数据')

  const res = await fetch(`${API_BASE}/${gistId}`, {
    headers: headers(token),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API 错误 (${res.status})`)
  }

  const gist = await res.json()
  const file = gist.files?.[GIST_FILENAME]
  if (!file?.content) throw new Error('Gist 中未找到体重数据文件')

  return JSON.parse(file.content) as GistData
}
