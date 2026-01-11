#!/usr/bin/env python3
"""
LeetCode Progress Tracker

Shows progress across multiple problem lists (Blind 75, NeetCode 150, etc.)
Reads completed problems from completed.json and problem metadata from lcpy's JSON files.
"""

import json
import re
import sys
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
COMPLETED_FILE = SCRIPT_DIR / "completed.json"
TAGS_FILE = SCRIPT_DIR / "leetcode-py/leetcode_py/cli/resources/leetcode/json/tags.json5"
PROBLEMS_DIR = SCRIPT_DIR / "leetcode-py/leetcode_py/cli/resources/leetcode/json/problems"
NEETCODE_DATA = SCRIPT_DIR / "neetcode/.problemSiteData.json"

# Problem lists to track (display name -> tag name)
LISTS = {
    "Blind 75": "blind-75",
    "NeetCode 150": "neetcode-150",
    "Grind 75": "grind-75",
    "AlgoMaster 75": "algo-master-75",
}


def parse_json5_tags(content: str) -> dict[str, list[str]]:
    """Parse JSON5 tags file to extract problem lists."""
    tags = {}
    current_tag = None
    current_list = []

    for line in content.split("\n"):
        line = line.strip()

        # Skip comments and empty lines
        if line.startswith("//") or not line:
            continue

        # Match tag start: "tag-name": [ or tag: [
        tag_match = re.match(r'"?([a-z0-9-]+)"?\s*:\s*\[', line)
        if tag_match:
            # Save previous tag if exists
            if current_tag and current_list:
                tags[current_tag] = current_list
            current_tag = tag_match.group(1)
            current_list = []
            continue

        # Match closing bracket
        if line.startswith("]"):
            if current_tag and current_list:
                tags[current_tag] = current_list
            current_tag = None
            current_list = []
            continue

        # Match problem slug: "slug_name",
        slug_match = re.match(r'"([a-z_]+)"', line)
        if slug_match and current_tag:
            current_list.append(slug_match.group(1))
            continue

        # Match tag reference: { tag: "grind-75" },
        ref_match = re.match(r'\{\s*tag:\s*"([^"]+)"', line)
        if ref_match and current_tag:
            ref_tag = ref_match.group(1)
            if ref_tag in tags:
                current_list.extend(tags[ref_tag])

    return tags


def load_problem_metadata() -> dict[str, dict]:
    """Load problem metadata from individual JSON files."""
    problems = {}

    if not PROBLEMS_DIR.exists():
        print(f"Warning: Problems directory not found: {PROBLEMS_DIR}")
        return problems

    for json_file in PROBLEMS_DIR.glob("*.json"):
        try:
            with open(json_file) as f:
                data = json.load(f)
                slug = data.get("problem_name")
                if slug:
                    problems[slug] = {
                        "number": int(data.get("problem_number", 0)),
                        "title": data.get("problem_title", slug),
                        "difficulty": data.get("difficulty", "Unknown"),
                    }
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Warning: Could not parse {json_file}: {e}")

    return problems


def load_completed() -> set[str]:
    """Load completed problem slugs from completed.json."""
    if not COMPLETED_FILE.exists():
        return set()

    try:
        with open(COMPLETED_FILE) as f:
            data = json.load(f)
            return {p["slug"] for p in data.get("completed", [])}
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Warning: Could not parse {COMPLETED_FILE}: {e}")
        return set()


def load_completed_numbers() -> set[int]:
    """Load completed problem numbers from completed.json."""
    if not COMPLETED_FILE.exists():
        return set()

    try:
        with open(COMPLETED_FILE) as f:
            data = json.load(f)
            return {p["number"] for p in data.get("completed", [])}
    except (json.JSONDecodeError, KeyError) as e:
        return set()


def load_neetcode_patterns() -> dict[str, list[dict]]:
    """Load NeetCode problems grouped by pattern."""
    if not NEETCODE_DATA.exists():
        return {}

    try:
        with open(NEETCODE_DATA) as f:
            problems = json.load(f)

        patterns: dict[str, list[dict]] = {}
        for p in problems:
            pattern = p.get("pattern", "Unknown")
            code = p.get("code", "")
            # Extract number from code like "0217-contains-duplicate"
            num_match = re.match(r"(\d+)-", code)
            num = int(num_match.group(1)) if num_match else 0

            if pattern not in patterns:
                patterns[pattern] = []
            patterns[pattern].append({
                "number": num,
                "name": p.get("problem", ""),
                "difficulty": p.get("difficulty", ""),
            })

        return patterns
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Warning: Could not parse {NEETCODE_DATA}: {e}")
        return {}


def progress_bar(done: int, total: int, width: int = 20) -> str:
    """Generate a text progress bar."""
    if total == 0:
        return "░" * width
    filled = int(width * done / total)
    return "█" * filled + "░" * (width - filled)


def show_progress(generate_markdown: bool = False):
    """Display progress across all problem lists."""
    # Load data
    completed = load_completed()
    problems = load_problem_metadata()

    # Load tags
    if TAGS_FILE.exists():
        with open(TAGS_FILE) as f:
            tags = parse_json5_tags(f.read())
    else:
        print(f"Warning: Tags file not found: {TAGS_FILE}")
        tags = {}

    if generate_markdown:
        output = ["# LeetCode Progress\n"]
    else:
        print("\n=== LeetCode Progress ===\n")

    # Show progress per list
    for display_name, tag_name in LISTS.items():
        slugs = tags.get(tag_name, [])
        total = len(slugs)
        done = len(completed & set(slugs))
        pct = (done / total * 100) if total > 0 else 0
        bar = progress_bar(done, total)

        if generate_markdown:
            output.append(f"## {display_name}: {done}/{total} ({pct:.0f}%)\n")
            output.append(f"`{bar}`\n\n")
        else:
            print(f"{display_name:14} {done:3}/{total:<3} ({pct:4.0f}%) {bar}")

    if generate_markdown:
        # Add detailed checklist per list
        for display_name, tag_name in LISTS.items():
            slugs = tags.get(tag_name, [])
            output.append(f"\n### {display_name} Problems\n")

            for slug in sorted(slugs):
                info = problems.get(slug, {"number": "?", "title": slug, "difficulty": "?"})
                check = "x" if slug in completed else " "
                output.append(f"- [{check}] {info['number']}. {info['title']} ({info['difficulty']})\n")

        # Write to file
        progress_file = SCRIPT_DIR / "PROGRESS.md"
        with open(progress_file, "w") as f:
            f.writelines(output)
        print(f"Generated {progress_file}")
    else:
        # Show recent completions
        if completed:
            print(f"\nCompleted: {len(completed)} problems")


def show_patterns():
    """Display progress by NeetCode pattern."""
    completed_nums = load_completed_numbers()
    patterns = load_neetcode_patterns()

    if not patterns:
        print("No NeetCode pattern data found.")
        return

    print("\n=== Progress by Pattern ===\n")

    # Define pattern order (matches NeetCode roadmap progression)
    pattern_order = [
        "Arrays & Hashing",
        "Two Pointers",
        "Stack",
        "Binary Search",
        "Sliding Window",
        "Linked List",
        "Trees",
        "Tries",
        "Heap / Priority Queue",
        "Backtracking",
        "Graphs",
        "Advanced Graphs",
        "1-D Dynamic Programming",
        "2-D Dynamic Programming",
        "Greedy",
        "Intervals",
        "Math & Geometry",
        "Bit Manipulation",
    ]

    for pattern in pattern_order:
        if pattern not in patterns:
            continue
        probs = patterns[pattern]
        nums = {p["number"] for p in probs}
        done = len(completed_nums & nums)
        total = len(probs)
        pct = (done / total * 100) if total > 0 else 0
        bar = progress_bar(done, total, width=15)
        print(f"{pattern:28} {done:2}/{total:<2} ({pct:3.0f}%) {bar}")


def main():
    generate_markdown = "--markdown" in sys.argv or "-m" in sys.argv
    show_by_pattern = "--patterns" in sys.argv or "-p" in sys.argv

    if show_by_pattern:
        show_patterns()
    else:
        show_progress(generate_markdown)


if __name__ == "__main__":
    main()
