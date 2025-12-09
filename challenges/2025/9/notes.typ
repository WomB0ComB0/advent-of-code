#set document(title: "Advent of Code 2025 - Day 9", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 9: Rectangle Areas with Polygon Intersection

== Problem Understanding
Given 2D coordinate points, find maximum rectangle areas. Part 1: Maximum area among all point pairs. Part 2: Maximum area that doesn't intersect polygon edges formed by consecutive points.

== Part 1

=== Approach
Calculate area for every pair of points, return maximum.

=== Implementation Details
- Area formula: $(|x_1 - x_2| + 1) times (|y_1 - y_2| + 1)$
- Generate all $binom(n, 2)$ point pairs
- Calculate area for each pair
- Return maximum area

=== Complexity Analysis
- *Time Complexity:* $O(n^2)$ for checking all pairs
- *Space Complexity:* $O(n)$ for storing coordinates

== Part 2

=== Approach
Find maximum rectangle area that doesn't intersect with the polygon edges formed by connecting consecutive input points.

=== Implementation Details

*Polygon Edge Extraction:*
- Connect consecutive points: point[i] to point[(i+1) % n]
- Classify edges as horizontal (same x) or vertical (same y)
- Store as tuples: (x_min, x_max, y_min, y_max)

*Intersection Checking:*
- For rectangle $(x_1, y_1, x_2, y_2)$:
- Check horizontal edges: if edge y is strictly between $y_1$ and $y_2$, and edge x overlaps with rectangle x-range
- Check vertical edges: if edge x is strictly between $x_1$ and $x_2$, and edge y overlaps with rectangle y-range
- Also check boundary cases where rectangle touches edge endpoints

*Solution:*
- For each point pair, form rectangle
- Check if rectangle interior doesn't intersect polygon edges
- Track maximum valid area

=== Complexity Analysis
- *Time Complexity:* $O(n^2 dot m)$ where $m$ is number of edges (typically $O(n)$)
- *Space Complexity:* $O(n)$ for edges and coordinates

== Key Learnings
- Rectangle-line segment intersection testing
- Polygon edge extraction from points
- Handling edge cases: boundary intersections vs interior
- Combinatorial geometry optimization
- Careful handling of strict vs non-strict inequalities
