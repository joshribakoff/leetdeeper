# Problem Scaffolding Skill

Generate and work with LeetCode practice problems.

## lcpy - Python Scaffolding (Legacy)

```bash
lcpy list                  # List all available problems
lcpy list -t blind-75      # Filter by tag
lcpy list -d Easy          # Filter by difficulty
lcpy gen -n 704            # Generate scaffold by number
lcpy gen -s two_sum        # Generate scaffold by slug
lcpy gen -t blind-75       # Generate all problems in a list
```

Generated files per problem:
- `solution.py` - Class with method stubs
- `test_solution.py` - pytest test cases
- `helpers.py` - Test helper functions
- `README.md` - Problem description
- `playground.ipynb` - Jupyter notebook

## TypeScript Practice (Current)

75 Blind 75 problems scaffolded in `practice/` with Vitest.

Each problem directory contains:
- `solution.ts` - Function stub with JSDoc docblock
- `solution.test.ts` - Vitest test cases

### Running Tests

```bash
# From practice root
cd practice && npx vitest run <problem-folder>

# From inside a problem directory
npx vitest run .
```

**NEVER run all test suites at once.** Vitest spawns worker threads per file. 75 files = machine freeze.

### Marking Complete

Add entry to `completed.json`:
```json
{"number": 206, "slug": "reverse_linked_list", "title": "Reverse Linked List", "difficulty": "Easy", "date": "2026-02-05"}
```

## Problem Lists
- **Blind 75** - Classic interview prep list
- **NeetCode 150** - Extended NeetCode roadmap
- **Grind 75** - Tech interview grind list
- **AlgoMaster 75** - Algorithm mastery list
