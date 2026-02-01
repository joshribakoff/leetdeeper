#!/usr/bin/env python3
"""
Download multiple YouTube playlists with rate limiting.

Usage:
    python scripts/download_playlists.py [--info-only] [--playlist NAME]

Playlists are defined in PLAYLISTS below. Downloads to videos/<folder>/.
Uses long random delays between playlists to avoid rate limiting.
"""

import subprocess
import random
import time
import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
VIDEOS_DIR = REPO_ROOT / "videos"
LOG_FILE = REPO_ROOT / "download_log.jsonl"

DENO_PATH = os.path.expanduser("~/.deno/bin")
FFMPEG_PATH = os.path.expanduser("~/.local/bin")

# Delay between playlists (5-15 minutes)
MIN_PLAYLIST_DELAY = 5 * 60
MAX_PLAYLIST_DELAY = 15 * 60

# Delay between videos within a playlist (30s - 2min)
MIN_VIDEO_DELAY = 30
MAX_VIDEO_DELAY = 120

PLAYLISTS = {
    "neetcode-blind75": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
        "priority": 1,
    },
    "abdul-bari-algorithms": {
        "url": "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
        "priority": 2,
    },
    "mycodeschool-interview-questions": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwLPEZrZIcNEq9ukGWPfLT4A",
        "priority": 3,
    },
    "mycodeschool-data-structures": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P",
        "priority": 4,
    },
    "mycodeschool-sorting": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwKedT2KfDMB9YA5DgASZb3U",
        "priority": 5,
    },
    "mycodeschool-binary-search": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwL3ldWlrii6YeLszojgH77j",
        "priority": 6,
    },
    "mycodeschool-time-complexity": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI9HK8YPVBjElbLbI3ufctn",
        "priority": 7,
    },
    "mycodeschool-recursion": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwLz3g66WrxFGSXvSsvyfzCO",
        "priority": 8,
    },
}


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}")


def log_event(event: dict):
    event["timestamp"] = datetime.now().isoformat()
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(event) + "\n")


def get_env():
    env = os.environ.copy()
    env["PATH"] = f"{DENO_PATH}:{FFMPEG_PATH}:{env['PATH']}"
    return env


def get_playlist_info(url: str) -> dict:
    """Fetch playlist metadata without downloading."""
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--flat-playlist", "-J", url
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, env=get_env())
    if result.returncode != 0:
        return {"error": result.stderr}
    return json.loads(result.stdout)


def video_exists(output_dir: Path, index: int) -> bool:
    """Check if video for this index already exists."""
    pattern = f"{index:03d} - *.mp4"
    return bool(list(output_dir.glob(pattern)))


def download_video(url: str, output_dir: Path, index: int) -> bool:
    """Download a single video by playlist index."""
    output_template = str(output_dir / "%(playlist_index)03d - %(title)s [%(id)s].%(ext)s")

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "bestvideo[height<=1080]+bestaudio/best",
        "--merge-output-format", "mp4",
        "--playlist-items", str(index),
        "-o", output_template,
        url
    ]

    result = subprocess.run(cmd, env=get_env())
    return result.returncode == 0


def download_playlist(name: str, config: dict, info_only: bool = False):
    """Download all videos from a playlist with rate limiting."""
    url = config["url"]
    output_dir = VIDEOS_DIR / name
    output_dir.mkdir(parents=True, exist_ok=True)

    log(f"Fetching info for {name}...")
    info = get_playlist_info(url)

    if "error" in info:
        log(f"Error fetching {name}: {info['error']}")
        log_event({"type": "playlist_error", "name": name, "error": info["error"]})
        return

    total = len(info.get("entries", []))
    title = info.get("title", name)
    log(f"{name}: {title} - {total} videos")
    log_event({"type": "playlist_info", "name": name, "title": title, "count": total})

    if info_only:
        return

    downloaded = 0
    skipped = 0
    failed = []

    for i in range(1, total + 1):
        if video_exists(output_dir, i):
            skipped += 1
            continue

        log(f"Downloading {name} video {i}/{total}...")
        success = download_video(url, output_dir, i)

        if success:
            downloaded += 1
            log_event({"type": "video_downloaded", "playlist": name, "index": i})
        else:
            failed.append(i)
            log_event({"type": "video_failed", "playlist": name, "index": i})

        # Delay between videos
        if i < total:
            delay = random.randint(MIN_VIDEO_DELAY, MAX_VIDEO_DELAY)
            log(f"Waiting {delay}s before next video...")
            time.sleep(delay)

    log(f"{name}: {downloaded} downloaded, {skipped} skipped, {len(failed)} failed")
    log_event({
        "type": "playlist_complete",
        "name": name,
        "downloaded": downloaded,
        "skipped": skipped,
        "failed": failed
    })


def main():
    parser = argparse.ArgumentParser(description="Download YouTube playlists")
    parser.add_argument("--info-only", action="store_true", help="Only fetch playlist info, don't download")
    parser.add_argument("--playlist", type=str, help="Download only this playlist")
    args = parser.parse_args()

    playlists = PLAYLISTS
    if args.playlist:
        if args.playlist not in PLAYLISTS:
            print(f"Unknown playlist: {args.playlist}")
            print(f"Available: {', '.join(PLAYLISTS.keys())}")
            sys.exit(1)
        playlists = {args.playlist: PLAYLISTS[args.playlist]}

    # Sort by priority
    sorted_playlists = sorted(playlists.items(), key=lambda x: x[1].get("priority", 99))

    log(f"Starting download of {len(sorted_playlists)} playlists")
    log_event({"type": "run_start", "playlists": list(playlists.keys()), "info_only": args.info_only})

    for i, (name, config) in enumerate(sorted_playlists):
        download_playlist(name, config, args.info_only)

        # Delay between playlists
        if i < len(sorted_playlists) - 1:
            delay = random.randint(MIN_PLAYLIST_DELAY, MAX_PLAYLIST_DELAY)
            log(f"Waiting {delay // 60}m {delay % 60}s before next playlist...")
            time.sleep(delay)

    log("All downloads complete")
    log_event({"type": "run_complete"})


if __name__ == "__main__":
    main()
