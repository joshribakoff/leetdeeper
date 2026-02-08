#!/usr/bin/env python3
"""
Generate curated problem lists from NeetCode data.

Creates:
  lists/blind_75.jsonl      - The Blind 75 (from NeetCode's tagging)
  lists/neetcode_150.jsonl  - NeetCode 150
  lists/leetdeeper_75.jsonl - Our canonical 75 (initially same as Blind 75)
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
NEETCODE_DATA = ROOT / "neetcode" / ".problemSiteData.json"
LISTS_DIR = ROOT / "lists"


def extract_problem_id(code: str) -> int:
    """Extract LeetCode problem ID from code like '0217-contains-duplicate'."""
    match = re.match(r"^(\d+)-", code)
    return int(match.group(1)) if match else 0


def generate_lists():
    LISTS_DIR.mkdir(exist_ok=True)

    with open(NEETCODE_DATA) as f:
        data = json.load(f)

    blind75 = []
    neetcode150 = []

    for p in data:
        entry = {
            "problem_id": extract_problem_id(p["code"]),
            "title": p["problem"],
            "difficulty": p["difficulty"],
            "pattern": p["pattern"],
        }

        if p.get("blind75"):
            blind75.append(entry)
        if p.get("neetcode150"):
            neetcode150.append(entry)

    # Sort by problem_id
    blind75.sort(key=lambda x: x["problem_id"])
    neetcode150.sort(key=lambda x: x["problem_id"])

    # Write Blind 75
    with open(LISTS_DIR / "blind_75.jsonl", "w") as f:
        for entry in blind75:
            f.write(json.dumps(entry) + "\n")
    print(f"Generated lists/blind_75.jsonl ({len(blind75)} problems)")

    # Write NeetCode 150
    with open(LISTS_DIR / "neetcode_150.jsonl", "w") as f:
        for entry in neetcode150:
            f.write(json.dumps(entry) + "\n")
    print(f"Generated lists/neetcode_150.jsonl ({len(neetcode150)} problems)")

    # Write LeetDeeper 75 (our canonical list, starts as copy of Blind 75)
    with open(LISTS_DIR / "leetdeeper_75.jsonl", "w") as f:
        for entry in blind75:
            f.write(json.dumps(entry) + "\n")
    print(f"Generated lists/leetdeeper_75.jsonl ({len(blind75)} problems)")


if __name__ == "__main__":
    generate_lists()
