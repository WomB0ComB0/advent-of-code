#set document(title: "Advent of Code 2025 - Day 5", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 5: Delta/Sweep Line Algorithm

== Problem Understanding
Parse input containing ranges and IDs. Count how many distinct IDs cover each point in the range, and determine total length of covered ranges.

== Part 1

=== Approach
Use delta (sweep line) algorithm to track when IDs start and end coverage. Process events sorted by position to count distinct IDs at each point.

=== Implementation Details
- Parse ranges in format: start-end:ID1,ID2,...
- Create delta events: +1 at range start, -1 after range end
- Sort events by position
- Track active ID count at each position
- Calculate weighted sum: position × count of active IDs

=== Complexity Analysis
- *Time Complexity:* $O(n log n)$ for sorting events
- *Space Complexity:* $O(n)$ for storing events

== Part 2

=== Approach
Calculate total length of all covered ranges (union of all ranges).

=== Implementation Details
- Track when coverage starts (count goes from 0 to >0)
- Track when coverage ends (count goes to 0)
- Sum all intervals where count > 0

===Complexity Analysis
- *Time Complexity:* $O(n log n)$ for sorting
- *Space Complexity:* $O(n)$ for delta map

== Key Learnings
- Delta/sweep line algorithm for efficient range processing
- Handling negative numbers in range parsing (use rfind for delimiter)
- BTreeMap in Rust for ordered iteration
