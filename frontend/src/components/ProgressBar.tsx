interface Props {
  value: number
  max: number
  small?: boolean
  variant?: string
}

export default function ProgressBar({ value, max, small, variant }: Props) {
  const pct = max ? Math.round(100 * value / max) : 0
  const cls = [
    'progress-fill',
    variant === 'download' ? 'progress-fill--download' : '',
  ].filter(Boolean).join(' ')
  return (
    <div className="progress">
      <div className={`progress-track${small ? ' progress-track--sm' : ''}`}>
        <div className={cls} style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{value}/{max}</span>
    </div>
  )
}
