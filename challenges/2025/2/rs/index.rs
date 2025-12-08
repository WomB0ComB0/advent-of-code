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
use std::collections::HashSet;
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
/// This function takes the puzzle input as a string slice and should return
/// the solution for Part 1.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 1 as a `u32`.
///
/// # TODO
/// Implement the actual logic for Part 1 of the puzzle.
fn part1(input: &str) -> u64 {
    fn is_invalid_id(id: u64) -> bool {
        let s = id.to_string();
        let n = s.len();
        if n % 2 != 0 {
            return false;
        }

        let half_length = n / 2;
        return &s[..half_length] == &s[half_length..];
    }
    let mut invalid_ids: HashSet<u64> = HashSet::new();
    for line in input.lines() {
        for c in line.split(',') {
            let parts: Vec<u64> = c.split('-').map(|s| s.parse::<u64>().unwrap()).collect();
            let [start, end]: [u64; 2] = parts.try_into().unwrap();
            for i in start..=end {
                if is_invalid_id(i) {
                    invalid_ids.insert(i);
                }
            }
        }
    }
    return invalid_ids.iter().sum();
}

/// Solves part 2 of the puzzle.
///
/// This function takes the puzzle input as a string slice and should return
/// the solution for Part 2.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 2 as a `u32`.
///
/// # TODO
/// Implement the actual logic for Part 2 of the puzzle.
fn part2(input: &str) -> u64 {
    fn is_invalid_id(id: u64) -> bool {
        let s = id.to_string();
        let n = s.len();

        // An ID is invalid if it is made only of some sequence of digits repeated at least twice.
        // E.g., 12341234 (1234 two times), 123123123 (123 three times), 1212121212 (12 five times),
        // and 1111111 (1 seven times) are all invalid IDs.
        for len in 1..=n / 2 {
            if n % len == 0 {
                let pattern = &s[..len];
                let repeated = pattern.repeat(n / len);
                if repeated == s {
                    return true;
                }
            }
        }
        false
    }

    let mut invalid_ids: HashSet<u64> = HashSet::new();
    for line in input.lines() {
        for c in line.split(',') {
            let parts: Vec<u64> = c.split('-').map(|s| s.parse::<u64>().unwrap()).collect();
            let [start, end]: [u64; 2] = parts.try_into().unwrap();
            for i in start..=end {
                if is_invalid_id(i) {
                    invalid_ids.insert(i);
                }
            }
        }
    }
    return invalid_ids.iter().sum();
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
