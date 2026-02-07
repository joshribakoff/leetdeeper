import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import { useMutationAction } from '../hooks/useMutationAction'
import { Loading, ErrorMsg } from '../components/Status'
import ProgressBar from '../components/ProgressBar'
import type { PlaylistData, Video } from '../types'

function formatLabel(name: string) {
  return name.replace('youtube_', '').replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatTotalDuration(videos: Video[]) {
  const totalSec = videos.reduce((sum, v) => sum + (v.duration || 0), 0)
  if (!totalSec) return null
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function Playlist() {
  const { name } = useParams<{ name: string }>()
  const qc = useQueryClient()
  const { data, isLoading, error } = useApi<PlaylistData>(`playlist-${name}`, `/api/playlists/${name}`)

  const [activeId, setActiveId] = useState<string | null>(null)

  const watchMutation = useMutationAction<Video>(
    (v) => fetch(`/api/watch/${v.youtube_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlist: name, index: v.index, title: v.title }),
    }),
    { invalidate: [`playlist-${name}`] },
  )

  const playMutation = useMutationAction<string>(
    (id) => fetch(`/api/play/${id}`, { method: 'POST' }),
  )

  const articleMutation = useMutationAction<string>(
    (slug) => fetch(`/api/articles/${slug}`, { method: 'POST' }),
  )

  useEffect(() => {
    const es = new EventSource('/api/progress/stream')
    es.onmessage = () => qc.invalidateQueries({ queryKey: [`playlist-${name}`] })
    return () => es.close()
  }, [name, qc])

  if (isLoading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  const downloaded = data!.videos.filter(v => v.has_video).length
  const totalDuration = formatTotalDuration(data!.videos)

  return (
    <>
      <header>
        <h1>{formatLabel(name!)}</h1>
        <div className="meta">
          <span>{data!.total} videos</span>
          <span>{data!.watched} watched ({data!.pct}%)</span>
          <span className="meta-download">{downloaded} downloaded</span>
          {totalDuration && <span>{totalDuration} total</span>}
        </div>
        <ProgressBar value={data!.watched} max={data!.total} />
        <ProgressBar value={downloaded} max={data!.total} variant="download" />
      </header>

      <section>
        <ol className="video-list">
          {data!.videos.map(v => (
            <li key={v.index} className={`video-item${v.youtube_id === activeId ? ' video-item--active' : ''}`}>
              <span className="video-idx">{v.index}</span>
              <button
                className={`video-check ${v.watched ? 'video-check--yes' : 'video-check--no'}`}
                onClick={() => watchMutation.mutate(v)}
                title={v.watched ? 'Mark unwatched' : 'Mark watched'}
              >
                {v.watched ? '\u2713' : '\u25CB'}
              </button>
              <img
                className="video-thumb"
                src={`/thumbs/${v.youtube_id}.jpg`}
                alt=""
                loading="lazy"
              />
              <span className="video-title">{v.title}</span>
              {v.duration_fmt && <span className="video-duration">{v.duration_fmt}</span>}
              <span className={`dl-indicator ${v.has_video ? 'dl-indicator--yes' : 'dl-indicator--no'}`}
                title={v.has_video ? 'Downloaded' : 'Not downloaded'}>
                {v.has_video ? '\u25CF' : '\u25CB'}
              </span>
              <button
                className="btn-play"
                disabled={!v.has_video}
                onClick={() => { setActiveId(v.youtube_id); playMutation.mutate(v.youtube_id) }}
              >
                {v.has_video ? '▶ play' : '▶ local'}
              </button>
              {v.article && (
                <button
                  className={`btn-article${articleMutation.isError && articleMutation.variables === v.article ? ' btn-article--error' : ''}`}
                  disabled={articleMutation.isPending && articleMutation.variables === v.article}
                  onClick={() => articleMutation.mutate(v.article!)}
                >
                  {articleMutation.isPending && articleMutation.variables === v.article ? '...' : 'article'}
                </button>
              )}
              <a className="external" href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noreferrer">
                yt
              </a>
            </li>
          ))}
        </ol>
      </section>

    </>
  )
}
