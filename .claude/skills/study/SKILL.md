# Blind 75 Study Skill

Interactive workflow for studying Blind 75 videos with articles.

## Video Sources

1. **NeetCode** - Primary source, Blind 75 playlist order
2. **Kevin Naughton Jr.** - Supplementary explanations, different teaching style

## Commands

### Blind 75 Progress (legacy)
```bash
python scripts/study.py show <n>    # Show video info
python scripts/study.py next        # Next unwatched
python scripts/study.py mark <n>    # Mark watched
```

### Multi-Source Tracking (new)
```bash
python scripts/track.py watch <source> <youtube_id> "<problem>"  # Mark watched
python scripts/track.py status      # Progress by source
python scripts/track.py queue       # View study queue
python scripts/track.py queue add "<problem>" <lc_num> "<reason>"
python scripts/track.py queue done "<problem>"
```

### Open Videos/Articles
```bash
open -a VLC "<video_path>"
/Applications/kitty.app/Contents/MacOS/kitty --single-instance ~/go/bin/glow -p "<article_path>" &
grep "^#" "<article_path>"  # Preview headers
```

### Search Local Playlists
```bash
grep -i "<keyword>" playlists/youtube_kevin_naughton_leetcode.jsonl
grep -i "<keyword>" playlists/youtube_neetcode_blind75.jsonl
grep -iE "<pattern>" playlists/*.jsonl  # Search all
```

## Workflow

When user says "study", "next video", or uses `/study`:

1. Run `python scripts/study.py next` to show next unwatched (NeetCode)
2. If article shows "Not found", search manually:
   ```bash
   ls neetcode/articles/ | grep -i "<keyword>"
   ```
3. Search for Kevin Naughton video on same topic:
   ```bash
   grep -i "<problem-name>" playlists/youtube_kevin_naughton_leetcode.jsonl
   ```
4. Preview article headers with `grep "^#" <article_path>`
5. Open the article in kitty with glow (first, so it's behind)
6. Open NeetCode video in VLC
7. After NeetCode video, open Kevin Naughton video if available
8. When done:
   - Legacy: `python scripts/study.py mark <n>`
   - Multi-source: `python scripts/track.py watch <source> <youtube_id> "<problem>"`
9. Run `python scripts/progress_report.py` for Blind 75 progress

## Video Paths

- NeetCode: `videos/neetcode-blind75/`
- Kevin Naughton: `videos/kevin-naughton/`

## Progress Files

- `progress/watched.jsonl` - Blind 75 tracking (by playlist index)
- `progress/watched_multi.jsonl` - Multi-source tracking (by youtube_id)
- `study_queue.jsonl` - Bookmarked problems to study

## Example Session

```
User: "next video" / "study"
-> Show video info
-> Search for Kevin Naughton version
-> Open article in kitty (behind)
-> Open NeetCode video in VLC
-> After watching, open Kevin's video

User: "done with kevin frog jump"
-> python scripts/track.py watch kevin 4LvYp_d6Ydg "Frog Jump"

User: "done" / "mark watched"
-> Mark video as watched
-> Show progress report

User: "show queue"
-> python scripts/track.py queue
```
