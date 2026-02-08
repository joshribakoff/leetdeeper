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


def _parse_ytdlp_progress(line: str) -> dict | None:
    """Parse yt-dlp progress line like '[download]  45.2% of 50.3MiB at 2.5MiB/s ETA 00:12'."""
    import re
    m = re.search(
        r'\[download\]\s+([\d.]+)%\s+of\s+~?([\d.]+\S+)\s+at\s+([\d.]+\S+)\s+ETA\s+(\S+)',
        line
    )
    if m:
        return {
            "percent": float(m.group(1)),
            "size": m.group(2),
            "speed": m.group(3),
            "dl_eta": m.group(4),
        }
    # Also match "[download] 100% of ..." or "[merger] Merging..."
    if '[download] 100%' in line:
        return {"percent": 100.0, "size": "", "speed": "", "dl_eta": "0:00"}
    if '[Merger]' in line or '[merger]' in line:
        return {"percent": 100.0, "size": "", "speed": "merging", "dl_eta": "0:00"}
    return None


def download_video_by_id(youtube_id: str, status_ctx: dict = None) -> tuple[bool, bool]:
    """Download a single video to by-id folder.

    Returns: (success, is_rate_limited)
    status_ctx: extra fields to include in status updates (playlist, index, etc.)
    """
    BY_ID_DIR.mkdir(parents=True, exist_ok=True)
    output_path = str(BY_ID_DIR / "%(id)s.%(ext)s")

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "bestvideo[height<=1080]+bestaudio/best",
        "--merge-output-format", "mp4",
        "--newline",  # One progress line per update (not \r overwrites)
        "-o", output_path,
        f"https://www.youtube.com/watch?v={youtube_id}"
    ]

    proc = subprocess.Popen(cmd, env=get_env(), stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT, text=True)
    stderr_lines = []
    last_update = 0

    for line in proc.stdout:
        line = line.rstrip()
        stderr_lines.append(line)

        progress = _parse_ytdlp_progress(line)
        if progress and status_ctx:
            now = time.time()
            # Throttle status writes to every 2 seconds
            if now - last_update >= 2 or progress["percent"] >= 100:
                last_update = now
                write_status("downloading", **status_ctx, **progress)

    proc.wait()

    if proc.returncode == 0:
        return True, False

    output = "\n".join(stderr_lines)
    if "403" in output or "HTTP Error 403" in output:
        log(f"Rate limited (403) on {youtube_id}")
        return False, True

    log(f"Download failed: {output[:200]}")
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
        result = download_one_video(youtube_id, name, i, total, video_title, playlist_dir)
        if result == "success":
            downloaded += 1
        elif result == "rate_limited":
            raise SystemExit(1)
        else:
            failed.append(i)

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

    if failed:
        log(f"STOPPING: {name} has {len(failed)} failed videos. Fix and rerun.")
        failed_titles = [entries[i - 1].get("title", f"video {i}") for i in failed]
        write_status("stopped", playlist=name, failed_count=len(failed),
                     failed_indices=failed, failed_titles=failed_titles)
        raise SystemExit(1)


def get_delays(cfg: dict) -> tuple:
    """Get delay settings from config."""
    d = cfg.get("delays", {})
    return (
        d.get("min_playlist", 600),
        d.get("max_playlist", 1200),
        d.get("min_video", 300),
        d.get("max_video", 600),
    )


def download_one_video(youtube_id: str, name: str, index: int, total: int,
                       video_title: str, playlist_dir: Path) -> str:
    """Download a single video with status tracking and logging.

    Returns: 'success', 'rate_limited', or 'failed'.
    """
    ctx = {"playlist": name, "index": index, "total": total,
           "title": video_title, "youtube_id": youtube_id}
    write_status("downloading", **ctx)
    dl_start = time.time()
    success, rate_limited = download_video_by_id(youtube_id, status_ctx=ctx)
    dl_elapsed = round(time.time() - dl_start)

    if success:
        create_symlink(youtube_id, playlist_dir, index, video_title)
        download_thumbnail(youtube_id)
        log_event({"type": "video_downloaded", "playlist": name, "index": index,
                    "youtube_id": youtube_id, "title": video_title, "elapsed_sec": dl_elapsed})
        return "success"
    elif rate_limited:
        log(f"STOPPING: Rate limited (403) - try again in a few hours")
        write_status("rate_limited", playlist=name, index=index)
        log_event({"type": "rate_limit_detected", "playlist": name, "index": index, "youtube_id": youtube_id})
        return "rate_limited"
    else:
        log_event({"type": "video_failed", "playlist": name, "index": index, "youtube_id": youtube_id})
        return "failed"


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
            next_name = sorted_pl[i + 1][0]
            resume_at = datetime.now().timestamp() + delay
            write_status("waiting", playlist=next_name, delay_sec=delay, resume_at=resume_at)
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
                index = st["pos"] + 1
                total = len(st["entries"])
                log(f"[round-robin] {name} {index}/{total}: {video_title}")
                result = download_one_video(youtube_id, name, index, total, video_title, playlist_dir)
                if result == "rate_limited":
                    raise SystemExit(1)

                # Re-read config for delay/mode changes
                fresh = load_config()
                min_pl, max_pl, _, _ = get_delays(fresh)
                delay = random.randint(min_pl, max_pl)
                resume_at = datetime.now().timestamp() + delay
                write_status("waiting", playlist=name, next_index=index + 1, total=total,
                             delay_sec=delay, resume_at=resume_at)
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
