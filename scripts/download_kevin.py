#!/usr/bin/env python3
"""Download Kevin Naughton LeetCode videos."""
import json
import subprocess
import time
import random
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PLAYLIST_FILE = REPO_ROOT / "playlists" / "youtube_kevin_naughton_leetcode.jsonl"
OUTPUT_DIR = REPO_ROOT / "videos" / "kevin-naughton"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

with open(PLAYLIST_FILE) as f:
    videos = [json.loads(line) for line in f if line.strip()]

for video in videos:
    title = video["title"]
    vid_id = video["youtube_id"]
    
    # Check if already downloaded
    existing = list(OUTPUT_DIR.glob(f"*[{vid_id}]*"))
    if existing:
        print(f"SKIP: {title}")
        continue
    
    print(f"DOWNLOADING: {title}")
    url = f"https://www.youtube.com/watch?v={vid_id}"
    output_template = str(OUTPUT_DIR / f"{title} [{vid_id}].%(ext)s")
    
    try:
        subprocess.run([
            "yt-dlp", "-o", output_template, url
        ], check=True, capture_output=True)
        print(f"  OK: {title}")
    except subprocess.CalledProcessError as e:
        print(f"  FAILED: {title}")
    
    # Rate limit
    delay = random.randint(300, 600)
    print(f"  Waiting {delay}s...")
    time.sleep(delay)

print("DONE")
