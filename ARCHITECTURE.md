# LeetDeeper Architecture

## Overview

LeetDeeper is a study dashboard for LeetCode practice. It tracks video playlists, download progress, and study patterns across multiple creators (NeetCode, Kevin Naughton, MyCodeSchool, Abdul Bari, MIT 6.006).

## Stack

- **Backend**: Flask (Python 3), JSON API on port 5001
- **Frontend**: React 19 + Vite (port 3000, proxied to Flask)
- **Data**: JSONL files for playlists/progress, JSON config for downloads
- **Libraries**: @tanstack/react-query (server state), @tanstack/react-table (sorting), react-router-dom (routing)

## Directory Structure

```
leetdeeper/
├── server.py                  # Flask API server
├── lib/                       # Python backend modules
│   ├── playlists.py           # Playlist JSONL loading
│   ├── progress.py            # Watch tracking (watched.jsonl)
│   ├── media.py               # Video enrichment (thumbnails, duration)
│   ├── patterns.py            # Blind 75 pattern analysis
│   └── downloads.py           # Download progress, activity, live status
├── scripts/
│   └── download_playlists.py  # yt-dlp downloader with rate limiting
├── download_config.json       # Playlist priorities, delays, mode
├── download_log.jsonl         # Download event log
├── download_status.json       # Live downloader state
├── playlists/                 # JSONL playlist manifests
├── videos/by-id/              # Downloaded .mp4 and .jpg thumbnails
├── progress/                  # watched.jsonl, watched_by_id.jsonl
├── practice/                  # 75 Blind 75 TypeScript solutions
└── frontend/
    └── src/
        ├── main.jsx           # Entry, QueryClientProvider
        ├── App.jsx            # React Router, nav
        ├── pages/
        │   ├── Home.jsx       # Dashboard summary
        │   ├── Playlists.jsx  # All playlists table
        │   ├── Playlist.jsx   # Single playlist video list
        │   ├── Patterns.jsx   # Blind 75 by pattern
        │   └── Downloads.jsx  # Live download monitoring
        ├── components/
        │   ├── SortableTable.jsx  # @tanstack/react-table wrapper
        │   ├── ProgressBar.jsx
        │   ├── CreatorBadge.jsx   # Color-coded creator labels
        │   ├── CreatorFilter.jsx  # Filter chips
        │   └── Status.jsx         # Loading, ErrorMsg
        ├── hooks/
        │   └── useApi.js      # react-query fetch wrapper
        ├── lib/
        │   └── creators.js    # Creator detection + color map
        └── styles/            # Modular CSS
            ├── base.css       # Variables, reset, typography
            ├── nav.css        # Navigation
            ├── progress.css   # Progress bars
            ├── table.css      # Sortable tables
            ├── cards.css      # Stat cards
            ├── playlist.css   # Video list, play buttons
            └── downloads.css  # Live status, activity feed, layout
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/summary` | Overall stats (total videos, watched, progress) |
| GET | `/api/playlists` | All playlists with counts |
| GET | `/api/playlists/:name` | Single playlist with enriched video list |
| POST | `/api/play/:youtube_id` | Open video in mpv |
| GET | `/api/patterns` | Blind 75 grouped by pattern |
| GET | `/api/downloads` | Download progress, config, activity, live status |
| GET | `/api/downloads/stream` | SSE stream (pushes on file mtime change) |
| POST | `/api/downloads/config` | Update mode/delays |

## Real-Time Architecture

The Downloads page uses **Server-Sent Events** for live updates:

1. `download_playlists.py` writes to `download_status.json` during downloads (percent, speed, ETA)
2. `download_log.jsonl` records completed downloads with timestamps
3. Flask SSE endpoint polls file mtimes every 2s, pushes full state on change
4. React `EventSource` receives updates, feeds to react-query cache
5. Client-side timers tick ETAs/countdowns between server pushes

## Download System

Config-driven via `download_config.json`:
- **Priority mode**: Downloads highest-priority incomplete playlist first
- **Round-robin mode**: Cycles through playlists taking one video each
- Rate limiting with configurable random delays (min/max per video/playlist)
- Hot-reloadable config (re-read between playlists)
- yt-dlp `--newline` for streaming progress parsing via `subprocess.Popen`

## Data Flow

```
playlists/*.jsonl  →  lib/playlists.py  →  /api/playlists
videos/by-id/      →  lib/media.py      →  enriched in /api/playlists/:name
progress/*.jsonl   →  lib/progress.py   →  /api/summary
neetcode/hints/    →  lib/patterns.py   →  /api/patterns
download_*.json(l) →  lib/downloads.py  →  /api/downloads + SSE
```
