#!/usr/bin/env python3
"""
Video Watch Progress Tracker

Tracks which videos you've watched from downloaded playlists.
Stores progress in watch_progress.jsonl (append-only).
"""

import json
import re
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
VIDEOS_DIR = SCRIPT_DIR / "videos"
WATCH_FILE = SCRIPT_DIR / "watch_progress.jsonl"


def get_video_list() -> list[dict]:
    """Get list of downloaded videos with parsed metadata."""
    if not VIDEOS_DIR.exists():
        return []

    videos = []
    for f in sorted(VIDEOS_DIR.glob("*.mp4")):
        # Parse filename: "001 - Two Sum - Leetcode 1 - HashMap - Python [KLlXCFG5TnA].mp4"
        match = re.match(r"(\d+) - (.+?) - Leetcode (\d+)", f.name)
        if match:
            videos.append({
                "index": int(match.group(1)),
                "title": match.group(2),
                "leetcode_num": int(match.group(3)),
                "file": f.name,
            })
    return videos


def load_watched() -> dict[int, dict]:
    """Load watched entries from JSONL. Returns {index: entry}."""
    if not WATCH_FILE.exists():
        return {}

    watched = {}
    with open(WATCH_FILE) as f:
        for line in f:
            if line.strip():
                entry = json.loads(line)
                watched[entry["index"]] = entry
    return watched


def mark_watched(index: int, date: str = None):
    """Mark a video as watched (appends to JSONL)."""
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")

    entry = {"index": index, "watched": date}
    with open(WATCH_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
    print(f"Marked video {index} as watched on {date}")


def mark_range_watched(start: int, end: int, date: str = None):
    """Mark a range of videos as watched."""
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")

    with open(WATCH_FILE, "a") as f:
        for i in range(start, end + 1):
            entry = {"index": i, "watched": date}
            f.write(json.dumps(entry) + "\n")
    print(f"Marked videos {start}-{end} as watched on {date}")


def show_progress(verbose: bool = False):
    """Show video watch progress."""
    videos = get_video_list()
    watched = load_watched()

    if not videos:
        print("No videos found in videos/")
        return

    total = len(videos)
    done = len(watched)
    pct = (done / total * 100) if total > 0 else 0

    width = 20
    filled = int(width * done / total) if total > 0 else 0
    bar = "█" * filled + "░" * (width - filled)

    print(f"\n=== NeetCode Blind 75 Videos ===\n")
    print(f"Watched: {done}/{total} ({pct:.0f}%) {bar}\n")

    if verbose:
        for v in videos:
            check = "✓" if v["index"] in watched else " "
            date = watched.get(v["index"], {}).get("watched", "")
            date_str = f" [{date}]" if date else ""
            print(f"  [{check}] {v['index']:03}. {v['title']}{date_str}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Track video watch progress")
    parser.add_argument("-v", "--verbose", action="store_true", help="Show individual videos")
    parser.add_argument("--mark", type=int, metavar="N", help="Mark video N as watched")
    parser.add_argument("--mark-range", type=str, metavar="N-M", help="Mark videos N through M as watched")
    parser.add_argument("--date", type=str, help="Date to use (YYYY-MM-DD), default today")
    args = parser.parse_args()

    if args.mark:
        mark_watched(args.mark, args.date)
    elif args.mark_range:
        start, end = map(int, args.mark_range.split("-"))
        mark_range_watched(start, end, args.date)
    else:
        show_progress(verbose=args.verbose)


if __name__ == "__main__":
    main()
