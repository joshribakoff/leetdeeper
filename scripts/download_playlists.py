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
BY_ID_DIR = VIDEOS_DIR / "by-id"
PLAYLISTS_DIR = REPO_ROOT / "playlists"
LOG_FILE = REPO_ROOT / "download_log.jsonl"

DENO_PATH = os.path.expanduser("~/.deno/bin")
FFMPEG_PATH = os.path.expanduser("~/.local/bin")

# Delay between playlists (10-20 minutes)
MIN_PLAYLIST_DELAY = 10 * 60
MAX_PLAYLIST_DELAY = 20 * 60

# Delay between videos within a playlist (5-10 min)
MIN_VIDEO_DELAY = 5 * 60
MAX_VIDEO_DELAY = 10 * 60

PLAYLISTS = {
    # Primary - NeetCode
    "neetcode-blind75": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
        "priority": 1,
    },
    # Kevin Naughton - curated from channel (no playlist URL, uses pre-cached JSONL)
    "kevin-naughton": {
        "jsonl": "youtube_kevin_naughton_leetcode.jsonl",  # Pre-cached, no URL fetch needed
        "priority": 20,  # Finish last - CS fundamentals more valuable
    },
    "neetcode-dp": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53lcvx_tjrr_m2lgD2NsRHlNO",
        "priority": 2,
    },
    "neetcode-trees": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53ldg4pN6PfzoJY7KsKcxF1jg",
        "priority": 3,
    },
    "neetcode-graphs": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53ldBT_7QA8NVot219jFNr_GI",
        "priority": 4,
    },
    "neetcode-backtracking": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXo",
        "priority": 5,
    },
    "neetcode-binary-search": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53leNZQd0iINpD-MAhMOMzWvO",
        "priority": 6,
    },
    "neetcode-linked-list": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53leU0Ec0VkBhnf4npMRFiNcB",
        "priority": 7,
    },
    "neetcode-stack": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53lfxD6l5pAGvCD4nPvWKU8Qo",
        "priority": 8,
    },
    "neetcode-sliding-window": {
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53leOBgcVsJBEGrHPd_7x_koV",
        "priority": 9,
    },
    # MIT - dense but solid (medium priority)
    "mit-6006-algorithms": {
        "url": "https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb",
        "priority": 8,
    },
    # Abdul Bari - deeper theory (lower priority)
    "abdul-bari-algorithms": {
        "url": "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
        "priority": 9,
    },
    # mycodeschool - approachable CS fundamentals (high priority)
    "mycodeschool-data-structures": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P",
        "priority": 2,
    },
    "mycodeschool-time-complexity": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI9HK8YPVBjElbLbI3ufctn",
        "priority": 3,
    },
    "mycodeschool-recursion": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwLz3g66WrxFGSXvSsvyfzCO",
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
    "mycodeschool-interview-questions": {
        "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwLPEZrZIcNEq9ukGWPfLT4A",
        "priority": 7,
    },
}


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


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


def video_exists_by_id(youtube_id: str) -> bool:
    """Check if video exists in by-id folder."""
    return (BY_ID_DIR / f"{youtube_id}.mp4").exists()


def create_symlink(youtube_id: str, playlist_dir: Path, index: int, title: str):
    """Create human-readable symlink in playlist folder."""
    filename = f"{index:03d} - {title} [{youtube_id}].mp4"
    # Sanitize filename
    filename = "".join(c if c not in '<>:"/\\|?*' else '_' for c in filename)
    symlink_path = playlist_dir / filename

    if symlink_path.exists() or symlink_path.is_symlink():
        symlink_path.unlink()

    symlink_path.symlink_to(f"../by-id/{youtube_id}.mp4")


def download_video_by_id(youtube_id: str) -> tuple[bool, bool]:
    """Download a single video to by-id folder.

    Returns: (success, is_rate_limited)
    """
    BY_ID_DIR.mkdir(parents=True, exist_ok=True)
    output_path = str(BY_ID_DIR / "%(id)s.%(ext)s")

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "bestvideo[height<=1080]+bestaudio/best",
        "--merge-output-format", "mp4",
        "-o", output_path,
        f"https://www.youtube.com/watch?v={youtube_id}"
    ]

    result = subprocess.run(cmd, env=get_env(), capture_output=True, text=True)

    if result.returncode == 0:
        return True, False

    # Check for rate limiting (403)
    stderr = result.stderr or ""
    if "403" in stderr or "HTTP Error 403" in stderr:
        log(f"Rate limited (403) on {youtube_id}")
        return False, True

    # Other error
    log(f"Download failed: {stderr[:200]}")
    return False, False


def save_playlist_jsonl(name: str, entries: list):
    """Save playlist entries to JSONL file."""
    # Convert folder name to JSONL filename (neetcode-blind75 -> youtube_neetcode_blind75)
    jsonl_name = f"youtube_{name.replace('-', '_')}.jsonl"
    jsonl_path = PLAYLISTS_DIR / jsonl_name

    with open(jsonl_path, "w") as f:
        for i, entry in enumerate(entries, 1):
            record = {
                "index": i,
                "title": entry.get("title", "Unknown"),
                "youtube_id": entry.get("id"),
            }
            f.write(json.dumps(record) + "\n")

    log(f"Saved {len(entries)} entries to {jsonl_path.name}")


def load_cached_jsonl(name: str, config: dict) -> list | None:
    """Load entries from cached JSONL if available."""
    # Check for explicit jsonl config (curated playlists)
    if "jsonl" in config:
        jsonl_path = PLAYLISTS_DIR / config["jsonl"]
    else:
        jsonl_name = f"youtube_{name.replace('-', '_')}.jsonl"
        jsonl_path = PLAYLISTS_DIR / jsonl_name

    if jsonl_path.exists() and jsonl_path.stat().st_size > 0:
        with open(jsonl_path) as f:
            entries = []
            for line in f:
                if line.strip():
                    entry = json.loads(line)
                    # Normalize to yt-dlp format
                    entries.append({
                        "id": entry.get("youtube_id") or entry.get("id"),
                        "title": entry.get("title", "Unknown"),
                    })
            if entries:
                return entries
    return None


def download_playlist(name: str, config: dict, info_only: bool = False):
    """Download all videos from a playlist with rate limiting."""
    playlist_dir = VIDEOS_DIR / name
    playlist_dir.mkdir(parents=True, exist_ok=True)
    BY_ID_DIR.mkdir(parents=True, exist_ok=True)

    # Try cached JSONL first (idempotent - don't re-fetch if we have it)
    entries = load_cached_jsonl(name, config)

    if entries:
        log(f"{name}: Using cached JSONL ({len(entries)} videos)")
        log_event({"type": "playlist_cached", "name": name, "count": len(entries)})
    elif "url" in config:
        # Fetch from YouTube
        log(f"Fetching info for {name}...")
        info = get_playlist_info(config["url"])

        if "error" in info:
            log(f"Error fetching {name}: {info['error']}")
            log_event({"type": "playlist_error", "name": name, "error": info["error"]})
            return

        entries = info.get("entries", [])
        title = info.get("title", name)
        log(f"{name}: {title} - {len(entries)} videos")
        log_event({"type": "playlist_info", "name": name, "title": title, "count": len(entries)})

        # Save playlist metadata to JSONL
        save_playlist_jsonl(name, entries)
    else:
        log(f"{name}: No URL and no cached JSONL, skipping")
        return

    total = len(entries)

    if info_only:
        return

    downloaded = 0
    skipped = 0
    failed = []

    for i, entry in enumerate(entries, 1):
        youtube_id = entry.get("id")
        video_title = entry.get("title", "Unknown")

        if not youtube_id:
            log(f"Skipping {name} video {i}: no ID")
            continue

        # Check if already downloaded (by youtube_id, handles duplicates)
        if video_exists_by_id(youtube_id):
            # Just create symlink if missing
            create_symlink(youtube_id, playlist_dir, i, video_title)
            skipped += 1
            continue

        log(f"Downloading {name} video {i}/{total}: {video_title}...")
        success, rate_limited = download_video_by_id(youtube_id)

        if success:
            create_symlink(youtube_id, playlist_dir, i, video_title)
            downloaded += 1
            log_event({"type": "video_downloaded", "playlist": name, "index": i, "youtube_id": youtube_id})
        elif rate_limited:
            # Fail-fast: stop immediately on 403
            log(f"STOPPING: Rate limited (403) - try again in a few hours")
            log_event({"type": "rate_limit_detected", "playlist": name, "index": i, "youtube_id": youtube_id})
            raise SystemExit(1)
        else:
            failed.append(i)
            log_event({"type": "video_failed", "playlist": name, "index": i, "youtube_id": youtube_id})

        # Delay between videos
        if i < total:
            delay = random.randint(MIN_VIDEO_DELAY, MAX_VIDEO_DELAY)
            log(f"Waiting {delay // 60}m {delay % 60}s before next video...")
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
