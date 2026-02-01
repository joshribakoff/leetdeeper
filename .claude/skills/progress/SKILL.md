# Progress Report Skill

Show Blind 75 study progress with progress bars.

## Trigger Words

- "progress summary" or "show progress table" → Condensed table format
- "full learning path" or "show all videos by pattern" → Full list with individual videos

## Condensed Table Format

Output a markdown table with columns: Pattern | Videos | Problems

Each cell shows: progress bar + percentage + (done/total)

Example:
```
| Pattern | Videos | Problems |
|---------|--------|----------|
| Arrays & Hashing | ███░░░░░░░ 37% (3/8) | █████░░░░░ 50% (4/8) |
```

## Full Learning Path Format

Group by pattern, show progress bars for videos and problems, then list individual videos with checkmarks.

## Commands

```bash
# Run the basic progress report
python scripts/progress_report.py
```

For custom formats, use inline Python to query:
- `playlists/youtube_neetcode_blind75.jsonl` - playlist order
- `progress/watched.jsonl` - videos watched
- `completed.json` - problems completed
- `neetcode/.problemSiteData.json` - pattern mappings
