"""Download progress tracking."""

import json
import os
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PLAYLISTS_DIR = REPO_ROOT / "playlists"
BY_ID_DIR = REPO_ROOT / "videos" / "by-id"
CONFIG_FILE = REPO_ROOT / "download_config.json"
LOG_FILE = REPO_ROOT / "download_log.jsonl"
STATUS_FILE = REPO_ROOT / "download_status.json"


def load_config() -> dict:
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE) as f:
            return json.load(f)
    return {"mode": "priority", "delays": {}, "playlists": {}}


def get_download_progress() -> list[dict]:
    """Per-playlist download progress: total, downloaded, remaining."""
    cfg = load_config()
    results = []

    for name, pl_cfg in cfg.get("playlists", {}).items():
        if "jsonl" in pl_cfg:
            jsonl_path = PLAYLISTS_DIR / pl_cfg["jsonl"]
        else:
            jsonl_name = f"youtube_{name.replace('-', '_')}.jsonl"
            jsonl_path = PLAYLISTS_DIR / jsonl_name

        if not jsonl_path.exists():
            results.append({
                "name": name,
                "priority": pl_cfg.get("priority", 99),
                "total": 0, "downloaded": 0,
                "label": name.replace("-", " ").title(),
            })
            continue

        total = 0
        downloaded = 0
        with open(jsonl_path) as f:
            for line in f:
                if not line.strip():
                    continue
                entry = json.loads(line)
                yt_id = entry.get("youtube_id") or entry.get("id")
                total += 1
                if yt_id and (BY_ID_DIR / f"{yt_id}.mp4").exists():
                    downloaded += 1

        label = name.replace("-", " ").title()
        results.append({
            "name": name,
            "priority": pl_cfg.get("priority", 99),
            "total": total,
            "downloaded": downloaded,
            "label": label,
        })

    results.sort(key=lambda x: x["priority"])
    return results


def get_download_activity() -> dict:
    """Parse download_log.jsonl for recent activity, pace, and ETA."""
    if not LOG_FILE.exists():
        return {"recent": [], "pace": None, "eta": None, "running": False, "last_event": None}

    events = []
    with open(LOG_FILE) as f:
        for line in f:
            if not line.strip():
                continue
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    if not events:
        return {"recent": [], "pace": None, "eta": None, "running": False, "last_event": None}

    # Recent downloads (last 10)
    downloads = [e for e in events if e.get("type") == "video_downloaded"]
    recent = downloads[-10:]

    # Calculate pace from last 20 downloads
    pace_window = downloads[-20:]
    pace_sec = None
    if len(pace_window) >= 2:
        try:
            t0 = datetime.fromisoformat(pace_window[0]["timestamp"])
            t1 = datetime.fromisoformat(pace_window[-1]["timestamp"])
            elapsed = (t1 - t0).total_seconds()
            if elapsed > 0:
                pace_sec = elapsed / (len(pace_window) - 1)
        except (KeyError, ValueError):
            pass

    # Is it running? Check if last event was recent (within 30 min)
    last_event = events[-1]
    running = False
    last_ts = None
    try:
        last_ts = datetime.fromisoformat(last_event["timestamp"])
        age = (datetime.now() - last_ts).total_seconds()
        # Consider running if last event < 30 min ago and wasn't a run_complete or rate_limit
        running = age < 1800 and last_event.get("type") not in ("run_complete", "rate_limit_detected")
    except (KeyError, ValueError):
        pass

    # ETA: remaining videos * pace
    eta_sec = None
    if pace_sec:
        playlists = get_download_progress()
        remaining = sum(p["total"] - p["downloaded"] for p in playlists)
        if remaining > 0:
            eta_sec = int(remaining * pace_sec)

    return {
        "recent": [{
            "playlist": e.get("playlist", ""),
            "youtube_id": e.get("youtube_id", ""),
            "index": e.get("index"),
            "timestamp": e.get("timestamp", ""),
        } for e in recent],
        "pace": round(pace_sec) if pace_sec else None,
        "eta": eta_sec,
        "running": running,
        "last_event": {
            "type": last_event.get("type", ""),
            "timestamp": last_event.get("timestamp", ""),
            "playlist": last_event.get("playlist", last_event.get("name", "")),
        },
        "total_downloaded": len(downloads),
    }


def get_live_status() -> dict | None:
    """Read current downloader status (downloading/waiting/idle)."""
    if not STATUS_FILE.exists():
        return None
    try:
        data = json.loads(STATUS_FILE.read_text())
        # Check staleness — if status is > 30 min old, consider idle
        ts = datetime.fromisoformat(data.get("timestamp", ""))
        age = (datetime.now() - ts).total_seconds()
        if age > 1800:
            return None
        return data
    except (json.JSONDecodeError, ValueError):
        return None


def get_change_mtime() -> float:
    """Return max mtime of log + status files for change detection."""
    mtimes = []
    for f in (LOG_FILE, STATUS_FILE):
        try:
            mtimes.append(f.stat().st_mtime)
        except OSError:
            pass
    return max(mtimes) if mtimes else 0


def get_download_config() -> dict:
    cfg = load_config()
    return {
        "mode": cfg.get("mode", "priority"),
        "delays": cfg.get("delays", {}),
    }


def update_download_config(updates: dict):
    cfg = load_config()
    if "mode" in updates:
        cfg["mode"] = updates["mode"]
    if "delays" in updates:
        cfg["delays"].update(updates["delays"])
    with open(CONFIG_FILE, "w") as f:
        json.dump(cfg, f, indent=2)
        f.write("\n")
