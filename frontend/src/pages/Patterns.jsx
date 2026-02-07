import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

export default function Patterns() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/patterns').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <p className="loading">Loading...</p>

  return (
    <>
      <Link to="/" className="back">Back</Link>
      <header>
        <h1>Blind 75 by Pattern</h1>
        <div className="meta">
          <span>Videos: {data.totals.videos_watched}/{data.totals.videos_total}</span>
          <span>Problems: {data.totals.problems_completed}/{data.totals.problems_total}</span>
        </div>
        <ProgressBar value={data.totals.videos_watched} max={data.totals.videos_total} />
      </header>

      <section>
        <table className="pattern-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Videos</th>
              <th></th>
              <th>Problems</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.patterns.map(p => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td className="bar-cell"><ProgressBar value={p.videos_watched} max={p.videos_total} small /></td>
                <td className="num">{p.videos_watched}/{p.videos_total}</td>
                <td className="bar-cell"><ProgressBar value={p.problems_completed} max={p.problems_total} small /></td>
                <td className={`num${p.problems_completed > 0 ? ' num--done' : ''}`}>
                  {p.problems_completed}/{p.problems_total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
