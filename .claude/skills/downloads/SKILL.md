# Video Downloads Skill

Manage offline video library with rate-limited YouTube downloads.

## Download Script

```bash
python scripts/download_playlists.py                    # All playlists (prioritized)
python scripts/download_playlists.py --playlist neetcode-blind75  # Single playlist
python scripts/download_playlists.py --info-only         # Fetch metadata only
```

## Rate Limiting

**DO NOT hammer YouTube with sequential requests.** YouTube will rate limit and block (403).

The script handles this automatically:
- 5-10 min delay between videos
- 10-20 min delay between playlists
- Fail-fast on 403 (rate limit detected)

For manual/interactive use: one request at a time is fine. Multiple playlists = use the script.

## Playlist Priorities

Playlists download in priority order (lower = first):
1. NeetCode Blind 75 (priority 1)
2. Kevin Naughton (priority 2)
3. Abdul Bari (priority 3)
4. mycodeschool Data Structures (priority 2)
5. MIT 6.006 (priority 15, deprioritized)

Edit priorities in `scripts/download_playlists.py` PLAYLISTS dict.

## Storage

- Videos stored in `videos/by-id/<youtube_id>.mp4`
- Symlinks in `videos/<playlist-name>/` for human-readable browsing
- Deduplication by YouTube ID (same video in multiple playlists = one download)
- Playlist metadata cached in `playlists/*.jsonl`

## Checking Progress

```bash
ls videos/by-id/*.mp4 | wc -l          # Total downloaded
ps aux | grep download_playlists        # Check if running
tail -5 download_log.jsonl              # Recent activity
```

## Regenerating Playlists

```bash
./scripts/generate_kevin_playlist.sh    # Kevin Naughton (filtered to LeetCode only)
```
