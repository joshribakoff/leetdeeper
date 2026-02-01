#!/usr/bin/env python3
"""
Generate a comprehensive progress report for Blind 75 study.
Shows videos watched vs problems completed by pattern with progress bars.
"""

import json
from pathlib import Path
from collections import defaultdict

SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent


def progress_bar(done: int, total: int, width: int = 10) -> str:
    """Generate a progress bar string."""
    if total == 0:
        return "░" * width
    filled = int(width * done / total)
    return "█" * filled + "░" * (width - filled)


def load_data():
    """Load all required data files."""
    with open(REPO_ROOT / "neetcode/.problemSiteData.json") as f:
        neetcode_data = json.load(f)

    with open(REPO_ROOT / "completed.json") as f:
        completed = json.load(f)["completed"]

    with open(REPO_ROOT / "progress/watched.jsonl") as f:
        watched = [json.loads(line) for line in f if line.strip()]

    with open(REPO_ROOT / "playlists/youtube_neetcode_blind75.jsonl") as f:
        playlist = [json.loads(line) for line in f if line.strip()]

    return neetcode_data, completed, watched, playlist


def build_mappings(neetcode_data):
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


def get_pattern_order(neetcode_data):
    """Get patterns in canonical order."""
    patterns = []
    seen = set()
    for item in neetcode_data:
        p = item.get("pattern")
        if p and p not in seen:
            patterns.append(p)
            seen.add(p)
    return patterns


def analyze_progress(neetcode_data, completed, watched, playlist):
    """Analyze progress by pattern."""
    video_to_pattern, slug_to_pattern = build_mappings(neetcode_data)
    
    watched_indices = {w["index"] for w in watched if w["playlist"] == "youtube_neetcode_blind75"}
    
    videos_by_pattern = defaultdict(lambda: {"watched": 0, "total": 0})
    problems_by_pattern = defaultdict(lambda: {"completed": 0, "total": 0})
    
    # Count videos
    for video in playlist:
        vid = video["youtube_id"]
        pattern = video_to_pattern.get(vid, "Unknown")
        videos_by_pattern[pattern]["total"] += 1
        if video["index"] in watched_indices:
            videos_by_pattern[pattern]["watched"] += 1
    
    # Count problems (totals from blind75)
    for item in neetcode_data:
        if item.get("blind75"):
            problems_by_pattern[item["pattern"]]["total"] += 1
    
    # Count completed
    for prob in completed:
        slug = prob["slug"]
        pattern = slug_to_pattern.get(slug, "Unknown")
        problems_by_pattern[pattern]["completed"] += 1
    
    return videos_by_pattern, problems_by_pattern, len(watched_indices), len(completed)


def find_gaps(videos_by_pattern, problems_by_pattern, patterns):
    """Find notable gaps in progress."""
    gaps = []
    
    for pattern in patterns:
        v = videos_by_pattern[pattern]
        p = problems_by_pattern[pattern]
        
        # Videos watched but no problems done
        if v["watched"] > 0 and p["completed"] == 0:
            gaps.append(f"**{pattern}**: {v['watched']} videos watched, 0 problems done")
        
        # More problems than videos (doing problems without watching)
        if p["completed"] > v["watched"] and v["total"] > 0:
            gaps.append(f"**{pattern}**: More problems done ({p['completed']}) than videos watched ({v['watched']})")
    
    return gaps


def generate_report():
    """Generate the full progress report."""
    neetcode_data, completed, watched, playlist = load_data()
    patterns = get_pattern_order(neetcode_data)
    videos_by_pattern, problems_by_pattern, total_watched, total_completed = analyze_progress(
        neetcode_data, completed, watched, playlist
    )
    
    # Header
    print("=" * 78)
    print("BLIND 75 PROGRESS")
    print("=" * 78)
    print()
    
    # Overall stats
    v_pct = int(100 * total_watched / 75)
    p_pct = int(100 * total_completed / 75)
    print(f"Videos Watched:    {progress_bar(total_watched, 75, 20)} {v_pct:3}%  ({total_watched}/75)")
    print(f"Problems Completed:{progress_bar(total_completed, 75, 20)} {p_pct:3}%  ({total_completed}/75)")
    print()
    
    # By pattern
    print("-" * 78)
    print(f"{'Pattern':<28} {'Videos':<24} {'Problems':<24}")
    print("-" * 78)
    
    for pattern in patterns:
        v = videos_by_pattern[pattern]
        p = problems_by_pattern[pattern]
        
        if v["total"] == 0 and p["total"] == 0:
            continue
        
        v_pct = int(100 * v["watched"] / v["total"]) if v["total"] > 0 else 0
        p_pct = int(100 * p["completed"] / p["total"]) if p["total"] > 0 else 0
        
        v_bar = progress_bar(v["watched"], v["total"], 8)
        p_bar = progress_bar(p["completed"], p["total"], 8)
        
        v_str = f"{v_bar} {v_pct:3}% ({v['watched']}/{v['total']})"
        p_str = f"{p_bar} {p_pct:3}% ({p['completed']}/{p['total']})"
        
        print(f"{pattern:<28} {v_str:<24} {p_str:<24}")
    
    print("-" * 78)
    print()
    
    # Notable gaps
    gaps = find_gaps(videos_by_pattern, problems_by_pattern, patterns)
    if gaps:
        print("Notable gaps:")
        for gap in gaps:
            print(f"  • {gap}")
        print()


if __name__ == "__main__":
    generate_report()
