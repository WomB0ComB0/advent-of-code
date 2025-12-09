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
/// Transposes lines into columns and applies operations based on the last character.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 1 as a `u64`.
fn part1(input: &str) -> u64 {
    let lines: Vec<&str> = input.lines().collect();

    // Split each line into tokens
    let split_lines: Vec<Vec<&str>> = lines
        .iter()
        .map(|line| line.split_whitespace().collect())
        .collect();

    // Find max columns
    let max_cols = split_lines.iter().map(|row| row.len()).max().unwrap_or(0);

    // Transpose to get columns
    let mut total: u64 = 0;

    for col in 0..max_cols {
        let mut column: Vec<&str> = Vec::new();
        for row in &split_lines {
            if col < row.len() {
                column.push(row[col]);
            }
        }

        if column.is_empty() {
            continue;
        }

        // Last element determines operation
        let last = column[column.len() - 1];
        let is_multiply = last == "*";

        // Convert numbers (all except last)
        let numbers: Vec<u64> = column[..column.len() - 1]
            .iter()
            .filter_map(|s| s.parse::<u64>().ok())
            .collect();

        if !numbers.is_empty() {
            let result: u64 = if is_multiply {
                numbers.iter().cloned().product()
            } else {
                numbers.iter().cloned().sum()
            };
            total += result;
        }
    }

    total
}

/// Solves part 2 of the puzzle.
///
/// Parses multi-digit numbers from columns and applies operations.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 2 as a `u64`.
fn part2(input: &str) -> u64 {
    let lines: Vec<String> = input.lines().map(|s| s.to_string()).collect();

    let process = |left: usize, right: usize| -> u64 {
        let last_line = &lines[lines.len() - 1];
        let is_multiply = left < last_line.len() && last_line.chars().nth(left) == Some('*');

        let mut nums: Vec<u64> = Vec::new();

        for x in left..=right {
            let mut num: u64 = 0;
            for y in 0..lines.len() - 1 {
                if x < lines[y].len() {
                    let ch = lines[y].chars().nth(x).unwrap_or(' ');
                    if ch != ' ' {
                        if let Some(digit) = ch.to_digit(10) {
                            num = num * 10 + digit as u64;
                        }
                    }
                }
            }
            nums.push(num);
        }

        if nums.is_empty() {
            return 0;
        }

        if is_multiply {
            nums.iter().product()
        } else {
            nums.iter().sum()
        }
    };

    let n = lines.iter().map(|line| line.len()).max().unwrap_or(0);
    let mut total: u64 = 0;
    let mut left: usize = 0;

    for right in 1..n {
        let last_line = &lines[lines.len() - 1];
        if right < last_line.len() && last_line.chars().nth(right) != Some(' ') {
            if right >= 2 {
                total += process(left, right - 2);
            }
            left = right;
        }
    }

    total + process(left, n - 1)
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
