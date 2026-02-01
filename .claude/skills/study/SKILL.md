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
2. Preview article headers with `grep "^#" <article_path>`
3. Open the video in VLC
4. Open the article in kitty with glow
5. When user confirms they're done, run `python scripts/study.py mark <n>`
6. Run `python scripts/progress_report.py` to show updated progress

## Example Session

User: "next video" / "study"
-> Show video info
-> Open video in VLC
-> Open article in kitty with glow

User: "done" / "mark watched"
-> Mark video as watched
-> Show progress report
