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
/// This function takes the puzzle input as a string slice and should return
/// the solution for Part 1.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 1 as a `u32`.
fn part1(input: &str) -> u32 {
    fn largest_two_digit_number(bank: &str) -> u32 {
        let chars: Vec<char> = bank.chars().collect();
        let mut max_joltage = 0u32;

        for i in 0..chars.len() {
            for j in (i + 1)..chars.len() {
                let joltage_str = format!("{}{}", chars[i], chars[j]);
                if let Ok(current_joltage) = joltage_str.parse::<u32>() {
                    if current_joltage > max_joltage {
                        max_joltage = current_joltage;
                    }
                }
            }
        }
        max_joltage
    }

    input
        .lines()
        .filter(|line| !line.is_empty())
        .map(|bank| largest_two_digit_number(bank))
        .sum()
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
/// The solution for Part 2 as a `u64`.
fn part2(input: &str) -> u64 {
    const NUM_DIGITS_TO_SELECT: usize = 12;

    fn largest_number_from_bank(bank: &str) -> u64 {
        let chars: Vec<char> = bank.chars().collect();

        if chars.len() < NUM_DIGITS_TO_SELECT {
            return 0;
        }

        let mut stack: Vec<char> = Vec::new();
        let mut digits_to_drop = chars.len() - NUM_DIGITS_TO_SELECT;

        for &ch in &chars {
            // Remove smaller digits from stack while we have drops remaining
            while digits_to_drop > 0 && !stack.is_empty() && stack[stack.len() - 1] < ch {
                stack.pop();
                digits_to_drop -= 1;
            }
            stack.push(ch);
        }

        // Trim excess digits from the end
        while stack.len() > NUM_DIGITS_TO_SELECT {
            stack.pop();
        }

        if stack.len() < NUM_DIGITS_TO_SELECT {
            return 0;
        }

        let result_str: String = stack.iter().collect();
        result_str.parse::<u64>().unwrap_or(0)
    }

    input
        .lines()
        .filter(|line| !line.is_empty())
        .map(|bank| largest_number_from_bank(bank))
        .sum()
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

    let result1 = part1(&input);
    let result2 = part2(&input);

    println!("Part 1: {}", result1);
    println!("Part 2: {}", result2);

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
