# Blind 75 Study Skill

Interactive workflow for studying Blind 75 videos with articles.

## Video Sources

1. **NeetCode** - Primary source, Blind 75 playlist order
2. **Kevin Naughton Jr.** - Supplementary explanations, different teaching style

## Commands

Show video info (pattern, difficulty, paths):
```bash
python scripts/study.py show <n>
```

Show next unwatched video:
```bash
python scripts/study.py next
```

Mark video as watched:
```bash
python scripts/study.py mark <n>
```

Open video in VLC:
```bash
open -a VLC "<video_path>"
```

Open article in kitty with glow:
```bash
/Applications/kitty.app/Contents/MacOS/kitty --single-instance ~/go/bin/glow -p "<article_path>" &
```

Preview article headers:
```bash
grep "^#" "<article_path>"
```

Search for Kevin Naughton video on a topic:
```bash
grep -i "<keyword>" playlists/youtube_kevin_naughton_leetcode.jsonl
```

## Workflow

When user says "study", "next video", or uses `/study`:

1. Run `python scripts/study.py next` to show next unwatched (NeetCode)
2. If article shows "Not found", search manually:
   ```bash
   ls neetcode/articles/ | grep -i "<keyword>"
   ```
   Article names vary (e.g., "combination-sum" vs "combination-target-sum").
3. Search for Kevin Naughton video on same topic:
   ```bash
   grep -i "<problem-name>" playlists/youtube_kevin_naughton_leetcode.jsonl
   ```
4. Preview article headers with `grep "^#" <article_path>`
5. Open the article in kitty with glow (first, so it's behind)
6. Open NeetCode video in VLC
7. After NeetCode video, open Kevin Naughton video if available
8. When user confirms they're done, run `python scripts/study.py mark <n>`
9. Run `python scripts/progress_report.py` to show updated progress

## Video Paths

- NeetCode: `videos/neetcode-blind75/`
- Kevin Naughton: `videos/kevin-naughton/`

## Example Session

User: "next video" / "study"
-> Show video info
-> Search for Kevin Naughton version
-> Open article in kitty with glow (behind)
-> Open NeetCode video in VLC
-> After watching, open Kevin's video for different perspective

User: "done" / "mark watched"
-> Mark video as watched
-> Show progress report
