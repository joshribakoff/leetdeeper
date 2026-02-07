export function Loading() {
  return <p className="loading">Loading...</p>
}

export function ErrorMsg({ error }) {
  return <p className="loading" style={{ color: 'var(--dim)' }}>Error: {error.message}</p>
}
