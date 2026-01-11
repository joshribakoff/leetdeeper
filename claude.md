# LeetCode Interview Prep

## Context
Preparing for Uber staff engineer interview. Learning Python while solving LeetCode problems.

## Key Rules for Claude
- **DO NOT show solutions** - let the user figure things out
- Help with Python syntax when asked
- Point out bugs but let user fix them
- Run tests when asked
- Only make edits when explicitly requested

## Tooling

### lcpy - Problem Scaffolding
```bash
# List all available problems
lcpy list

# Filter by tag or difficulty
lcpy list -t blind-75
lcpy list -d Easy

# Generate a problem scaffold
lcpy gen -n 704        # by problem number
lcpy gen -s two_sum    # by slug

# Generate all problems in a list
lcpy gen -t blind-75
```

Generated files per problem:
- `solution.py` - Class with method stubs
- `test_solution.py` - pytest test cases
- `helpers.py` - Test helper functions
- `README.md` - Problem description
- `playground.ipynb` - Jupyter notebook

### Running Tests
```bash
# Run tests for a specific problem
pytest practice/two_sum/test_solution.py -v

# Quick single test
python -c "from solution import Solution; s = Solution(); print(s.two_sum([2,7,11,15], 9))"
```

### Progress Tracking
```bash
# Show progress across all lists
python show_progress.py

# Show progress by NeetCode pattern (roadmap order)
python show_progress.py -p

# Generate markdown report
python show_progress.py --markdown
```

Progress is tracked in `completed.json` - add entries when problems are solved.

## Workflow
1. Pick a problem: `lcpy list -t blind-75`
2. Generate scaffold: `lcpy gen -n <num>`
3. Work through solution in `practice/<problem>/solution.py`
4. Run tests: `pytest practice/<problem>/test_solution.py -v`
5. Mark complete: add entry to `completed.json`
6. Check progress: `python show_progress.py`

## Problem Lists
- **Blind 75** - Classic interview prep list
- **NeetCode 150** - Extended NeetCode roadmap
- **Grind 75** - Tech interview grind list
- **AlgoMaster 75** - Algorithm mastery list

## NeetCode Resources
- `neetcode/hints/` - Progressive hints without spoilers
- `neetcode/articles/` - Full explanations with intuition sections
