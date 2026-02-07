import { useQuery, UseQueryOptions } from '@tanstack/react-query'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export function useApi<T>(key: string, url: string, opts: Partial<UseQueryOptions<T>> = {}) {
  return useQuery<T>({ queryKey: [key], queryFn: () => fetchJson<T>(url), ...opts })
}
