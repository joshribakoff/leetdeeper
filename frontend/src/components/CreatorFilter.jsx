import { allCreators } from '../lib/creators'

export default function CreatorFilter({ active, onChange }) {
  const creators = allCreators()

  const toggle = (key) => {
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
