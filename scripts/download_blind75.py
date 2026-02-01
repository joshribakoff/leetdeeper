#!/usr/bin/env python3
"""
Download NeetCode Blind 75 videos with random delays to avoid throttling.

Usage:
    python scripts/download_blind75.py

Requirements:
    pip install yt-dlp

Videos are saved to videos/ at repo root (gitignored).
"""

import subprocess
import random
import time
import os
import sys
from pathlib import Path

PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf"

# Output to videos/ at repo root (not in submodule)
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
OUTPUT_DIR = REPO_ROOT / "videos"
OUTPUT_TEMPLATE = str(OUTPUT_DIR / "%(playlist_index)03d - %(title)s [%(id)s].%(ext)s")

# Random delay between videos (in seconds)
MIN_DELAY = 5 * 60   # 5 minutes
MAX_DELAY = 20 * 60  # 20 minutes

# Video range (1-indexed playlist positions)
START_INDEX = 1
END_INDEX = 75

# Optional paths for deno and ffmpeg if not in PATH
DENO_PATH = os.path.expanduser("~/.deno/bin")
FFMPEG_PATH = os.path.expanduser("~/.local/bin")

def video_exists(index):
    """Check if video for this index already exists."""
    pattern = f"{index:03d} - *.mp4"
    return list(OUTPUT_DIR.glob(pattern))


def download_video(index):
    """Download a single video by playlist index."""
    if video_exists(index):
        print(f"Video {index} already exists, skipping")
        return True

    env = os.environ.copy()
    env["PATH"] = f"{DENO_PATH}:{FFMPEG_PATH}:{env['PATH']}"

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "bestvideo[height<=1080]+bestaudio/best",
        "--merge-output-format", "mp4",
        "--playlist-items", str(index),
        "-o", OUTPUT_TEMPLATE,
        PLAYLIST_URL
    ]

    print(f"\n{'='*60}")
    print(f"Downloading video {index}/75...")
    print(f"{'='*60}\n")

    result = subprocess.run(cmd, env=env)
    return result.returncode == 0

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    downloaded = 0
    skipped = 0
    failed = []

    for i in range(START_INDEX, END_INDEX + 1):
        if video_exists(i):
            skipped += 1
            print(f"Video {i} exists, skipping")
            continue

        success = download_video(i)

        if success:
            downloaded += 1
            print(f"\n✓ Video {i} downloaded ({downloaded} new, {skipped} skipped)")
        else:
            failed.append(i)
            print(f"\n✗ Video {i} failed")

        # Sleep before next download (not between skips)
        remaining = [j for j in range(i + 1, END_INDEX + 1) if not video_exists(j)]
        if remaining:
            delay = random.randint(MIN_DELAY, MAX_DELAY)
            print(f"\nSleeping {delay // 60}m {delay % 60}s... ({len(remaining)} remaining)")
            time.sleep(delay)

    print(f"\n{'='*60}")
    print(f"COMPLETE: {downloaded} downloaded, {skipped} skipped, {len(failed)} failed")
    if failed:
        print(f"Failed: {failed}")

if __name__ == "__main__":
    main()
