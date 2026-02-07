import { useMemo, useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import { Loading, ErrorMsg } from '../components/Status'
import ProgressBar from '../components/ProgressBar'
import SortableTable from '../components/SortableTable'
import CreatorBadge from '../components/CreatorBadge'
import CreatorFilter from '../components/CreatorFilter'
import { getCreatorKey } from '../lib/creators'

function formatEta(seconds) {
  if (!seconds || seconds <= 0) return null
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatCountdown(seconds) {
  if (!seconds || seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function timeAgo(timestamp) {
  if (!timestamp) return ''
  const diff = (Date.now() - new Date(timestamp).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function LiveDot({ running }) {
  if (!running) return null
  return <span className="live-dot" />
}

function EtaCountdown({ eta, running }) {
  const [remaining, setRemaining] = useState(eta)
  useEffect(() => { setRemaining(eta) }, [eta])
  useEffect(() => {
    if (!remaining || !running) return
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [running, remaining > 0])
  if (!remaining || !running) return null
  return <span className="eta-badge">ETA {formatEta(remaining)}</span>
}

function LiveStatus({ live }) {
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    if (!live || live.state !== 'waiting' || !live.resume_at) {
      setCountdown(null)
      return
    }
    const tick = () => {
      const remaining = live.resume_at - Date.now() / 1000
      setCountdown(remaining > 0 ? remaining : 0)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [live?.resume_at, live?.state])

  if (!live) return null

  if (live.state === 'downloading') {
    return (
      <div className="live-banner live-banner--active">
        <span className="live-dot" />
        <span className="live-banner-text">
          Downloading <strong>{live.playlist}</strong> #{live.index}/{live.total}
        </span>
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

  return null
}

export default function Downloads() {
  const queryClient = useQueryClient()
  const { data: initialData, isLoading, error } = useApi('downloads', '/api/downloads')
  const [liveData, setLiveData] = useState(null)
  const [flash, setFlash] = useState(false)
  const [creatorFilter, setCreatorFilter] = useState(null)
  const prevCountRef = useRef(null)

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

  const columns = useMemo(() => [
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

  if (isLoading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  const filtered = creatorFilter
    ? data.playlists.filter(p => getCreatorKey(p.name) === creatorFilter)
    : data.playlists

  const totalVids = data.playlists.reduce((s, p) => s + p.total, 0)
  const totalDl = data.playlists.reduce((s, p) => s + p.downloaded, 0)
  const activity = data.activity || {}

  const toggleMode = () => {
    const next = data.config.mode === 'priority' ? 'round-robin' : 'priority'
    fetch('/api/downloads/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: next }),
    }).then(() => queryClient.invalidateQueries({ queryKey: ['downloads'] }))
  }

  return (
    <>
      <header>
        <h1>
          Downloads
          <LiveDot running={activity.running} />
          {activity.running && <span className="status-running">running</span>}
          {!activity.running && <span className="status-idle">idle</span>}
        </h1>
        <div className="meta">
          <span className={flash ? 'dl-flash' : ''}>{totalDl}/{totalVids} downloaded</span>
          {activity.pace && <span>pace: ~{formatPace(activity.pace)}/video</span>}
          <EtaCountdown eta={activity.eta} running={activity.running} />
          <span>mode: {data.config.mode}</span>
          <button className="btn-play" onClick={toggleMode}>
            switch to {data.config.mode === 'priority' ? 'round-robin' : 'priority'}
          </button>
        </div>
        <ProgressBar value={totalDl} max={totalVids} />
      </header>

      <LiveStatus live={data.live} />

      {activity.recent?.length > 0 && (
        <section>
          <h2>Recent Activity</h2>
          <ul className="activity-feed">
            {[...activity.recent].reverse().map((e, i) => (
              <li key={i} className={`activity-item${i === 0 ? ' activity-item--latest' : ''}`}>
                <span className="activity-icon">▶</span>
                <span className="activity-text">
                  {e.playlist} #{e.index}
                </span>
                <span className="activity-time">{timeAgo(e.timestamp)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>By Playlist</h2>
        <CreatorFilter active={creatorFilter} onChange={setCreatorFilter} />
        <SortableTable
          data={filtered}
          columns={columns}
          initialSort={[{ id: 'creator', desc: false }, { id: 'label', desc: false }]}
        />
      </section>
    </>
  )
}
