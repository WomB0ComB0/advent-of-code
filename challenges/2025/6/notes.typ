#set document(title: "Advent of Code 2025 - Day 6", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 6: Column Operations with Operators

== Problem Understanding
Process a grid of numbers where columns have operators (+/*) at the bottom. Apply operations to column values and sum results. Part 2 involves multi-digit vertical numbers.

== Part 1

=== Approach
Transpose input lines into columns, apply the operation specified by last character in each column, sum all column results.

=== Implementation Details
- Split lines by whitespace
- Transpose to get columns
- Last element in column is operator (+/*)
- Apply reduce with appropriate operation
- Sum all column results

=== Complexity Analysis
- *Time Complexity:* $O(n dot m)$ where $n$ is rows, $m$ is columns
- *Space Complexity:* $O(n dot m)$ for transposed data

== Part 2

=== Approach
Parse multi-digit numbers vertically from columns. Last row contains operators that group digits into numbers.

=== Implementation Details
- Identify operator positions in last row
- For each section between operators, parse vertical digits into numbers
- Apply operator to numbers in that section
- Sum all section results

=== Complexity Analysis
- *Time Complexity:* $O(n dot m)$ for parsing vertical digits
- *Space Complexity:* $O(m)$ for storing parsed numbers

== Key Learnings
- Matrix transposition for column-based processing
- Functional reduce operations with dynamic operators
- Multi-digit number parsing from 2D grids
- Handling operator precedence and grouping
