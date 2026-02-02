# LeetCode Practice

## Context
Deliberate practice with algorithms and data structures. Staying sharp with Python problem-solving.

## Key Rules for Claude
- **DO NOT show solutions** - let the user figure things out
- Help with Python syntax when asked
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

## Tooling

### lcpy - Problem Scaffolding
```bash
# List all available problems
lcpy list

# Filter by tag or difficulty
lcpy list -t blind-75
lcpy list -d Easy

# Generate a problem scaffold
lcpy gen -n 704        # by problem number
lcpy gen -s two_sum    # by slug

# Generate all problems in a list
lcpy gen -t blind-75
```

Generated files per problem:
- `solution.py` - Class with method stubs
- `test_solution.py` - pytest test cases
- `helpers.py` - Test helper functions
- `README.md` - Problem description
- `playground.ipynb` - Jupyter notebook

### Running Tests
```bash
# Run tests for a specific problem
pytest practice/two_sum/test_solution.py -v

# Quick single test
python -c "from solution import Solution; s = Solution(); print(s.two_sum([2,7,11,15], 9))"
```

### Progress Tracking
```bash
# Comprehensive progress report with progress bars (use this)
python scripts/progress_report.py

# Legacy: progress by pattern
python show_progress.py -p

# Legacy: progress by list (Blind 75, etc.)
python show_progress.py
```

Progress is tracked in:
- `completed.json` - problems solved (add entries when done)
- `progress/watched.jsonl` - videos watched

## Workflow
1. Pick a problem: `lcpy list -t blind-75`
2. Generate scaffold: `lcpy gen -n <num>`
3. Work through solution in `practice/<problem>/solution.py`
4. Run tests: `pytest practice/<problem>/test_solution.py -v`
5. Mark complete: add entry to `completed.json`
6. Check progress: `python show_progress.py`

## Problem Lists
- **Blind 75** - Classic interview prep list
- **NeetCode 150** - Extended NeetCode roadmap
- **Grind 75** - Tech interview grind list
- **AlgoMaster 75** - Algorithm mastery list

## NeetCode Resources
- `neetcode/hints/` - Progressive hints without spoilers
- `neetcode/articles/` - Full explanations with intuition sections

## Local Tools (not in PATH)
- **FFmpeg**: `~/.local/bin/ffmpeg` - video/audio processing
- **Poetry**: `~/.local/bin/poetry` - Python dependency management

## Video Playback
When the user asks to open/play a video, always use VLC:
```bash
open -a VLC "/path/to/video.mp4"
```

## YouTube / yt-dlp Rate Limiting

**DO NOT hammer YouTube with sequential requests.** YouTube will rate limit and block.

When fetching playlist info or downloading videos:
1. **Single request**: OK for one-off checks
2. **Multiple playlists**: Write a script with delays (5-20 min between requests), run in background
3. **Batch downloads**: Use the existing `scripts/download_blind75.py` pattern with random delays

Example for checking multiple playlists:
```bash
# Don't do this interactively - write a script and run in background
python scripts/fetch_playlist_info.py --playlists playlists.txt --delay 300
```

If you need playlist info, ask the user to provide it or run a background script.

## Animation Pipeline
The `animations/` directory contains a modular pipeline for generating narrated algorithm visualizations.

### Quick Start
```bash
cd animations
python build.py scenes/two_pointers/scene.json -v
```

### Architecture
- **Scene specs**: `scenes/*/scene.json` - narration + visualization config (the product)
- **Adapters**: Swappable components for TTS, animation, recording, merging
- **Output**: `output/*/final.mp4` - synced video with narration

See `animations/ARCHITECTURE.md` for full documentation.
