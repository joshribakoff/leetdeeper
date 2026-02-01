#!/usr/bin/env python3
"""Migrate old progress files to new format."""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
PROGRESS_DIR = ROOT / "progress"


def migrate_completed():
    """Migrate completed.json to progress/solved.jsonl."""
    completed_path = ROOT / "completed.json"
    if not completed_path.exists():
        print(f"No completed.json found at {completed_path}")
        return

    PROGRESS_DIR.mkdir(exist_ok=True)

    with open(completed_path) as f:
        data = json.load(f)

    output_path = PROGRESS_DIR / "solved.jsonl"
    with open(output_path, "w") as out:
        for entry in data.get("completed", []):
            new_entry = {
                "problem_id": entry["number"],
                "date": entry.get("date"),
                "local_path": None,  # Could scan practice/ folder to find this
            }
            out.write(json.dumps(new_entry) + "\n")

    print(f"Migrated {len(data.get('completed', []))} entries to {output_path}")


def migrate_watch_progress():
    """Migrate watch_progress.jsonl to progress/watched.jsonl."""
    watch_path = ROOT / "watch_progress.jsonl"
    if not watch_path.exists():
        print(f"No watch_progress.jsonl found at {watch_path}")
        return

    PROGRESS_DIR.mkdir(exist_ok=True)

    entries = []
    with open(watch_path) as f:
        for line in f:
            if line.strip():
                entries.append(json.loads(line))

    output_path = PROGRESS_DIR / "watched.jsonl"
    with open(output_path, "w") as out:
        for entry in entries:
            new_entry = {
                "creator": "neetcode",
                "playlist": "blind75",
                "index": entry["index"],
                "date": entry.get("watched"),
            }
            out.write(json.dumps(new_entry) + "\n")

    print(f"Migrated {len(entries)} entries to {output_path}")


if __name__ == "__main__":
    migrate_completed()
    migrate_watch_progress()
