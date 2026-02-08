#!/usr/bin/env python3
"""
Generate playlist inventories from downloaded videos.

Scans videos/ subfolders and creates inventory files in playlists/.
Each inventory is just: what videos exist, their index, title, youtube ID.
Problem mapping (which LeetCode problem a video covers) is added manually.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
VIDEOS_DIR = ROOT / "videos"
PLAYLISTS_DIR = ROOT / "playlists"


def parse_video_filename(filename: str) -> dict | None:
    """Parse video filename to extract metadata."""
    if not filename.endswith(".mp4"):
        return None

    # Extract YouTube ID from brackets: [KLlXCFG5TnA].mp4
    yt_match = re.search(r"\[([a-zA-Z0-9_-]+)\]\.mp4$", filename)
    youtube_id = yt_match.group(1) if yt_match else None

    # Extract index from start: 001 - ...
    idx_match = re.match(r"^(\d+)", filename)
    index = int(idx_match.group(1)) if idx_match else None

    # Extract LeetCode problem number if present: Leetcode 217
    leetcode_match = re.search(r"Leetcode\s*(\d+)", filename, re.IGNORECASE)
    problem_id = int(leetcode_match.group(1)) if leetcode_match else None

    # Extract title (text between index and leetcode number or brackets)
    title = filename
    title_match = re.match(r"^\d+\s*-\s*(.+?)(?:\s*-\s*Leetcode|\s*\[)", filename)
    if title_match:
        title = title_match.group(1).strip()

    return {
        "index": index,
        "title": title,
        "youtube_id": youtube_id,
        "problem_id": problem_id,  # Extracted from filename, may be null
    }


def generate_playlist_inventory(folder_name: str):
    """Generate inventory for a single playlist folder."""
    folder_path = VIDEOS_DIR / folder_name
    if not folder_path.is_dir():
        print(f"Folder not found: {folder_path}")
        return

    PLAYLISTS_DIR.mkdir(exist_ok=True)

    videos = []
    for video_file in sorted(folder_path.iterdir()):
        meta = parse_video_filename(video_file.name)
        if meta:
            videos.append(meta)

    # Convert folder name to playlist file name
    # neetcode-blind75 -> youtube_neetcode_blind75.jsonl
    playlist_name = f"youtube_{folder_name.replace('-', '_')}.jsonl"
    output_path = PLAYLISTS_DIR / playlist_name

    with open(output_path, "w") as f:
        for v in videos:
            f.write(json.dumps(v) + "\n")

    print(f"Generated playlists/{playlist_name} ({len(videos)} videos)")


def generate_all():
    """Generate inventories for all video folders."""
    if not VIDEOS_DIR.exists():
        print(f"Videos directory not found: {VIDEOS_DIR}")
        return

    for subdir in sorted(VIDEOS_DIR.iterdir()):
        if subdir.is_dir() and not subdir.name.startswith("."):
            generate_playlist_inventory(subdir.name)


if __name__ == "__main__":
    generate_all()
