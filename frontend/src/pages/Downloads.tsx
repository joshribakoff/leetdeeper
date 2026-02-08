import { useMemo, useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import { useMutationAction } from '../hooks/useMutationAction'
import { Loading, ErrorMsg } from '../components/Status'
import ProgressBar from '../components/ProgressBar'
import SortableTable from '../components/SortableTable'
import CreatorBadge from '../components/CreatorBadge'
import CreatorFilter from '../components/CreatorFilter'
import { getCreatorKey } from '../lib/creators'
import type { DownloadsData, DownloadPlaylist, LiveStatus } from '../types'
import type { ColumnDef } from '@tanstack/react-table'

function formatEta(seconds: number) {
  if (!seconds || seconds <= 0) return '0:00'
  const s = Math.floor(seconds)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (d > 0) return `${d}d ${h}h ${m}m ${String(sec).padStart(2, '0')}s`
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

function formatCountdown(seconds: number) {
  if (!seconds || seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(seconds: number) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function timeAgo(timestamp: string) {
  if (!timestamp) return ''
  const diff = (Date.now() - new Date(timestamp).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function LiveDot({ running }: { running: boolean }) {
  if (!running) return null
  return <span className="live-dot" />
}

function EtaCountdown({ eta, running }: { eta?: number; running: boolean }) {
  const [remaining, setRemaining] = useState(eta)
  useEffect(() => { setRemaining(eta) }, [eta])
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setRemaining(r => Math.max(0, (r || 0) - 1)), 1000)
    return () => clearInterval(id)
  }, [running])
  if (!remaining || remaining <= 0) return null
  return <span className="eta-badge">total ETA {formatEta(remaining)}</span>
}

function NextDownloadCountdown({ nextAt, live }: { nextAt?: number; live: LiveStatus | null }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const target = (live?.state === 'waiting' && live.resume_at) ? live.resume_at : nextAt
    if (!target) { setRemaining(null); return }

    const tick = () => {
      const r = target - Date.now() / 1000
      setRemaining(r > 0 ? r : 0)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextAt, live?.resume_at, live?.state])

  if (remaining === null) return null
  if (remaining <= 0) return <span className="eta-badge eta-badge--accent">downloading now...</span>
  return <span className="eta-badge eta-badge--accent">next in {formatCountdown(remaining)}</span>
}

function DownloadDuration({ avgSec, live }: { avgSec?: number; live: LiveStatus | null }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (live?.state !== 'downloading') { setElapsed(0); return }
    const start = new Date(live.timestamp!).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [live?.state, live?.timestamp])

  if (live?.state !== 'downloading') return null
  const etaPart = avgSec ? ` / ~${formatCountdown(avgSec)}` : ''
  return <span className="eta-badge">{formatCountdown(elapsed)}{etaPart}</span>
}

function LiveStatusBanner({ live }: { live: LiveStatus | null }) {
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (!live || live.state !== 'waiting' || !live.resume_at) {
      setCountdown(null)
      return
    }
    const tick = () => {
      const remaining = live.resume_at! - Date.now() / 1000
      setCountdown(remaining > 0 ? remaining : 0)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [live?.resume_at, live?.state])

  if (!live) return null

  if (live.state === 'downloading') {
    const hasProgress = live.percent != null
    return (
      <div className="live-banner live-banner--active">
        <span className="live-dot" />
        <span className="live-banner-text">
          Downloading <strong>{live.playlist}</strong> #{live.index}/{live.total}
        </span>
        {hasProgress && (
          <div className="dl-progress-row">
            <div className="dl-progress-bar">
              <div className="dl-progress-fill" style={{ width: `${live.percent}%` }} />
            </div>
            <span className="dl-progress-pct">{live.percent!.toFixed(1)}%</span>
            {live.speed && <span className="dl-progress-stat">{live.speed}</span>}
            {live.dl_eta && live.dl_eta !== '0:00' && <span className="dl-progress-stat">ETA {live.dl_eta}</span>}
            {live.size && <span className="dl-progress-stat">{live.size}</span>}
          </div>
        )}
        <span className="live-banner-detail">{live.title}</span>
      </div>
    )
  }

  if (live.state === 'waiting' && countdown !== null) {
    const pct = live.delay_sec ? Math.max(0, 100 - (countdown / live.delay_sec) * 100) : 0
    return (
      <div className="live-banner live-banner--waiting">
        <span className="live-banner-text">
          Next download in <strong className="countdown">{formatCountdown(countdown)}</strong>
        </span>
        <div className="countdown-bar">
          <div className="countdown-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    )
  }

  if (live.state === 'rate_limited') {
    return (
      <div className="live-banner live-banner--error">
        Rate limited on {live.playlist} — retry later
      </div>
    )
  }

  if (live.state === 'stopped') {
    return (
      <div className="live-banner live-banner--error">
        <strong>{live.playlist}</strong>: {live.failed_count} video{live.failed_count !== 1 ? 's' : ''} failed to download
        {live.failed_titles && (
          <ul className="failed-list">
            {live.failed_titles.map((title: string, i: number) => (
              <li key={i}>{title}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return null
}

export default function Downloads() {
  const queryClient = useQueryClient()
  const { data: initialData, isLoading, error } = useApi<DownloadsData>('downloads', '/api/downloads')
  const [liveData, setLiveData] = useState<DownloadsData | null>(null)
  const [flash, setFlash] = useState(false)
  const [creatorFilter, setCreatorFilter] = useState<string | null>(null)
  const prevCountRef = useRef<number | null>(null)

  useEffect(() => {
    const evtSource = new EventSource('/api/downloads/stream')
    evtSource.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data)
        setLiveData(d)
        queryClient.setQueryData(['downloads'], d)
      } catch {}
    }
    return () => evtSource.close()
  }, [queryClient])

  const data = liveData || initialData

  useEffect(() => {
    if (!data) return
    const total = data.playlists.reduce((s, p) => s + p.downloaded, 0)
    if (prevCountRef.current !== null && total > prevCountRef.current) {
      setFlash(true)
      setTimeout(() => setFlash(false), 1500)
    }
    prevCountRef.current = total
  }, [data])

  const columns = useMemo<ColumnDef<DownloadPlaylist, any>[]>(() => [
    {
      accessorKey: 'label',
      header: 'Playlist',
    },
    {
      id: 'creator',
      header: 'Creator',
      accessorFn: row => getCreatorKey(row.name),
      cell: ({ row }) => <CreatorBadge name={row.original.name} />,
    },
    {
      accessorKey: 'priority',
      header: 'Pri',
      meta: { className: 'num', cellClassName: 'num' },
    },
    {
      id: 'progress',
      header: 'Progress',
      accessorFn: row => row.total ? row.downloaded / row.total : 0,
      meta: { className: 'bar-cell', cellClassName: 'bar-cell' },
      cell: ({ row }) => <ProgressBar value={row.original.downloaded} max={row.original.total} />,
    },
    {
      id: 'count',
      header: '',
      accessorFn: row => row.downloaded,
      meta: { cellClassName: 'num' },
      cell: ({ row }) => {
        const p = row.original
        return <span className={p.downloaded === p.total && p.total > 0 ? 'num--done' : ''}>{p.downloaded}/{p.total}</span>
      },
      enableSorting: false,
    },
  ], [])

  const configMutation = useMutationAction<{ mode: string }>(
    (body) => fetch('/api/downloads/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    { invalidate: ['downloads'] },
  )

  if (isLoading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  const filtered = creatorFilter
    ? data!.playlists.filter(p => getCreatorKey(p.name) === creatorFilter)
    : data!.playlists

  const totalVids = data!.playlists.reduce((s, p) => s + p.total, 0)
  const totalDl = data!.playlists.reduce((s, p) => s + p.downloaded, 0)
  const activity = data!.activity || {}

  const toggleMode = () => {
    const next = data!.config.mode === 'priority' ? 'round-robin' : 'priority'
    configMutation.mutate({ mode: next })
  }

  return (
    <>
      <header>
        <h1>
          Downloads
          {data!.live?.state === 'downloading' && <><LiveDot running /><span className="status-running">downloading</span></>}
          {data!.live?.state === 'waiting' && <><LiveDot running /><span className="status-running">waiting</span></>}
          {data!.live?.state === 'rate_limited' && <span className="status-error">rate limited</span>}
          {data!.live?.state === 'stopped' && <span className="status-error">stopped — {data!.live.failed_count} failed</span>}
          {!data!.live && activity.running && <><LiveDot running /><span className="status-running">running</span></>}
          {!data!.live && !activity.running && <span className="status-idle">idle</span>}
        </h1>
        <div className="meta">
          <span className={flash ? 'dl-flash' : ''}>{totalDl}/{totalVids} downloaded</span>
          {activity.remaining > 0 && <span>{activity.remaining} remaining</span>}
          {activity.pace && <span>~{formatPace(activity.pace)}/video</span>}
          <DownloadDuration avgSec={activity.avg_download_sec} live={data!.live} />
          <EtaCountdown eta={activity.eta} running={activity.running} />
          <span>mode: {data!.config.mode}</span>
          <button className="btn-play" onClick={toggleMode}>
            switch to {data!.config.mode === 'priority' ? 'round-robin' : 'priority'}
          </button>
        </div>
        <ProgressBar value={totalDl} max={totalVids} />
      </header>

      <div className="dl-columns">
        <section className="dl-col-main">
          <h2>By Playlist</h2>
          <CreatorFilter active={creatorFilter} onChange={setCreatorFilter} />
          <SortableTable
            data={filtered}
            columns={columns}
            initialSort={[{ id: 'creator', desc: false }, { id: 'label', desc: false }]}
          />
        </section>

        <aside className="dl-col-side">
          <LiveStatusBanner live={data!.live} />

          {activity.recent?.length > 0 && (
            <div className="dl-sidebar-section">
              <h2>Recent Activity</h2>
              <ul className="activity-feed">
                {[...activity.recent].reverse().map((e, i) => (
                  <li key={i} className={`activity-item${i === 0 ? ' activity-item--latest' : ''}`}>
                    <span className="activity-icon">▶</span>
                    <span className="activity-text" title={e.title || ''}>
                      {e.playlist}{e.index != null ? ` #${e.index}` : ''}
                    </span>
                    <span className="activity-time">{timeAgo(e.timestamp)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
