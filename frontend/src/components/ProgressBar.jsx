export default function ProgressBar({ value, max, height = 8 }) {
  const pct = max ? Math.round(100 * value / max) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        flex: 1, height, background: 'var(--bar-bg)',
        borderRadius: height / 2, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'var(--green)', borderRadius: height / 2,
          transition: 'width 0.3s',
        }} />
      </div>
      <span style={{ fontSize: '0.8rem', color: 'var(--dim)', minWidth: 50, textAlign: 'right' }}>
        {value}/{max}
      </span>
    </div>
  )
}
