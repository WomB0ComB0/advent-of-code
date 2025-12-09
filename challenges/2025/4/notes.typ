#set document(title: "Advent of Code 2025 - Day 4", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 4: Neighbor Counting with Iterative Removal

== Problem Understanding
Grid containing '@' symbols. Count cells with fewer than 4 '@' neighbors (Part 1). Iteratively remove cells with fewer than 4 neighbors until stable (Part 2).

== Part 1

=== Approach
For each '@' cell, count adjacent '@' neighbors (8-directional). Count how many cells have fewer than 4 neighbors.

=== Implementation Details
- Parse grid into 2D array
- For each '@' cell at (x, y):
  - Check all 8 adjacent positions
  - Count neighbors that are '@'
- Count cells with neighbor count < 4

=== Complexity Analysis
- *Time Complexity:* $O("rows" times "cols")$
- *Space Complexity:* $O("rows" times "cols")$ for grid storage

== Part 2

=== Approach
Iteratively remove all cells with fewer than 4 '@' neighbors until no more cells can be removed. Count remaining cells.

=== Implementation Details
- Helper function `nbh_rolls(grid, x, y)` to find adjacent '@' positions
- While changes occur:
  - Find all '@' cells with < 4 neighbors
  - Remove all such cells simultaneously
  - Repeat until stable (no cells removed in iteration)
- Count remaining '@' cells

=== Complexity Analysis
- *Time Complexity:* $O(k times "rows" times "cols")$ where $k$ is number of iterations
- *Space Complexity:* $O("rows" times "cols")$
- Worst case: $O(n^2)$ where $n$ is grid size

== Key Learnings
- Cellular automaton-style grid evolution
- Iterative removal with stability detection
- 8-directional neighbor counting
- Grid manipulation with simultaneous updates
- Convergence detection in iterative algorithms
