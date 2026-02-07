import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

const CHECK = '\u2713'
const CIRCLE = '\u25CB'

function DifficultyBadge({ d }) {
  if (!d) return null
  const cls = d === 'Easy' ? 'diff--easy' : d === 'Medium' ? 'diff--med' : 'diff--hard'
  return <span className={`diff ${cls}`}>{d}</span>
}

export default function Patterns() {
  const [data, setData] = useState(null)
  const [expanded, setExpanded] = useState(new Set())

  useEffect(() => {
    fetch('/api/patterns').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <p className="loading">Loading...</p>

  const toggle = (name) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    <>
      <header>
        <h1>Blind 75 by Pattern</h1>
        <div className="meta">
          <span>Videos: {data.totals.videos_watched}/{data.totals.videos_total}</span>
          <span>Problems: {data.totals.problems_completed}/{data.totals.problems_total}</span>
        </div>
        <ProgressBar value={data.totals.videos_watched} max={data.totals.videos_total} />
      </header>

      <section className="pattern-groups">
        {data.patterns.map(p => {
          const open = expanded.has(p.name)
          const allWatched = p.videos_watched === p.videos_total
          const allDone = p.problems_completed === p.problems_total

          return (
            <div key={p.name} className={`pg${open ? ' pg--open' : ''}`}>
              <button className="pg-header" onClick={() => toggle(p.name)}>
                <span className="pg-arrow">{open ? '\u25BE' : '\u25B8'}</span>
                <span className="pg-name">{p.name}</span>
                <span className="pg-stats">
                  <span className={`pg-stat${allWatched ? ' pg-stat--done' : ''}`}>
                    {p.videos_watched}/{p.videos_total} watched
                  </span>
                  <span className={`pg-stat${allDone ? ' pg-stat--done' : ''}`}>
                    {p.problems_completed}/{p.problems_total} solved
                  </span>
                </span>
                <span className="pg-bar">
                  <ProgressBar value={p.videos_watched} max={p.videos_total} />
                </span>
              </button>

              {open && (
                <table className="pg-items">
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>Difficulty</th>
                      <th>Video</th>
                      <th>Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.items.map(item => (
                      <tr key={item.youtube_id || item.title}>
                        <td className="pg-title">{item.title}</td>
                        <td><DifficultyBadge d={item.difficulty} /></td>
                        <td className="pg-status">
                          <span className={item.watched ? 'status--yes' : 'status--no'}>
                            {item.watched ? CHECK : CIRCLE}
                          </span>
                        </td>
                        <td className="pg-status">
                          <span className={item.completed ? 'status--yes' : 'status--no'}>
                            {item.completed ? CHECK : CIRCLE}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )
        })}
      </section>
    </>
  )
}
