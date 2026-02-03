#!/bin/bash
# Generate Kevin Naughton LeetCode playlist from his channel
# Filters out career/lifestyle videos, keeps only LeetCode solutions

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_FILE="$REPO_ROOT/playlists/youtube_kevin_naughton_leetcode.jsonl"

echo "Fetching all videos from Kevin Naughton Jr. channel..."
yt-dlp --flat-playlist --print "%(title)s | %(id)s" \
    "https://www.youtube.com/@KevinNaughtonJr/videos" 2>/dev/null > /tmp/kevin_all_videos.txt

echo "Found $(wc -l < /tmp/kevin_all_videos.txt) total videos"

echo "Filtering to LeetCode solution videos..."
# Filter out career advice, lifestyle, vlogs - keep algorithm problem titles
cat /tmp/kevin_all_videos.txt | grep -viE \
    "(day in the life|how (i|to)|why |software engineer|google|amazon|tech |career|job|interview|quit|work|learn|code|coding|impostor|panic|promoted|happy|sucks|advice|majors|computer science|negotiat|travel|living|secret|layoff|hired|failing|problems|habits|idea|losing|offer|class|start over|years|formula|apartment|dream|incubator|girlfriend|today|listen up|stop interview|can't get|dad|100k|girls|hacked|built|face-off|thoughts|spongebob|egged)" \
    > /tmp/kevin_leetcode.txt

echo "Found $(wc -l < /tmp/kevin_leetcode.txt) LeetCode videos"

echo "Generating JSONL playlist file..."
cat /tmp/kevin_leetcode.txt | python3 -c "
import sys, json
for i, line in enumerate(sys.stdin, 1):
    parts = line.strip().rsplit(' | ', 1)
    if len(parts) == 2:
        title, vid_id = parts
        print(json.dumps({'index': i, 'title': title, 'youtube_id': vid_id}))
" > "$OUTPUT_FILE"

echo "Wrote $OUTPUT_FILE with $(wc -l < "$OUTPUT_FILE") entries"
