import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { Loading, ErrorMsg } from '../components/Status'
import ProgressBar from '../components/ProgressBar'
import SortableTable from '../components/SortableTable'
import CreatorBadge from '../components/CreatorBadge'
import CreatorFilter from '../components/CreatorFilter'
import { getCreatorKey } from '../lib/creators'
import type { Summary, PlaylistSummary } from '../types'
import type { ColumnDef } from '@tanstack/react-table'

export default function Playlists() {
  const { data, isLoading, error } = useApi<Summary>('summary', '/api/summary')
  const { data: pinned } = useApi<string[]>('pinned', '/api/pinned')
  const [creatorFilter, setCreatorFilter] = useState<string | null>(null)

  const columns = useMemo<ColumnDef<PlaylistSummary, any>[]>(() => [
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

  const pinnedPlaylists = pinned?.length
    ? data!.playlists.filter(p => pinned.includes(p.name))
    : []

  const filtered = creatorFilter
    ? data!.playlists.filter(p => getCreatorKey(p.name) === creatorFilter)
    : data!.playlists

  return (
    <>
      <header>
        <h1>Playlists</h1>
        <p className="subtitle">{data!.total_videos_watched} videos watched across {data!.playlists.length} playlists</p>
      </header>

      {pinnedPlaylists.length > 0 && (
        <section>
          <h2>Featured</h2>
          <nav>
            {pinnedPlaylists.map(pl => (
              <Link to={`/playlist/${pl.name}`} key={pl.name} className="card">
                <div className="card-header">
                  <span className="card-title">{pl.label}</span>
                  <span className="card-stat">{pl.watched}/{pl.total} watched</span>
                </div>
                <ProgressBar value={pl.watched} max={pl.total} />
              </Link>
            ))}
          </nav>
        </section>
      )}

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
