//! This module provides a template for solving Advent of Code-like puzzles in Rust.
//! It includes utilities for reading input files, logging, and performance testing
//! with `big-o-test`.
//!
//! The structure is designed to be easily adaptable for different daily challenges,
//! separating concerns into input handling, part 1 and part 2 solutions, and a main
//! function orchestrating the execution and performance analysis.

use anyhow::{Context, Result};
use log::LevelFilter;
use simple_logger::SimpleLogger;
use std::env;
use std::fs;
use std::path::PathBuf;

/// Configuration for input file reading.
///
/// This struct currently serves as a namespace for input-related utility functions,
/// specifically for determining the path to the puzzle input file.
#[derive(Debug, Clone)]
struct InputConfig;

/// Implements input configuration extraction with more robust path handling.
impl InputConfig {
    fn input_path() -> Result<PathBuf> {
        // Use CARGO_MANIFEST_DIR to get the package directory (challenges/2025/1/rs)
        // Then go up one level to get to challenges/2025/1 and find input.txt
        let manifest_dir = env!("CARGO_MANIFEST_DIR");
        let input_path = PathBuf::from(manifest_dir)
            .parent()
            .context("Failed to get parent directory")?
            .join("input.txt");

        if input_path.exists() {
            println!("Found input file at: {}", input_path.display());
            return Ok(input_path);
        }

        Err(anyhow::anyhow!(
            "Could not find input file. Searched path: {:?}",
            input_path
        ))
    }
}

/// Reads the puzzle input from a file with enhanced error handling.
///
/// This function leverages `InputConfig::input_path` to locate the input file
/// and then reads its entire content into a `String`.
///
/// # Returns
/// - `Ok(String)`: The content of the `input.txt` file.
/// - `Err(anyhow::Error)`: If the input file cannot be found or read.
fn read_input() -> Result<String> {
    let input_path = InputConfig::input_path()?;

    fs::read_to_string(&input_path)
        .with_context(|| format!("Failed to read input from {:?}", input_path))
}

/// Solves part 1 of the puzzle.
///
/// Counts how many IDs fall within at least one range.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 1 as a `u32`.
fn part1(input: &str) -> u32 {
    use std::collections::{BTreeMap, HashSet};

    let lines: Vec<&str> = input.lines().collect();

    // Parse ranges and IDs
    let mut ranges: Vec<(i32, i32)> = Vec::new();
    let mut ids: HashSet<i32> = HashSet::new();

    for line in lines {
        let line = line.trim();
        if line.contains('-') && !line.is_empty() {
            // Find the last dash to handle negative numbers
            // For "1-5", we want to split into ["1", "5"]
            // For "-5-10", we want to split into ["-5", "10"]
            if let Some(dash_pos) = line.rfind('-') {
                // Skip if it's just a negative number at the start
                if dash_pos > 0 {
                    let start_str = &line[..dash_pos];
                    let end_str = &line[dash_pos + 1..];
                    if let (Ok(start), Ok(end)) = (start_str.parse::<i32>(), end_str.parse::<i32>())
                    {
                        ranges.push((start, end));
                        continue;
                    }
                }
            }
            // If parsing as range failed, try as a single ID
            if let Ok(id) = line.parse::<i32>() {
                ids.insert(id);
            }
        } else if !line.is_empty() {
            if let Ok(id) = line.parse::<i32>() {
                ids.insert(id);
            }
        }
    }

    // Build deltas map
    let mut deltas: BTreeMap<i32, i32> = BTreeMap::new();
    for (start, end) in ranges {
        *deltas.entry(start).or_insert(0) += 1;
        *deltas.entry(end + 1).or_insert(0) -= 1;
    }
    for &id in &ids {
        deltas.entry(id).or_insert(0);
    }

    // Sweep through sorted keys
    let mut fresh = 0;
    let mut cur = 0;

    for (&id, &delta) in &deltas {
        cur += delta;
        if ids.contains(&id) && cur > 0 {
            fresh += 1;
        }
    }

    fresh
}

/// Solves part 2 of the puzzle.
///
/// Counts the total length of all ranges.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 2 as a `u32`.
fn part2(input: &str) -> u32 {
    use std::collections::{BTreeMap, HashSet};

    let lines: Vec<&str> = input.lines().collect();

    // Parse ranges and IDs
    let mut ranges: Vec<(i32, i32)> = Vec::new();
    let mut ids: HashSet<i32> = HashSet::new();

    for line in lines {
        let line = line.trim();
        if line.contains('-') && !line.is_empty() {
            // Find the last dash to handle negative numbers
            // For "1-5", we want to split into ["1", "5"]
            // For "-5-10", we want to split into ["-5", "10"]
            if let Some(dash_pos) = line.rfind('-') {
                // Skip if it's just a negative number at the start
                if dash_pos > 0 {
                    let start_str = &line[..dash_pos];
                    let end_str = &line[dash_pos + 1..];
                    if let (Ok(start), Ok(end)) = (start_str.parse::<i32>(), end_str.parse::<i32>())
                    {
                        ranges.push((start, end));
                        continue;
                    }
                }
            }
            // If parsing as range failed, try as a single ID
            if let Ok(id) = line.parse::<i32>() {
                ids.insert(id);
            }
        } else if !line.is_empty() {
            if let Ok(id) = line.parse::<i32>() {
                ids.insert(id);
            }
        }
    }

    // Build deltas map
    let mut deltas: BTreeMap<i32, i32> = BTreeMap::new();
    for (start, end) in ranges {
        *deltas.entry(start).or_insert(0) += 1;
        *deltas.entry(end + 1).or_insert(0) -= 1;
    }
    for &id in &ids {
        deltas.entry(id).or_insert(0);
    }

    // Sweep through sorted keys
    let mut total = 0;
    let mut cur = 0;
    let mut start = 0;

    for (&id, &delta) in &deltas {
        let last = cur;
        cur += delta;

        if last == 0 && cur > 0 {
            start = id;
        } else if last > 0 && cur == 0 {
            total += (id - start) as u32;
        }
    }

    total
}

/// Main entry point for the program.
///
/// This function orchestrates the execution of the puzzle solution:
/// 1. Initializes logging.
/// 2. Reads the puzzle input.
/// 3. Runs performance tests for Part 1 and Part 2 using `big-o-test`.
/// 4. Prints the final solutions for Part 1 and Part 2.
///
/// # Returns
/// - `Ok(())`: If the program executes successfully.
/// - `Err(anyhow::Error)`: If any step (logging, input reading) fails.
fn main() -> Result<()> {
    // Initialize logging with better error handling
    SimpleLogger::new()
        .with_level(LevelFilter::Info)
        .init()
        .context("Logging initialization failed")?;

    // Read input with early validation
    let input = read_input()?;

    println!("Part 1: {}", part1(&input));
    println!("Part 2: {}", part2(&input));

    Ok(())
}

/// Integration tests module for verifying the correctness of the puzzle solutions.
#[cfg(test)]
mod tests {
    use super::*;

    /// Tests the `part1` function.
    ///
    /// This test reads the input file and asserts that the result of `part1`
    /// is greater than 0, indicating a non-trivial solution.
    ///
    /// # Panics
    /// If input reading fails or if the `part1` solution is not greater than 0.
    #[test]
    fn test_part1() {
        let input = read_input().expect("Input reading failed");
        let result = part1(&input);
        assert!(result > 0, "Part 1 solution must be non-negative");
    }

    /// Tests the `part2` function.
    ///
    /// This test reads the input file and asserts that the result of `part2`
    /// is greater than 0, indicating a non-trivial solution.
    ///
    /// # Panics
    /// If input reading fails or if the `part2` solution is not greater than 0.
    #[test]
    fn test_part2() {
        let input = read_input().expect("Input reading failed");
        let result = part2(&input);
        assert!(result > 0, "Part 2 solution must be non-negative");
    }
}
