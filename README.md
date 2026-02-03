# LeetDeeper

Learning algorithms in public. A workspace for deliberate practice with data structures and algorithms—combating AI-induced brain rot one problem at a time.

## What's Here

```
leetdeeper/
├── practice/           # My solutions (the actual work)
├── completed.json      # Progress tracking
├── notes.md            # Learning notes and insights
├── scripts/            # Utility scripts
│   └── download_playlists.py  # Download video playlists
├── videos/             # Downloaded videos (gitignored)
│   └── by-id/          # Stored by YouTube ID, symlinked per playlist
├── neetcode/           # NeetCode curriculum (submodule)
│   ├── articles/       # Written explanations
│   ├── hints/          # Progressive hints
│   └── python/         # Reference solutions
├── fucking-algorithm/  # Labuladong's algorithm book (submodule)
├── leetcode-py/        # LeetCode Python solutions (submodule)
└── python_leetcode_runner/  # Test runner utility (submodule)
```

## My Setup

### Terminal: Kitty
Fast, GPU-accelerated terminal with splits and tabs.

### Editor: NeoVim
Configured for Python development with LSP, fuzzy finding, and quick navigation.

### AI Pair Programming: Claude Code
Claude helps me understand patterns, debug solutions, and learn from mistakes without giving away answers.

### Video Generation: LeetDreamer
Sister project for generating narrated algorithm visualizations. Write JSON, get a video where a robot explains sliding window while boxes dance. Perfect for when you finally understand something and want proof before you forget it again. See [joshribakoff/leetdreamer](https://github.com/joshribakoff/leetdreamer).

## Workflow

1. **Pick a problem**: Start from NeetCode roadmap or classic problem lists
2. **Attempt solution**: Work in `practice/<problem>/solution.py`
3. **Use hints progressively**: Check `neetcode/hints/` before solutions
4. **Run tests**: `pytest practice/<problem>/test_solution.py -v`
5. **Study the pattern**: Read articles, understand the *why*
6. **Track progress**: Update `completed.json`

## Knowledge Bases (Submodules)

| Submodule | Description |
|-----------|-------------|
| [neetcode](https://github.com/neetcode-gh/leetcode) | NeetCode's curriculum with solutions in 15+ languages |
| [fucking-algorithm](https://github.com/joshribakoff/fucking-algorithm) | Labuladong's algorithm book (my fork with contributions) |
| [leetcode-py](https://github.com/wislertt/leetcode-py) | Python LeetCode solutions |
| [python_leetcode_runner](https://github.com/tusharsadhwani/python_leetcode_runner) | Utility for running LeetCode tests locally |

## Clone with Submodules

```bash
git clone --recursive https://github.com/joshribakoff/leetdeeper.git
```

Or if you already cloned:
```bash
git submodule update --init --recursive
```

## Video Resources

Download curated playlists for offline study:

```bash
pip install yt-dlp
python scripts/download_playlists.py           # Main playlists
python scripts/download_kevin.py               # Kevin Naughton (supplementary)
```

| Source | Content | Videos |
|--------|---------|--------|
| **NeetCode** | Blind 75, DP, Trees, Graphs, Backtracking, Binary Search, Linked List, Stack, Sliding Window | ~300 |
| **Kevin Naughton Jr.** | LeetCode solutions with clear, brief explanations | 124 |
| **MIT OCW** | 6.006 Introduction to Algorithms (Erik Demaine) | 34 |
| **Abdul Bari** | Algorithms fundamentals | 84 |
| **mycodeschool** | Data Structures, Sorting, Binary Search, Recursion, Time Complexity | ~80 |

Videos stored by ID with symlinks per playlist. Scripts handle deduplication and rate limiting.

### Regenerating Playlists

Playlist metadata is cached in `playlists/*.jsonl`. To regenerate:
```bash
./scripts/generate_kevin_playlist.sh  # Kevin Naughton (filtered to LeetCode only)
```

## Progress Tracking

```bash
python scripts/progress_report.py    # Blind 75 progress with bars
python scripts/track.py status       # Multi-source watch progress
python scripts/track.py queue        # View study queue
```

Progress files:
- `completed.json` - Problems solved
- `progress/watched.jsonl` - Blind 75 videos watched
- `progress/watched_multi.jsonl` - Multi-source video tracking
- `study_queue.jsonl` - Bookmarked problems to study

## License

My code is MIT. Submodules have their own licenses.

---

*"The goal isn't to memorize solutions. It's to recognize patterns and understand why they work."*

*Also: if you don't use it, you lose it.*
