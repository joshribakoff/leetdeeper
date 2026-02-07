import { useQuery } from '@tanstack/react-query'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export function useApi(key, url, opts = {}) {
  return useQuery({ queryKey: [key], queryFn: () => fetchJson(url), ...opts })
}
