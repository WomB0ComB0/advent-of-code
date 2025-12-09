#set document(title: "Advent of Code 2025 - Day 2", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 2: Array Manipulation and Pattern Finding

== Problem Understanding
Process sequences of numbers to identify valid patterns. Part 1 checks for monotonic sequences with bounded differences. Part 2 allows removal of one element to achieve valid pattern.

== Part 1

=== Approach
Check if sequence is strictly increasing or strictly decreasing, with consecutive differences in range [1, 3].

=== Implementation Details
- For each line, parse numbers into array
- Check two conditions:
  - All differences positive (increasing)
  - All differences negative (decreasing)
- For valid direction, ensure $|"diff"| in [1, 3]$
- Count lines meeting criteria

=== Complexity Analysis
- *Time Complexity:* $O(n dot m)$ where $n$ = lines, $m$ = numbers per line
- *Space Complexity:* $O(m)$ for storing one line's numbers

== Part 2

=== Approach
Allow removal of single element to make sequence valid ("Problem Dampener").

=== Implementation Details
- Try original sequence (same as Part 1)
- If invalid, try removing each element one at a time:
  - Create subsequence with element i removed
  - Check if subsequence is valid
  - If any removal creates valid sequence, count line as valid
- Optimization: can be done more efficiently with careful analysis

=== Complexity Analysis
- *Time Complexity:* $O(n dot m^2)$ - try removing each of $m$ elements
- *Space Complexity:* $O(m)$

== Key Learnings
- Monotonic sequence validation
- Bounded difference checking
- Brute-force element removal strategy
- Edge cases: sequences of length 1 or 2
- "Dampener" pattern: allow single violation
