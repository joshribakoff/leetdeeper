import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Options {
  invalidate?: string[]
}

export function useMutationAction<T = void>(
  mutationFn: (args: T) => Promise<Response>,
  opts: Options = {},
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: T) => {
      const res = await mutationFn(args)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      return res.json()
    },
    onSuccess: () => {
      opts.invalidate?.forEach(key => qc.invalidateQueries({ queryKey: [key] }))
    },
  })
}
