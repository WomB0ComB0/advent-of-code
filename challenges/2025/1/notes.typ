#set document(title: "Advent of Code 2025 - Day 1", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 1: String Processing and Digit Extraction

== Problem Understanding
Extract digits from text lines and form two-digit calibration values. Part 1 uses only numeric digits, Part 2 includes spelled-out digit names.

== Part 1

=== Approach
From each line, extract first and last numeric digit, combine into two-digit number, sum across all lines.

=== Implementation Details
- Parse each line character by character
- Find first digit (left to right scan)
- Find last digit (right to left scan, or save while scanning)
- Form number: first_digit × 10 + last_digit
- Sum all line values

=== Complexity Analysis
- *Time Complexity:* $O(n dot m)$ where $n$ = lines, $m$ = avg line length
- *Space Complexity:* $O(1)$ for processing

== Part 2

=== Approach
Recognize both numeric digits (0-9) and word-form digits ("one", "two", ..., "nine"). Handle overlapping patterns.

=== Implementation Details
- Pattern set: {"1", "2", ..., "9", "one", "two", ..., "nine"}
- For each position in string, check if any pattern matches
- Find leftmost and rightmost digit (numeric or word)
- Handle overlapping cases (e.g., "twone" → both "two" and "one")
- Map word digits to numeric values
- Form two-digit number and sum

=== Complexity Analysis
- *Time Complexity:* $O(n dot m dot p)$ where $p$ = pattern count (18)
- *Space Complexity:* $O(1)$ for processing

== Key Learnings
- String pattern matching with overlaps
- Mixed numeric and word-form digit recognition
- Edge case: single digit on line → use same digit twice
- Efficient left-to-right and right-to-left scanning
