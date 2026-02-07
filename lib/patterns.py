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
    """Full pattern-based analysis for Blind 75. Returns data for web display."""
    from .playlists import load_playlist
    from .progress import get_watched_set, get_watched_ids

    neetcode_data = _load_neetcode_data()
    if not neetcode_data:
        return {"patterns": [], "totals": {}}

    completed = _load_completed()
    playlist = load_playlist("youtube_neetcode_blind75")
    video_to_pattern, slug_to_pattern = build_mappings(neetcode_data)
    patterns_order = get_pattern_order(neetcode_data)

    watched_indices = get_watched_set("youtube_neetcode_blind75")
    watched_ids = get_watched_ids()

    videos_by_pattern = defaultdict(lambda: {"watched": 0, "total": 0, "videos": []})
    problems_by_pattern = defaultdict(lambda: {"completed": 0, "total": 0, "problems": []})

    # Count videos per pattern
    for video in playlist:
        vid = video["youtube_id"]
        pattern = video_to_pattern.get(vid, "Unknown")
        is_watched = video["index"] in watched_indices or vid in watched_ids
        videos_by_pattern[pattern]["total"] += 1
        if is_watched:
            videos_by_pattern[pattern]["watched"] += 1
        videos_by_pattern[pattern]["videos"].append({
            "index": video["index"],
            "title": video["title"],
            "youtube_id": vid,
            "watched": is_watched,
        })

    # Count problems per pattern (totals from blind75 flag)
    completed_slugs = {p["slug"] for p in completed}
    for item in neetcode_data:
        if item.get("blind75"):
            pattern = item["pattern"]
            problems_by_pattern[pattern]["total"] += 1
            code = item.get("code", "")
            parts = code.split("-", 1)
            slug = parts[1].replace("-", "_") if len(parts) > 1 else ""
            is_done = slug in completed_slugs
            if is_done:
                problems_by_pattern[pattern]["completed"] += 1
            problems_by_pattern[pattern]["problems"].append({
                "title": item.get("title", code),
                "slug": slug,
                "completed": is_done,
            })

    # Build ordered result
    result_patterns = []
    total_watched = 0
    total_completed = 0
    for p in patterns_order:
        v = videos_by_pattern[p]
        pr = problems_by_pattern[p]
        if v["total"] == 0 and pr["total"] == 0:
            continue
        total_watched += v["watched"]
        total_completed += pr["completed"]
        result_patterns.append({
            "name": p,
            "videos_watched": v["watched"],
            "videos_total": v["total"],
            "videos_pct": int(100 * v["watched"] / v["total"]) if v["total"] else 0,
            "problems_completed": pr["completed"],
            "problems_total": pr["total"],
            "problems_pct": int(100 * pr["completed"] / pr["total"]) if pr["total"] else 0,
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
