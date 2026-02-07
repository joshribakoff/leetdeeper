import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

function formatLabel(name) {
  return name.replace('youtube_', '').replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatTotalDuration(videos) {
  const totalSec = videos.reduce((sum, v) => sum + (v.duration || 0), 0)
  if (!totalSec) return null
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function Playlist() {
  const { name } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`/api/playlists/${name}`).then(r => r.json()).then(setData)
  }, [name])

  if (!data) return <p className="loading">Loading...</p>

  const downloaded = data.videos.filter(v => v.has_video).length
  const totalDuration = formatTotalDuration(data.videos)

  return (
    <>
      <header>
        <h1>{formatLabel(name)}</h1>
        <div className="meta">
          <span>{data.total} videos</span>
          <span>{data.watched} watched ({data.pct}%)</span>
          <span>{downloaded} downloaded</span>
          {totalDuration && <span>{totalDuration} total</span>}
        </div>
        <ProgressBar value={data.watched} max={data.total} />
      </header>

      <section>
        <ol className="video-list">
          {data.videos.map(v => (
            <li key={v.index} className="video-item">
              <span className="video-idx">{v.index}</span>
              <span className={`video-check ${v.watched ? 'video-check--yes' : 'video-check--no'}`}>
                {v.watched ? '\u2713' : '\u25CB'}
              </span>
              <img
                className="video-thumb"
                src={`/thumbs/${v.youtube_id}.jpg`}
                alt=""
                loading="lazy"
              />
              <span className="video-title">{v.title}</span>
              {v.duration_fmt && <span className="video-duration">{v.duration_fmt}</span>}
              {v.has_video ? (
                <button className="btn-play" onClick={() => fetch(`/api/play/${v.youtube_id}`, { method: 'POST' })}>
                  play
                </button>
              ) : (
                <a className="external" href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noreferrer">
                  youtube
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
