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

/// Helper function to get neighboring positions containing '@'.
///
/// # Arguments
/// * `y` - The y-coordinate of the current cell.
/// * `x` - The x-coordinate of the current cell.
/// * `grid` - A reference to the 2D grid of characters.
///
/// # Returns
/// A vector of (y, x) tuples for neighbors containing '@'.
fn nbh_rolls(y: usize, x: usize, grid: &Vec<Vec<char>>) -> Vec<(usize, usize)> {
    let mut rolls = Vec::new();
    let rows = grid.len();
    let cols = grid[0].len();

    for dy in -1..=1 {
        for dx in -1..=1 {
            if dy == 0 && dx == 0 {
                continue;
            }

            let y2 = y as i32 + dy;
            let x2 = x as i32 + dx;

            if y2 >= 0 && y2 < rows as i32 && x2 >= 0 && x2 < cols as i32 {
                let y2 = y2 as usize;
                let x2 = x2 as usize;
                if grid[y2][x2] == '@' {
                    rolls.push((y2, x2));
                }
            }
        }
    }

    rolls
}

/// Solves part 1 of the puzzle.
///
/// Counts cells with '@' that have fewer than 4 neighbors containing '@'.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 1 as a `u32`.
fn part1(input: &str) -> u32 {
    let grid: Vec<Vec<char>> = input.lines().map(|line| line.chars().collect()).collect();

    let mut total = 0;

    for y in 0..grid.len() {
        for x in 0..grid[0].len() {
            if grid[y][x] == '@' {
                if nbh_rolls(y, x, &grid).len() < 4 {
                    total += 1;
                }
            }
        }
    }

    total
}

/// Solves part 2 of the puzzle.
///
/// Iteratively removes cells with '@' that have fewer than 4 neighbors.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 2 as a `u32`.
fn part2(input: &str) -> u32 {
    let mut grid: Vec<Vec<char>> = input.lines().map(|line| line.chars().collect()).collect();

    let mut total = 0;
    let mut todo: Vec<(usize, usize)> = Vec::new();

    // Find all initial '@' positions
    for y in 0..grid.len() {
        for x in 0..grid[0].len() {
            if grid[y][x] == '@' {
                todo.push((y, x));
            }
        }
    }

    // Process cells iteratively
    while let Some((y, x)) = todo.pop() {
        if grid[y][x] == '.' {
            continue;
        }

        let nbh = nbh_rolls(y, x, &grid);
        if nbh.len() < 4 {
            grid[y][x] = '.';
            todo.extend(nbh);
            total += 1;
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
