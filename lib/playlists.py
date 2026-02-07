"""Playlist data access."""

import json
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PLAYLISTS_DIR = REPO_ROOT / "playlists"


def load_playlist(name: str) -> list[dict]:
    """Load a single playlist by name. Returns list of {index, title, youtube_id}."""
    path = PLAYLISTS_DIR / f"{name}.jsonl"
    if not path.exists():
        return []
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def list_playlists() -> list[dict]:
    """List all playlists with metadata. Returns [{name, video_count}]."""
    results = []
    for path in sorted(PLAYLISTS_DIR.glob("*.jsonl")):
        name = path.stem
        with open(path) as f:
            count = sum(1 for line in f if line.strip())
        # Human-readable label from filename
        label = name.replace("youtube_", "").replace("_", " ").title()
        results.append({"name": name, "label": label, "video_count": count})
    return results
