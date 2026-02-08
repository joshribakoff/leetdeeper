"""Progress tracking data access."""

import json
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PROGRESS_DIR = REPO_ROOT / "progress"


def load_watched() -> list[dict]:
    """Load all watched entries from watched.jsonl."""
    path = PROGRESS_DIR / "watched.jsonl"
    if not path.exists():
        return []
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def load_watched_by_id() -> list[dict]:
    """Load watched entries keyed by youtube_id."""
    path = PROGRESS_DIR / "watched_by_id.jsonl"
    if not path.exists():
        return []
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def load_solved() -> list[dict]:
    """Load solved problems from solved.jsonl."""
    path = PROGRESS_DIR / "solved.jsonl"
    if not path.exists():
        return []
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def get_watched_set(playlist_name: str) -> set[int]:
    """Get set of watched indices for a specific playlist."""
    return {w["index"] for w in load_watched() if w.get("playlist") == playlist_name}


def get_watched_ids() -> set[str]:
    """Get set of all watched YouTube IDs."""
    return {w["youtube_id"] for w in load_watched_by_id()}


def playlist_progress(playlist_name: str, videos: list[dict]) -> dict:
    """Compute progress stats for a playlist."""
    watched_ids = get_watched_ids()
    watched_indices = get_watched_set(playlist_name)
    total = len(videos)
    # Use both index-based and id-based matching
    watched = sum(
        1 for v in videos
        if v["index"] in watched_indices or v.get("youtube_id") in watched_ids
    )
    return {"watched": watched, "total": total, "pct": int(100 * watched / total) if total else 0}


def toggle_watched(youtube_id: str, playlist: str | None, index: int | None, title: str | None) -> dict:
    """Toggle watched status. Returns {"watched": bool}."""
    from datetime import datetime, timezone
    watched_ids = get_watched_ids()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    if youtube_id in watched_ids:
        # Remove from both files
        for fname in ("watched_by_id.jsonl", "watched.jsonl"):
            path = PROGRESS_DIR / fname
            if not path.exists():
                continue
            lines = path.read_text().splitlines()
            kept = [l for l in lines if l.strip() and json.loads(l).get("youtube_id", "") != youtube_id]
            path.write_text("\n".join(kept) + "\n" if kept else "")
        return {"watched": False}
    else:
        # Append to both files
        by_id = {"youtube_id": youtube_id, "playlist": playlist, "index": index, "timestamp": now}
        by_title = {"title": title or "", "playlist": playlist, "index": index, "timestamp": now}
        with open(PROGRESS_DIR / "watched_by_id.jsonl", "a") as f:
            f.write(json.dumps(by_id) + "\n")
        with open(PROGRESS_DIR / "watched.jsonl", "a") as f:
            f.write(json.dumps(by_title) + "\n")
        return {"watched": True}


def overall_summary() -> dict:
    """High-level progress summary across all data."""
    from .playlists import list_playlists, load_playlist

    watched_ids = get_watched_ids()
    solved = load_solved()
    playlists = []

    for pl in list_playlists():
        videos = load_playlist(pl["name"])
        stats = playlist_progress(pl["name"], videos)
        playlists.append({**pl, **stats})

    return {
        "total_videos_watched": len(watched_ids),
        "total_problems_solved": len(solved),
        "playlists": playlists,
    }
