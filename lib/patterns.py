"""Pattern-based progress analysis. Reuses logic from scripts/progress_report.py."""

import json
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).parent.parent


def _load_neetcode_data() -> list[dict]:
    path = REPO_ROOT / "neetcode" / ".problemSiteData.json"
    if not path.exists():
        return []
    with open(path) as f:
        return json.load(f)


def _load_completed() -> list[dict]:
    path = REPO_ROOT / "completed.json"
    if not path.exists():
        return []
    with open(path) as f:
        return json.load(f).get("completed", [])


def build_mappings(neetcode_data: list[dict]) -> tuple[dict, dict]:
    """Build video_id -> pattern and slug -> pattern mappings."""
    video_to_pattern = {}
    slug_to_pattern = {}
    for item in neetcode_data:
        if "video" in item:
            video_to_pattern[item["video"]] = item["pattern"]
        if "code" in item:
            parts = item["code"].split("-", 1)
            if len(parts) > 1:
                slug = parts[1].replace("-", "_")
                slug_to_pattern[slug] = item["pattern"]
    return video_to_pattern, slug_to_pattern


def get_pattern_order(neetcode_data: list[dict]) -> list[str]:
    """Get patterns in canonical NeetCode order."""
    patterns = []
    seen = set()
    for item in neetcode_data:
        p = item.get("pattern")
        if p and p not in seen:
            patterns.append(p)
            seen.add(p)
    return patterns


def analyze_by_pattern() -> dict:
    """Full pattern-based analysis for Blind 75. Returns coalesced items per pattern."""
    from .playlists import load_playlist
    from .progress import get_watched_set, get_watched_ids

    neetcode_data = _load_neetcode_data()
    if not neetcode_data:
        return {"patterns": [], "totals": {}}

    completed = _load_completed()
    completed_slugs = {p["slug"] for p in completed}
    playlist = load_playlist("youtube_neetcode_blind75")
    patterns_order = get_pattern_order(neetcode_data)

    watched_indices = get_watched_set("youtube_neetcode_blind75")
    watched_ids = get_watched_ids()

    # Index playlist videos by youtube_id for quick lookup
    playlist_by_vid = {v["youtube_id"]: v for v in playlist}

    # Build coalesced items: one row per neetcode blind75 problem
    items_by_pattern = defaultdict(list)
    counts = defaultdict(lambda: {"watched": 0, "total": 0, "completed": 0, "problems_total": 0})

    for item in neetcode_data:
        if not item.get("blind75"):
            continue
        pattern = item["pattern"]
        vid = item.get("video", "")
        code = item.get("code", "")
        parts = code.split("-", 1)
        slug = parts[1].replace("-", "_") if len(parts) > 1 else ""

        # Video status
        pv = playlist_by_vid.get(vid, {})
        is_watched = pv.get("index") in watched_indices or vid in watched_ids

        # Problem status
        is_completed = slug in completed_slugs

        items_by_pattern[pattern].append({
            "title": item.get("problem", code),
            "youtube_id": vid,
            "watched": is_watched,
            "completed": is_completed,
            "difficulty": item.get("difficulty", ""),
            "link": item.get("link", ""),
        })

        counts[pattern]["total"] += 1
        counts[pattern]["problems_total"] += 1
        if is_watched:
            counts[pattern]["watched"] += 1
        if is_completed:
            counts[pattern]["completed"] += 1

    # Build ordered result
    result_patterns = []
    total_watched = 0
    total_completed = 0
    for p in patterns_order:
        c = counts[p]
        if c["total"] == 0:
            continue
        total_watched += c["watched"]
        total_completed += c["completed"]
        result_patterns.append({
            "name": p,
            "videos_watched": c["watched"],
            "videos_total": c["total"],
            "problems_completed": c["completed"],
            "problems_total": c["problems_total"],
            "items": items_by_pattern[p],
        })

    return {
        "patterns": result_patterns,
        "totals": {
            "videos_watched": total_watched,
            "videos_total": 75,
            "problems_completed": total_completed,
            "problems_total": 75,
        },
    }
