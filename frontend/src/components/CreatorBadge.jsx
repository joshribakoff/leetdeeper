import { getCreator } from '../lib/creators'

export default function CreatorBadge({ name }) {
  const c = getCreator(name)
  return (
    <span className="creator-badge" style={{ color: c.color, background: c.bg }}>
      {c.label}
    </span>
  )
}
