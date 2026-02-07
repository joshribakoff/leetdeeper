import { useMemo } from 'react'
import { useApi } from '../hooks/useApi'
import { Loading, ErrorMsg } from '../components/Status'
import ProgressBar from '../components/ProgressBar'
import SortableTable from '../components/SortableTable'

export default function Patterns() {
  const { data, isLoading, error } = useApi('patterns', '/api/patterns')

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Pattern',
    },
    {
      id: 'watched',
      header: 'Watched',
      accessorFn: row => row.videos_total ? row.videos_watched / row.videos_total : 0,
      meta: { className: 'bar-cell', cellClassName: 'bar-cell' },
      cell: ({ row }) => <ProgressBar value={row.original.videos_watched} max={row.original.videos_total} />,
    },
    {
      id: 'watched_count',
      header: '',
      accessorFn: row => row.videos_watched,
      meta: { cellClassName: 'num' },
      cell: ({ row }) => <>{row.original.videos_watched}/{row.original.videos_total}</>,
      enableSorting: false,
    },
    {
      id: 'solved',
      header: 'Solved',
      accessorFn: row => row.problems_total ? row.problems_completed / row.problems_total : 0,
      meta: { className: 'bar-cell', cellClassName: 'bar-cell' },
      cell: ({ row }) => <ProgressBar value={row.original.problems_completed} max={row.original.problems_total} />,
    },
    {
      id: 'solved_count',
      header: '',
      accessorFn: row => row.problems_completed,
      meta: { cellClassName: 'num' },
      cell: ({ row }) => (
        <span className={row.original.problems_completed > 0 ? 'num--done' : ''}>
          {row.original.problems_completed}/{row.original.problems_total}
        </span>
      ),
      enableSorting: false,
    },
  ], [])

  if (isLoading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  return (
    <>
      <header>
        <h1>Blind 75 by Pattern</h1>
        <div className="meta">
          <span>{data.totals.videos_watched}/{data.totals.videos_total} watched</span>
          <span>{data.totals.problems_completed}/{data.totals.problems_total} solved</span>
        </div>
        <ProgressBar value={data.totals.videos_watched} max={data.totals.videos_total} />
      </header>

      <section>
        <SortableTable
          data={data.patterns}
          columns={columns}
          initialSort={[{ id: 'name', desc: false }]}
        />
      </section>
    </>
  )
}
