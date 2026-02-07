# LeetCode Practice

## Context
Deliberate practice with algorithms and data structures. Staying sharp with TypeScript + Python problem-solving.

## Key Rules for Claude
- **DO NOT show solutions** - let the user figure things out
- Help with syntax when asked
- Point out bugs but let user fix them
- Run tests when asked
- Only make edits when explicitly requested
- **Write comparisons with left on the left and right on the right** - write `left < right` not `right > left`
- **Format algorithm explanations in discrete steps:**
  - One thing per step — state OR check OR operation, not mixed
  - One condition per line
  - Visual separators between steps
  - When steps are short, use a grid/table layout (steps as rows, state/check/operation as columns)
  - When steps are long, use vertical layout with separators

## Skills

Detailed workflows live in `.claude/skills/`:
- **study** — Video study workflow (mark watched, open articles in glow, videos in mpv)
- **progress** — Progress report rendering with progress bars by pattern
- **scaffold** — Problem scaffolding (lcpy, TypeScript practice, running tests)
- **downloads** — Video download management (rate limiting, priorities, storage)

## NeetCode Resources
- `neetcode/hints/` - Progressive hints without spoilers
- `neetcode/articles/` - Full explanations with intuition sections

## Local Tools (not in PATH)
- **FFmpeg**: `~/.local/bin/ffmpeg` - video/audio processing
- **Poetry**: `~/.local/bin/poetry` - Python dependency management

## Testing Safety

**NEVER run all test suites at once.** Vitest spawns worker threads per file. 75 files = machine freeze. Always target a single problem: `npx vitest run .` from the problem directory.

## YouTube / yt-dlp Rate Limiting

**DO NOT hammer YouTube with sequential requests.** See `.claude/skills/downloads/SKILL.md` for details.

## Animation Pipeline
The `animations/` directory contains a modular pipeline for generating narrated algorithm visualizations.

```bash
cd animations
python build.py scenes/two_pointers/scene.json -v
```

See `animations/ARCHITECTURE.md` for full documentation.
