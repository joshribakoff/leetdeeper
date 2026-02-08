"""Media metadata: thumbnails, duration, and article linking."""

import json
import re
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
VIDEOS_DIR = REPO_ROOT / "videos" / "by-id"
ARTICLES_DIR = REPO_ROOT / "neetcode" / "articles"
THUMBS_DIR = REPO_ROOT / "static" / "thumbs"
CACHE_PATH = REPO_ROOT / "static" / "media_cache.json"
FFMPEG = Path.home() / ".local" / "bin" / "ffmpeg"


def _get_video_path(youtube_id: str) -> Path | None:
    """Find video file for a YouTube ID."""
    path = VIDEOS_DIR / f"{youtube_id}.mp4"
    return path if path.exists() else None


def _parse_duration(output: str) -> int | None:
    """Parse duration in seconds from ffmpeg output."""
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+)", output)
    if not m:
        return None
    h, mins, s = int(m.group(1)), int(m.group(2)), int(m.group(3))
    return h * 3600 + mins * 60 + s


def _load_cache() -> dict:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text())
    return {}


def _save_cache(cache: dict):
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(json.dumps(cache))


def get_duration(youtube_id: str) -> int | None:
    """Get video duration in seconds. Uses cache."""
    cache = _load_cache()
    if youtube_id in cache:
        return cache[youtube_id].get("duration")

    path = _get_video_path(youtube_id)
    if not path:
        return None

    try:
        result = subprocess.run(
            [str(FFMPEG), "-i", str(path), "-hide_banner"],
            capture_output=True, text=True, timeout=10
        )
        duration = _parse_duration(result.stderr)
        if duration is not None:
            cache[youtube_id] = cache.get(youtube_id, {})
            cache[youtube_id]["duration"] = duration
            _save_cache(cache)
        return duration
    except Exception:
        return None


def get_thumbnail_path(youtube_id: str) -> Path | None:
    """Get or generate thumbnail. Returns path relative to static/."""
    thumb = THUMBS_DIR / f"{youtube_id}.jpg"
    if thumb.exists():
        return Path("thumbs") / f"{youtube_id}.jpg"

    path = _get_video_path(youtube_id)
    if not path:
        return None

    THUMBS_DIR.mkdir(parents=True, exist_ok=True)
    try:
        subprocess.run(
            [str(FFMPEG), "-ss", "10", "-i", str(path),
             "-frames:v", "1", "-vf", "scale=160:-1",
             "-update", "1", "-y", str(thumb)],
            capture_output=True, timeout=15
        )
        if thumb.exists():
            return Path("thumbs") / f"{youtube_id}.jpg"
    except Exception:
        pass
    return None


def format_duration(seconds: int | None) -> str:
    """Format seconds as MM:SS or H:MM:SS."""
    if seconds is None:
        return ""
    if seconds >= 3600:
        return f"{seconds // 3600}:{(seconds % 3600) // 60:02d}:{seconds % 60:02d}"
    return f"{seconds // 60}:{seconds % 60:02d}"


ARTICLE_MAP_FILE = REPO_ROOT / "neetcode" / "article_map.json"


def _load_article_map() -> dict:
    if ARTICLE_MAP_FILE.exists():
        return json.loads(ARTICLE_MAP_FILE.read_text())
    return {}


def find_article(youtube_id: str) -> str | None:
    """Look up article slug for a youtube_id from the curated mapping."""
    return _load_article_map().get(youtube_id)


def enrich_videos(videos: list[dict]) -> list[dict]:
    """Add duration, thumbnail, and article info to video list."""
    cache = _load_cache()
    for v in videos:
        yt_id = v.get("youtube_id", "")
        v["has_video"] = _get_video_path(yt_id) is not None
        # Duration from cache only
        cached = cache.get(yt_id, {})
        v["duration"] = cached.get("duration")
        v["duration_fmt"] = format_duration(v["duration"])
        # Thumbnail only if already generated
        thumb = THUMBS_DIR / f"{yt_id}.jpg"
        v["thumbnail"] = str(Path("thumbs") / f"{yt_id}.jpg") if thumb.exists() else None
        # Article
        v["article"] = find_article(yt_id)
    return videos


def warm_cache(videos: list[dict]):
    """Pre-generate duration + thumbnails for videos. Run as background task."""
    for v in videos:
        yt_id = v.get("youtube_id", "")
        get_duration(yt_id)
        get_thumbnail_path(yt_id)
