import { allCreators } from '../lib/creators'

interface Props {
  active: string | null
  onChange: (key: string | null) => void
}

export default function CreatorFilter({ active, onChange }: Props) {
  const creators = allCreators()

  const toggle = (key: string) => {
    if (active === key) onChange(null)
    else onChange(key)
  }

  return (
    <div className="filter-bar">
      {creators.map(c => (
        <button
          key={c.key}
          className={`filter-chip${active === c.key ? ' filter-chip--active' : ''}`}
          style={active === c.key ? { borderColor: c.color, color: c.color } : undefined}
          onClick={() => toggle(c.key)}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
