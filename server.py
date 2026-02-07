#!/usr/bin/env python3
"""LeetDeeper API server. JSON-only — frontend served by Vite in dev."""

from flask import Flask, jsonify, send_from_directory
from flask.helpers import send_file
from lib.playlists import list_playlists, load_playlist
from lib.progress import playlist_progress, get_watched_ids, overall_summary
from lib.media import enrich_videos
from lib.patterns import analyze_by_pattern

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


@app.route("/api/patterns")
def api_patterns():
    return jsonify(analyze_by_pattern())


if __name__ == "__main__":
    app.run(debug=True, port=5001)
