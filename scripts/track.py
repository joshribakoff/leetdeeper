#!/usr/bin/env python3
"""
Multi-source video tracking.

Usage:
    python scripts/track.py watch <source> <youtube_id> [problem_name]
    python scripts/track.py status
    python scripts/track.py queue
    python scripts/track.py queue add <problem> <lc_num> <reason>
    python scripts/track.py queue done <problem>

Sources: neetcode, kevin, abdul-bari, etc.
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from collections import defaultdict

REPO_ROOT = Path(__file__).parent.parent
WATCHED_FILE = REPO_ROOT / "progress" / "watched_multi.jsonl"
QUEUE_FILE = REPO_ROOT / "progress" / "queue.jsonl"
PLAYLISTS_DIR = REPO_ROOT / "playlists"


def load_watched():
    if not WATCHED_FILE.exists():
        return []
    with open(WATCHED_FILE) as f:
        return [json.loads(line) for line in f if line.strip()]


def load_queue():
    if not QUEUE_FILE.exists():
        return []
    with open(QUEUE_FILE) as f:
        return [json.loads(line) for line in f if line.strip()]


def save_queue(items):
    with open(QUEUE_FILE, "w") as f:
        for item in items:
            f.write(json.dumps(item) + "\n")


def mark_watched(source: str, youtube_id: str, problem_name: str = ""):
    entry = {
        "source": source,
        "youtube_id": youtube_id,
        "problem": problem_name,
        "date": datetime.now().strftime("%Y-%m-%d"),
    }
    with open(WATCHED_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
    print(f"Marked {source}/{youtube_id} as watched")


def show_status():
    watched = load_watched()

    # Group by source
    by_source = defaultdict(list)
    for w in watched:
        by_source[w["source"]].append(w)

    print("=" * 60)
    print("WATCH PROGRESS BY SOURCE")
    print("=" * 60)

    for source, items in sorted(by_source.items()):
        print(f"\n{source}: {len(items)} videos watched")
        # Show last 3
        for item in items[-3:]:
            print(f"  - {item.get('problem', item['youtube_id'])} ({item['date']})")


def show_queue():
    queue = load_queue()
    if not queue:
        print("Queue is empty")
        return

    print("=" * 60)
    print("STUDY QUEUE")
    print("=" * 60)

    for i, item in enumerate(sorted(queue, key=lambda x: x.get("priority", 99)), 1):
        sources = ", ".join(item.get("sources", []))
        print(f"{i}. [{item.get('lc', '?')}] {item['problem']}")
        print(f"   Sources: {sources}")
        print(f"   Reason: {item.get('reason', '')}")
        print()


def queue_add(problem: str, lc_num: int, reason: str):
    queue = load_queue()
    max_priority = max((q.get("priority", 0) for q in queue), default=0)
    entry = {
        "problem": problem,
        "lc": lc_num,
        "sources": [],
        "priority": max_priority + 1,
        "reason": reason,
    }
    queue.append(entry)
    save_queue(queue)
    print(f"Added {problem} to queue")


def queue_done(problem: str):
    queue = load_queue()
    queue = [q for q in queue if q["problem"].lower() != problem.lower()]
    save_queue(queue)
    print(f"Removed {problem} from queue")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    cmd = sys.argv[1]

    if cmd == "watch" and len(sys.argv) >= 4:
        source = sys.argv[2]
        youtube_id = sys.argv[3]
        problem = sys.argv[4] if len(sys.argv) > 4 else ""
        mark_watched(source, youtube_id, problem)

    elif cmd == "status":
        show_status()

    elif cmd == "queue":
        if len(sys.argv) >= 3 and sys.argv[2] == "add":
            if len(sys.argv) >= 6:
                queue_add(sys.argv[3], int(sys.argv[4]), sys.argv[5])
            else:
                print("Usage: track.py queue add <problem> <lc_num> <reason>")
        elif len(sys.argv) >= 4 and sys.argv[2] == "done":
            queue_done(sys.argv[3])
        else:
            show_queue()

    else:
        print(__doc__)


if __name__ == "__main__":
    main()
