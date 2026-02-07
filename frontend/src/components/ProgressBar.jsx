export default function ProgressBar({ value, max, small }) {
  const pct = max ? Math.round(100 * value / max) : 0
  return (
    <div className="progress">
      <div className={`progress-track${small ? ' progress-track--sm' : ''}`}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{value}/{max}</span>
    </div>
  )
}
