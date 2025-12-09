#set document(title: "Advent of Code 2025 - Day 7", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 7: DAG Path Counting

== Problem Understanding
Grid traversal where position 'S' starts active. '^' symbols create branching paths (left and right). Count encounters with '^' (Part 1) and total paths from start to end (Part 2).

== Part 1

=== Approach
Track active positions row by row. When encountering '^' at active position, count it and activate adjacent positions.

=== Implementation Details
- Boolean array tracking active positions
- Start with position of 'S' as active
- For each '^' at active position:
  - Increment counter
  - Mark position as inactive
  - Activate left (x-1) and right (x+1) positions

=== Complexity Analysis
- *Time Complexity:* $O("rows" times "cols")$
- *Space Complexity:* $O("cols")$ for active array

== Part 2

=== Approach
Build Directed Acyclic Graph (DAG) of all paths, then use memoized dynamic programming to count total paths from start to end.

=== Implementation Details
- Create graph where each state transition is a node
- Node 1 = start position
- Each '^' creates new node connecting from active predecessors
- Node 0 = terminal (end of grid)
- DP function: dp(node) = sum of dp(all successors)
- Base case: dp(0) = 1
- Use memoization to cache results

=== Complexity Analysis
- *Time Complexity:* $O(V + E)$ where $V$ is nodes, $E$ is edges in DAG
- *Space Complexity:* $O(V)$ for graph and memoization

== Key Learnings
- Grid-based state machine with branching
- DAG construction from grid traversal
- Memoized DP for path counting in DAGs
- Managing active state sets efficiently
