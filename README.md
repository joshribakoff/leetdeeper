# LeetDeeper

A system for mastering algorithms through aggregated learning resources, unified curriculum mapping, and custom visualizations.

## Vision

LeetDeeper aims to solve a core problem in algorithm interview prep: resources are scattered, progress is siloed, and explanations are one-size-fits-all.

**The idea:** Aggregate the best learning resources (NeetCode, Abdul Bari, MyCodeSchool, Labuladong, etc.), align them to a unified curriculum model, and layer on custom tools for visualization and progress tracking.

### What This Could Become

| Capability | Status |
|------------|--------|
| Multi-source video aggregation | In progress |
| Unified problem/pattern taxonomy | Planned |
| Progress tracking (videos, problems, patterns) | Basic local tracking |
| AI-generated visualizations (via LeetDreamer) | Working prototype |
| Spaced repetition scheduling | Planned |
| Web platform with user accounts | Vision phase |

### Competitive Positioning

| Platform | Strengths | Gaps |
|----------|-----------|------|
| LeetCode | Problem database, community | Cluttered, paywalled, no video |
| NeetCode | Clean roadmap, videos | Single perspective, static |
| AlgoMonster | Structured curriculum | Paywalled, no customization |
| **LeetDeeper** | Multi-source, AI video gen, open | Early stage |

### Open Question: Personal Tool vs Platform

Currently this is my personal study workspace. The architecture decisions ahead depend on which path to take:

- **Personal tool**: Keep it local, optimize for my workflow, simpler
- **Reusable framework**: Extract patterns others can use, more work upfront
- **Full platform**: User accounts, hosted service, compete with NeetCode/AlgoMonster

See `plans/leetdeeper/3k7f2-platform-vision.md` for the full roadmap.

---

## Current State

Learning algorithms in public. This is my grinding workspace for LeetCode interview prep, complete with notes, workflows, and the knowledge bases I study from.

## What's Here

```
leetdeeper/
├── practice/           # My solutions (the actual work)
├── completed.json      # Progress tracking
├── notes.md            # Learning notes and insights
├── scripts/            # Utility scripts
│   └── download_blind75.py  # Download NeetCode Blind 75 videos
├── neetcode/           # NeetCode curriculum (submodule)
│   ├── articles/       # Written explanations
│   ├── hints/          # Progressive hints
│   ├── python/         # Reference solutions
│   └── videos/         # Downloaded videos (gitignored, ~1.6GB)
├── fucking-algorithm/  # Labuladong's algorithm book (submodule, my fork)
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
The custom visualization engine powering LeetDeeper's AI-generated explanations. Write JSON scene specs, get narrated algorithm animations. In the platform vision, LeetDreamer becomes the backend for on-demand video generation—users request an explanation, the system generates a personalized walkthrough. See [joshribakoff/leetdreamer](https://github.com/joshribakoff/leetdreamer).

## Workflow

1. **Pick a problem**: Start from NeetCode roadmap or Blind 75
2. **Attempt solution**: Work in `practice/<problem>/solution.py`
3. **Use hints progressively**: Check `neetcode/hints/` before solutions
4. **Run tests**: `pytest practice/<problem>/test_solution.py -v`
5. **Study the pattern**: Read articles, understand the *why*
6. **Track progress**: Update `completed.json`

## Knowledge Bases (Submodules)

These submodules represent the "aggregation" layer—pulling together quality resources from multiple creators into a unified workspace. Future work: align these to a common problem/pattern taxonomy.

| Submodule | Description |
|-----------|-------------|
| [neetcode](https://github.com/neetcode-gh/leetcode) | NeetCode's curriculum with solutions in 15+ languages |
| [fucking-algorithm](https://github.com/joshribakoff/fucking-algorithm) | Labuladong's algorithm book (my fork with contributions) |
| [leetcode-py](https://github.com/wislertt/leetcode-py) | Python LeetCode solutions |
| [python_leetcode_runner](https://github.com/tusharsadhwani/python_leetcode_runner) | Utility for running LeetCode tests locally |

**Potential additions:** Abdul Bari lectures, MyCodeSchool videos, Back To Back SWE, other high-quality educators.

## Clone with Submodules

```bash
git clone --recursive https://github.com/joshribakoff/leetdeeper.git
```

Or if you already cloned:
```bash
git submodule update --init --recursive
```

## Download NeetCode Videos

The Blind 75 playlist videos can be downloaded locally for offline study:

```bash
pip install yt-dlp
python scripts/download_blind75.py
```

Videos are saved to `neetcode/videos/` (~1.6GB total). The script adds random delays between downloads to avoid throttling.

## Progress Tracking

Currently basic local tracking via `completed.json`. Run:
```bash
python show_progress.py -p  # Progress by pattern
```

**Vision:** Track progress across multiple dimensions:
- Problems solved (by pattern, difficulty, source)
- Videos watched (across all aggregated sources)
- Patterns mastered (based on solve rate + recency)
- Spaced repetition scheduling for review

## License

My code is MIT. Submodules have their own licenses.

---

*"The goal isn't to memorize solutions. It's to recognize patterns and understand why they work."*
