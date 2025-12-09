#set document(title: "Advent of Code 2025 - Day 3", author: "Solution Notes")
#set page(numbering: "1")

= Advent of Code 2025 - Day 3: Regular Expression Pattern Matching

== Problem Understanding
Parse corrupted memory containing mul(X,Y) instructions along with garbage text. Execute valid multiplication instructions and sum results. Part 2 adds do()/don't() control flow.

== Part 1

=== Approach
Use regular expressions to find valid mul(X,Y) patterns, extract numbers, multiply them, sum all products.

=== Implementation Details
- Regex pattern: `mul\((\d+),(\d+)\)`
- Find all matches in input
- Extract two numeric groups from each match
- Multiply the two numbers
- Sum all products

=== Complexity Analysis
- *Time Complexity:* $O(n)$ where $n$ is input length
- *Space Complexity:* $O(m)$ where $m$ is number of matches

== Part 2

=== Approach
Add conditional execution with do() and don't() instructions that enable/disable mul() instructions.

=== Implementation Details
- Extended regex: `mul\((\d+),(\d+)\)|do\(\)|don't\(\)`
- Track enabled state (starts enabled)
- Process matches in order:
  - do() → set enabled = true
  - don't() → set enabled = false
  - mul(X,Y) → if enabled, add X×Y to sum
- Return total sum

=== Complexity Analysis
- *Time Complexity:* $O(n)$ for regex matching and processing
- *Space Complexity:* $O(m)$ for storing matches

== Key Learnings
- Regex pattern matching for instruction parsing
- Alternation in regex (multiple pattern options)
- State machine with conditional execution
- Processing instructions in sequential order
- Handling corrupted/noisy data with robust parsing
