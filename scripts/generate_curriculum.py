#!/usr/bin/env python3
"""Generate curriculum files from source data."""

import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
PROBLEM_DATA = ROOT / "neetcode" / ".problemSiteData.json"
VIDEOS_DIR = ROOT / "videos"
CURRICULUM_DIR = ROOT / "curriculum"


def extract_problem_id(code: str) -> int | None:
    """Extract LeetCode problem ID from code like '0001-two-sum'."""
    match = re.match(r"^(\d+)-", code)
    return int(match.group(1)) if match else None


def code_to_slug(code: str) -> str:
    """Convert code like '0001-two-sum' to slug 'two_sum'."""
    match = re.match(r"^\d+-(.+)$", code)
    if match:
        return match.group(1).replace("-", "_")
    return code.replace("-", "_")


def generate_problems():
    """Generate curriculum/problems.jsonl from NeetCode data."""
    with open(PROBLEM_DATA) as f:
        problems = json.load(f)

    CURRICULUM_DIR.mkdir(exist_ok=True)
    output_path = CURRICULUM_DIR / "problems.jsonl"

    with open(output_path, "w") as out:
        for p in problems:
            if "code" not in p:
                continue

            problem_id = extract_problem_id(p["code"])
            if problem_id is None:
                continue

            lists = []
            if p.get("blind75"):
                lists.append("blind-75")
            if p.get("neetcode150"):
                lists.append("neetcode-150")

            entry = {
                "id": problem_id,
                "slug": code_to_slug(p["code"]),
                "title": p["problem"],
                "difficulty": p["difficulty"],
                "pattern": p["pattern"],
                "lists": lists,
            }
            out.write(json.dumps(entry) + "\n")

    print(f"Generated {output_path}")


def parse_video_filename(filename: str) -> dict | None:
    """Parse video filename to extract metadata.

    Format: '001 - Two Sum - Leetcode 1 - HashMap - Python [KLlXCFG5TnA].mp4'
    """
    if not filename.endswith(".mp4"):
        return None

    # Extract YouTube ID from brackets
    yt_match = re.search(r"\[([a-zA-Z0-9_-]+)\]\.mp4$", filename)
    youtube_id = yt_match.group(1) if yt_match else None

    # Extract index from start
    idx_match = re.match(r"^(\d+)", filename)
    index = int(idx_match.group(1)) if idx_match else None

    # Extract title (first part after index)
    title_match = re.match(r"^\d+\s*-\s*([^-\[]+)", filename)
    title = title_match.group(1).strip() if title_match else filename

    return {
        "index": index,
        "youtube_id": youtube_id,
        "title": title,
        "filename": filename,
    }


def generate_videos():
    """Generate curriculum/videos.jsonl by scanning videos directory."""
    if not VIDEOS_DIR.exists():
        print(f"Videos directory not found: {VIDEOS_DIR}")
        return

    # Load problems for matching
    problems_path = CURRICULUM_DIR / "problems.jsonl"
    problems_by_title = {}
    if problems_path.exists():
        with open(problems_path) as f:
            for line in f:
                p = json.loads(line)
                # Normalize title for matching
                key = p["title"].lower().strip()
                problems_by_title[key] = p["id"]

    output_path = CURRICULUM_DIR / "videos.jsonl"

    with open(output_path, "w") as out:
        for subdir in sorted(VIDEOS_DIR.iterdir()):
            if not subdir.is_dir() or subdir.name.startswith("."):
                continue

            # Parse folder name: "neetcode-blind75" -> creator="neetcode", playlist="blind75"
            parts = subdir.name.split("-", 1)
            creator = parts[0]
            playlist = parts[1] if len(parts) > 1 else "default"

            for video_file in sorted(subdir.iterdir()):
                meta = parse_video_filename(video_file.name)
                if not meta:
                    continue

                # Try to match to a problem
                problem_id = problems_by_title.get(meta["title"].lower())

                entry = {
                    "creator": creator,
                    "playlist": playlist,
                    "index": meta["index"],
                    "problem_id": problem_id,
                    "youtube_id": meta["youtube_id"],
                    "title": meta["title"],
                    "local_path": f"videos/{subdir.name}/{meta['filename']}",
                }
                out.write(json.dumps(entry) + "\n")

    print(f"Generated {output_path}")


if __name__ == "__main__":
    generate_problems()
    generate_videos()
