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
CONFIG_FILE = REPO_ROOT / "download_config.json"
STATUS_FILE = REPO_ROOT / "download_status.json"

DENO_PATH = os.path.expanduser("~/.deno/bin")
FFMPEG_PATH = os.path.expanduser("~/.local/bin")


def load_config() -> dict:
    """Load config from download_config.json. Falls back to defaults."""
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE) as f:
            return json.load(f)
    return {"mode": "priority", "delays": {}, "playlists": {}}


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def log_event(event: dict):
    event["timestamp"] = datetime.now().isoformat()
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(event) + "\n")


def write_status(state: str, **kwargs):
    """Write current downloader status to a JSON file for the web UI."""
    data = {"state": state, "timestamp": datetime.now().isoformat(), **kwargs}
    STATUS_FILE.write_text(json.dumps(data))


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


def thumbnail_exists_by_id(youtube_id: str) -> bool:
    """Check if thumbnail exists in by-id folder."""
    return (BY_ID_DIR / f"{youtube_id}.jpg").exists()


def download_thumbnail(youtube_id: str) -> bool:
    """Download YouTube thumbnail to by-id folder. Returns success."""
    if thumbnail_exists_by_id(youtube_id):
        return True
    BY_ID_DIR.mkdir(parents=True, exist_ok=True)
    thumb_path = BY_ID_DIR / f"{youtube_id}.jpg"
    url = f"https://img.youtube.com/vi/{youtube_id}/mqdefault.jpg"
    try:
        import urllib.request
        urllib.request.urlretrieve(url, str(thumb_path))
        return thumb_path.exists()
    except Exception:
        return False


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


def download_playlist(name: str, config: dict, info_only: bool = False, cfg: dict = None):
    """Download all videos from a playlist with rate limiting."""
    if cfg is None:
        cfg = load_config()
    _, _, min_vid, max_vid = get_delays(cfg)
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
            download_thumbnail(youtube_id)
            skipped += 1
            continue

        log(f"Downloading {name} video {i}/{total}: {video_title}...")
        write_status("downloading", playlist=name, index=i, total=total,
                     title=video_title, youtube_id=youtube_id)
        dl_start = time.time()
        success, rate_limited = download_video_by_id(youtube_id)
        dl_elapsed = round(time.time() - dl_start)

        if success:
            create_symlink(youtube_id, playlist_dir, i, video_title)
            download_thumbnail(youtube_id)
            downloaded += 1
            log_event({"type": "video_downloaded", "playlist": name, "index": i,
                        "youtube_id": youtube_id, "elapsed_sec": dl_elapsed})
        elif rate_limited:
            log(f"STOPPING: Rate limited (403) - try again in a few hours")
            write_status("rate_limited", playlist=name, index=i)
            log_event({"type": "rate_limit_detected", "playlist": name, "index": i, "youtube_id": youtube_id})
            raise SystemExit(1)
        else:
            failed.append(i)
            log_event({"type": "video_failed", "playlist": name, "index": i, "youtube_id": youtube_id})

        # Delay between videos
        if i < total:
            delay = random.randint(min_vid, max_vid)
            resume_at = datetime.now().timestamp() + delay
            write_status("waiting", playlist=name, next_index=i + 1, total=total,
                         delay_sec=delay, resume_at=resume_at)
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


def get_delays(cfg: dict) -> tuple:
    """Get delay settings from config."""
    d = cfg.get("delays", {})
    return (
        d.get("min_playlist", 600),
        d.get("max_playlist", 1200),
        d.get("min_video", 300),
        d.get("max_video", 600),
    )


def run_priority(playlists: dict, cfg: dict, info_only: bool):
    """Download playlists in priority order (finish each before moving on)."""
    min_pl, max_pl, _, _ = get_delays(cfg)
    sorted_pl = sorted(playlists.items(), key=lambda x: x[1].get("priority", 99))

    for i, (name, config) in enumerate(sorted_pl):
        # Reload config each playlist to pick up changes
        fresh = load_config()
        fresh_delays = fresh.get("delays", {})
        min_pl = fresh_delays.get("min_playlist", min_pl)
        max_pl = fresh_delays.get("max_playlist", max_pl)

        download_playlist(name, config, info_only)

        if i < len(sorted_pl) - 1:
            delay = random.randint(min_pl, max_pl)
            log(f"Waiting {delay // 60}m {delay % 60}s before next playlist...")
            time.sleep(delay)


def run_round_robin(playlists: dict, cfg: dict, info_only: bool):
    """Download one video from each playlist, then rotate. Higher priority = more turns."""
    min_pl, max_pl, _, _ = get_delays(cfg)
    sorted_pl = sorted(playlists.items(), key=lambda x: x[1].get("priority", 99))

    # Build per-playlist state: load entries and track position
    states = {}
    for name, config in sorted_pl:
        entries = load_cached_jsonl(name, config)
        if not entries and "url" in config:
            info = get_playlist_info(config["url"])
            entries = info.get("entries", []) if "error" not in info else []
            if entries:
                save_playlist_jsonl(name, entries)
        if not entries:
            continue
        states[name] = {"config": config, "entries": entries, "pos": 0}
        # Skip already-downloaded videos at the front
        while states[name]["pos"] < len(entries):
            eid = entries[states[name]["pos"]].get("id")
            if eid and not video_exists_by_id(eid):
                break
            states[name]["pos"] += 1

    if info_only:
        return

    while states:
        for name in list(states.keys()):
            st = states[name]
            if st["pos"] >= len(st["entries"]):
                del states[name]
                continue

            entry = st["entries"][st["pos"]]
            youtube_id = entry.get("id")
            video_title = entry.get("title", "Unknown")
            playlist_dir = VIDEOS_DIR / name
            playlist_dir.mkdir(parents=True, exist_ok=True)

            if youtube_id and not video_exists_by_id(youtube_id):
                log(f"[round-robin] {name} {st['pos']+1}/{len(st['entries'])}: {video_title}")
                success, rate_limited = download_video_by_id(youtube_id)
                if success:
                    create_symlink(youtube_id, playlist_dir, st["pos"] + 1, video_title)
                    download_thumbnail(youtube_id)
                    log_event({"type": "video_downloaded", "playlist": name, "youtube_id": youtube_id})
                elif rate_limited:
                    log("STOPPING: Rate limited (403)")
                    log_event({"type": "rate_limit_detected", "playlist": name, "youtube_id": youtube_id})
                    raise SystemExit(1)

                delay = random.randint(min_pl, max_pl)
                log(f"Waiting {delay // 60}m {delay % 60}s...")
                time.sleep(delay)

            st["pos"] += 1


def main():
    parser = argparse.ArgumentParser(description="Download YouTube playlists")
    parser.add_argument("--info-only", action="store_true", help="Only fetch playlist info, don't download")
    parser.add_argument("--playlist", type=str, help="Download only this playlist")
    args = parser.parse_args()

    cfg = load_config()
    playlists = cfg.get("playlists", {})
    mode = cfg.get("mode", "priority")

    if args.playlist:
        if args.playlist not in playlists:
            print(f"Unknown playlist: {args.playlist}")
            print(f"Available: {', '.join(playlists.keys())}")
            sys.exit(1)
        playlists = {args.playlist: playlists[args.playlist]}

    log(f"Starting download ({mode} mode) of {len(playlists)} playlists")
    log_event({"type": "run_start", "mode": mode, "playlists": list(playlists.keys()), "info_only": args.info_only})

    if mode == "round-robin":
        run_round_robin(playlists, cfg, args.info_only)
    else:
        run_priority(playlists, cfg, args.info_only)

    log("All downloads complete")
    log_event({"type": "run_complete"})


if __name__ == "__main__":
    main()
