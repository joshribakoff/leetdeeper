# Blind 75 Study Skill

Interactive workflow for studying Blind 75 videos with articles.

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

## Workflow

When user says "study", "next video", or uses `/study`:

1. Run `python scripts/study.py next` to show next unwatched
2. If article shows "Not found", search manually:
   ```bash
   ls neetcode/articles/ | grep -i "<keyword>"
   ```
   Article names vary (e.g., "combination-sum" vs "combination-target-sum").
3. Preview article headers with `grep "^#" <article_path>`
4. Open the article in kitty with glow (first, so it's behind)
5. Open the video in VLC (second, so it's on top and auto-plays)
6. When user confirms they're done, run `python scripts/study.py mark <n>`
7. Run `python scripts/progress_report.py` to show updated progress

## Example Session

User: "next video" / "study"
-> Show video info
-> Open article in kitty with glow (behind)
-> Open video in VLC (on top, auto-plays)

User: "done" / "mark watched"
-> Mark video as watched
-> Show progress report
