#set document(title: "Advent of Code 2025 - Day 8", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 8: DSU with 3D Euclidean Distance

== Problem Understanding
Given 3D coordinates, connect points using Union-Find based on Euclidean distances. Part 1: Connect k shortest edges, find product of 3 largest components. Part 2: Find when graph becomes fully connected.

== Part 1

=== Approach
Build all edges with 3D Euclidean distances, sort by distance, connect k shortest edges using DSU, find 3 largest component sizes.

=== Implementation Details
- Parse coordinates as $(x, y, z)$ tuples
- Calculate 3D Euclidean distance: $sqrt(d x^2 + d y^2 + d z^2)$
- Generate all $binom(n, 2)$ edges
- Sort edges by distance
- Unite k=1000 shortest edges using DSU
- Extract component sizes, find 3 largest
- Return product of 3 largest sizes

=== DSU Implementation
- Path compression in `find()` operation
- Union by size for efficiency
- Track component sizes

=== Complexity Analysis
- *Time Complexity:* $O(n^2 log n)$ for generating and sorting edges
- *Space Complexity:* $O(n^2)$ for storing all edges
- *DSU operations:* Nearly $O(1)$ amortized with path compression

== Part 2

=== Approach
Connect all edges in sorted order until graph becomes fully connected, return product of x-coordinates of final edge.

=== Implementation Details
- Same edge generation and sorting as Part 1
- Unite edges one by one
- Check after each union if fully connected
- Fully connected when: `size[find(0)] == total nodes`
- Return $x_u times x_v$ for final connecting edge

=== Complexity Analysis
- *Time Complexity:* $O(n^2 log n + n^2 alpha(n))$ where $alpha$ is inverse Ackermann
- *Space Complexity:* $O(n^2)$ for edges

== Key Learnings
- #text(fill: red, weight: "bold")[Critical Bug Found:] Initially used 2D distance instead of 3D!
- Coordinates are 3D $(x,y,z)$ not 2D $(x,y)$
- Python's `math.dist()` handles any dimension automatically
- TypeScript/Rust required explicit 3D distance calculation
- DSU/Union-Find for connectivity problems
- Kruskal's MST algorithm pattern
- Path compression optimization
