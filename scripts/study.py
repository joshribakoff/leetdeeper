#!/usr/bin/env python3
"""
Blind 75 study workflow helper.
Shows current video, article, and handles marking watched.
"""

import json
import sys
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
VIDEOS_DIR = REPO_ROOT / "videos" / "neetcode-blind75"
ARTICLES_DIR = REPO_ROOT / "neetcode" / "articles"
PLAYLIST_FILE = REPO_ROOT / "playlists" / "youtube_neetcode_blind75.jsonl"
WATCHED_FILE = REPO_ROOT / "progress" / "watched.jsonl"
NEETCODE_DATA = REPO_ROOT / "neetcode" / ".problemSiteData.json"


def load_playlist():
    with open(PLAYLIST_FILE) as f:
        return [json.loads(line) for line in f if line.strip()]


def load_watched():
    with open(WATCHED_FILE) as f:
        return [json.loads(line) for line in f if line.strip()]


def load_neetcode_data():
    with open(NEETCODE_DATA) as f:
        return json.load(f)


def get_next_unwatched():
    """Get the next unwatched video index."""
    watched = load_watched()
    watched_indices = {w["index"] for w in watched if w["playlist"] == "youtube_neetcode_blind75"}
    playlist = load_playlist()
    
    for video in playlist:
        if video["index"] not in watched_indices:
            return video["index"]
    return None


def get_video_info(index: int):
    """Get video info by index."""
    playlist = load_playlist()
    neetcode = load_neetcode_data()
    
    video = next((v for v in playlist if v["index"] == index), None)
    if not video:
        return None
    
    # Find matching neetcode data for pattern and article
    nc_item = next((item for item in neetcode if item.get("video") == video["youtube_id"]), None)
    
    # Find article
    article_path = None
    if nc_item:
        link = nc_item.get("link", "").rstrip("/")
        potential_article = ARTICLES_DIR / f"{link}.md"
        if potential_article.exists():
            article_path = potential_article
    
    # Find video file
    video_files = list(VIDEOS_DIR.glob(f"{index:03d}*"))
    video_path = video_files[0] if video_files else None
    
    return {
        "index": index,
        "title": video["title"],
        "youtube_id": video["youtube_id"],
        "pattern": nc_item.get("pattern") if nc_item else "Unknown",
        "difficulty": nc_item.get("difficulty") if nc_item else "Unknown",
        "video_path": video_path,
        "article_path": article_path,
    }


def mark_watched(index: int):
    """Mark a video as watched."""
    date = datetime.now().strftime("%Y-%m")
    entry = {"playlist": "youtube_neetcode_blind75", "index": index, "date": date}
    
    with open(WATCHED_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
    
    print(f"Marked video {index} as watched.")


def show_video(index: int):
    """Display info for a specific video."""
    info = get_video_info(index)
    if not info:
        print(f"Video {index} not found.")
        return
    
    print("=" * 70)
    print(f"VIDEO {info['index']}: {info['title']}")
    print("=" * 70)
    print(f"Pattern:    {info['pattern']}")
    print(f"Difficulty: {info['difficulty']}")
    print()
    
    if info["video_path"]:
        print(f"Video:   {info['video_path']}")
    else:
        print(f"Video:   NOT DOWNLOADED (youtube_id: {info['youtube_id']})")
    
    if info["article_path"]:
        print(f"Article: {info['article_path']}")
    else:
        print("Article: Not found")
    print()


def main():
    if len(sys.argv) < 2:
        print("Usage: python study.py <command> [args]")
        print("Commands:")
        print("  show <n>      Show info for video n")
        print("  next          Show next unwatched video")
        print("  mark <n>      Mark video n as watched")
        return
    
    cmd = sys.argv[1]
    
    if cmd == "show":
        index = int(sys.argv[2]) if len(sys.argv) > 2 else None
        if index:
            show_video(index)
        else:
            print("Usage: python study.py show <n>")
    
    elif cmd == "next":
        index = get_next_unwatched()
        if index:
            show_video(index)
        else:
            print("All videos watched!")
    
    elif cmd == "mark":
        index = int(sys.argv[2]) if len(sys.argv) > 2 else None
        if index:
            mark_watched(index)
        else:
            print("Usage: python study.py mark <n>")
    
    else:
        print(f"Unknown command: {cmd}")


if __name__ == "__main__":
    main()
