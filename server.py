#!/usr/bin/env python3
"""LeetDeeper API server. JSON-only — frontend served by Vite in dev."""

import json
import subprocess
import time
from pathlib import Path
from flask import Flask, Response, jsonify, send_from_directory
from flask.helpers import send_file
from lib.playlists import list_playlists, load_playlist
from lib.progress import playlist_progress, get_watched_ids, overall_summary
from lib.media import enrich_videos
from lib.patterns import analyze_by_pattern
from lib.downloads import get_download_progress, get_download_config, update_download_config, get_download_activity, get_change_mtime, get_live_status

VIDEOS_DIR = Path(__file__).parent / "videos" / "by-id"

app = Flask(__name__, static_folder="static", static_url_path="")


@app.route("/thumbs/<path:filename>")
def serve_thumb(filename):
    """Serve thumbnails from videos/by-id/ (same location as video files)."""
    return send_from_directory("videos/by-id", filename)


@app.route("/api/summary")
def api_summary():
    return jsonify(overall_summary())


@app.route("/api/playlists")
def api_playlists():
    playlists = list_playlists()
    # Sort by watch percentage descending, then by name
    playlists.sort(key=lambda p: p.get("name", ""))
    return jsonify(playlists)


@app.route("/api/playlists/<name>")
def api_playlist(name):
    videos = load_playlist(name)
    if not videos:
        return jsonify({"error": "not found"}), 404
    watched_ids = get_watched_ids()
    for v in videos:
        v["watched"] = v.get("youtube_id", "") in watched_ids
    enrich_videos(videos)
    stats = playlist_progress(name, videos)
    return jsonify({"name": name, "videos": videos, **stats})


@app.route("/api/play/<youtube_id>", methods=["POST"])
def api_play(youtube_id):
    """Open a video in VLC."""
    video = VIDEOS_DIR / f"{youtube_id}.mp4"
    if not video.exists():
        return jsonify({"error": "video not found"}), 404
    subprocess.Popen(["open", "-a", "VLC", str(video)])
    return jsonify({"ok": True})


@app.route("/api/patterns")
def api_patterns():
    return jsonify(analyze_by_pattern())


@app.route("/api/downloads")
def api_downloads():
    return jsonify({
        "playlists": get_download_progress(),
        "config": get_download_config(),
        "activity": get_download_activity(),
        "live": get_live_status(),
    })


@app.route("/api/downloads/stream")
def api_downloads_stream():
    """SSE endpoint — pushes updates when download_log.jsonl or status changes."""
    def generate():
        last_mtime = 0
        while True:
            mtime = get_change_mtime()
            if mtime != last_mtime:
                last_mtime = mtime
                data = {
                    "playlists": get_download_progress(),
                    "config": get_download_config(),
                    "activity": get_download_activity(),
                    "live": get_live_status(),
                }
                yield f"data: {json.dumps(data)}\n\n"
            time.sleep(2)

    return Response(generate(), mimetype="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
    })


@app.route("/api/downloads/config", methods=["POST"])
def api_update_downloads_config():
    from flask import request
    update_download_config(request.json)
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
