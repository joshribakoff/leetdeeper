#!/usr/bin/env python3
"""Pre-commit hook: validates playlist references in progress/watched.jsonl"""

import json
import sys
from pathlib import Path

repo_root = Path(__file__).parent.parent
watched_file = repo_root / "progress" / "watched.jsonl"
playlists_dir = repo_root / "playlists"

if not watched_file.exists():
    sys.exit(0)  # Nothing to validate

errors = []
seen_playlists = set()

with open(watched_file) as f:
    for line_num, line in enumerate(f, 1):
        line = line.strip()
        if not line:
            continue
        try:
            entry = json.loads(line)
        except json.JSONDecodeError as e:
            errors.append(f"Line {line_num}: Invalid JSON - {e}")
            continue

        playlist = entry.get("playlist")
        if not playlist:
            errors.append(f"Line {line_num}: Missing 'playlist' field")
            continue

        seen_playlists.add(playlist)

# Check each referenced playlist has a corresponding file
for playlist in seen_playlists:
    playlist_file = playlists_dir / f"{playlist}.jsonl"
    if not playlist_file.exists():
        errors.append(f"Playlist '{playlist}' referenced but {playlist_file.relative_to(repo_root)} not found")

if errors:
    print("❌ Validation failed:", file=sys.stderr)
    for err in errors:
        print(f"  {err}", file=sys.stderr)
    sys.exit(1)

print(f"✓ Validated {len(seen_playlists)} playlist reference(s)")
