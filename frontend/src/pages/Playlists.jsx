import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { Loading, ErrorMsg } from '../components/Status'
import ProgressBar from '../components/ProgressBar'
import SortableTable from '../components/SortableTable'
import CreatorBadge from '../components/CreatorBadge'
import CreatorFilter from '../components/CreatorFilter'
import { getCreatorKey } from '../lib/creators'

export default function Playlists() {
  const { data, isLoading, error } = useApi('summary', '/api/summary')
  const [creatorFilter, setCreatorFilter] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'label',
      header: 'Playlist',
      cell: ({ row }) => (
        <Link to={`/playlist/${row.original.name}`} style={{ fontWeight: 500 }}>
          {row.original.label}
        </Link>
      ),
    },
    {
      id: 'creator',
      header: 'Creator',
      accessorFn: row => getCreatorKey(row.name),
      cell: ({ row }) => <CreatorBadge name={row.original.name} />,
    },
    {
      id: 'progress',
      header: 'Watched',
      accessorFn: row => row.total ? row.watched / row.total : 0,
      meta: { className: 'bar-cell', cellClassName: 'bar-cell' },
      cell: ({ row }) => <ProgressBar value={row.original.watched} max={row.original.total} />,
    },
    {
      id: 'count',
      header: '',
      accessorFn: row => row.watched,
      meta: { cellClassName: 'num' },
      cell: ({ row }) => {
        const pl = row.original
        return <span className={pl.watched === pl.total && pl.total > 0 ? 'num--done' : ''}>{pl.watched}/{pl.total}</span>
      },
      enableSorting: false,
    },
  ], [])

  if (isLoading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  const filtered = creatorFilter
    ? data.playlists.filter(p => getCreatorKey(p.name) === creatorFilter)
    : data.playlists

  return (
    <>
      <header>
        <h1>Playlists</h1>
        <p className="subtitle">{data.total_videos_watched} videos watched across {data.playlists.length} playlists</p>
      </header>

      <section>
        <CreatorFilter active={creatorFilter} onChange={setCreatorFilter} />
        <SortableTable
          data={filtered}
          columns={columns}
          initialSort={[{ id: 'creator', desc: false }, { id: 'label', desc: false }]}
        />
      </section>
    </>
  )
}
