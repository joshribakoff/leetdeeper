export interface Video {
  index: number
  youtube_id: string
  title: string
  duration?: number
  duration_fmt?: string
  watched: boolean
  has_video: boolean
  article?: string
}

export interface PlaylistData {
  name: string
  videos: Video[]
  total: number
  watched: number
  pct: number
}

export interface PlaylistSummary {
  name: string
  label: string
  total: number
  watched: number
}

export interface Summary {
  total_videos_watched: number
  total_problems_solved: number
  playlists: PlaylistSummary[]
}

export interface PatternRow {
  name: string
  videos_watched: number
  videos_total: number
  problems_completed: number
  problems_total: number
}

export interface PatternsData {
  patterns: PatternRow[]
  totals: {
    videos_watched: number
    videos_total: number
    problems_completed: number
    problems_total: number
  }
}

export interface Creator {
  label: string
  color: string
  bg: string
}

export interface DownloadPlaylist {
  name: string
  label: string
  total: number
  downloaded: number
  priority: number
}

export interface LiveStatus {
  state: 'downloading' | 'waiting' | 'rate_limited' | 'stopped' | 'idle'
  playlist?: string
  index?: number
  total?: number
  title?: string
  percent?: number
  speed?: string
  dl_eta?: string
  size?: string
  timestamp?: string
  resume_at?: number
  delay_sec?: number
  failed_count?: number
  failed_titles?: string[]
}

export interface DownloadActivity {
  running: boolean
  remaining: number
  pace?: number
  avg_download_sec?: number
  eta?: number
  recent?: Array<{
    playlist: string
    index?: number
    title?: string
    timestamp: string
  }>
}

export interface DownloadsData {
  playlists: DownloadPlaylist[]
  config: { mode: string }
  activity: DownloadActivity
  live: LiveStatus | null
}
