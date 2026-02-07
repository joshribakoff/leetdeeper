const CREATORS = {
  neetcode:    { label: 'NeetCode',    color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  kevin:       { label: 'Kevin N.',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  mycodeschool:{ label: 'mycodeschool',color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  mit:         { label: 'MIT',         color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  abdul:       { label: 'Abdul Bari',  color: '#fb7185', bg: 'rgba(251,113,133,0.12)' },
}

export function getCreator(playlistName) {
  const n = playlistName.toLowerCase()
  if (n.startsWith('neetcode')) return CREATORS.neetcode
  if (n.includes('kevin')) return CREATORS.kevin
  if (n.startsWith('mycodeschool')) return CREATORS.mycodeschool
  if (n.startsWith('mit')) return CREATORS.mit
  if (n.includes('abdul')) return CREATORS.abdul
  return { label: 'Other', color: '#71717a', bg: 'rgba(113,113,122,0.12)' }
}

export function getCreatorKey(playlistName) {
  const n = playlistName.toLowerCase()
  if (n.startsWith('neetcode')) return 'neetcode'
  if (n.includes('kevin')) return 'kevin'
  if (n.startsWith('mycodeschool')) return 'mycodeschool'
  if (n.startsWith('mit')) return 'mit'
  if (n.includes('abdul')) return 'abdul'
  return 'other'
}

export function allCreators() {
  return Object.entries(CREATORS).map(([key, val]) => ({ key, ...val }))
}
