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
/// Finds maximum rectangle area formed by any two coordinate pairs.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 1 as a `u64`.
fn part1(input: &str) -> u64 {
    let data: Vec<(i64, i64)> = input
        .lines()
        .map(|line| {
            let parts: Vec<&str> = line.split(',').collect();
            (parts[0].parse().unwrap(), parts[1].parse().unwrap())
        })
        .collect();

    fn get_area(p1: (i64, i64), p2: (i64, i64)) -> u64 {
        let (x1, y1) = p1;
        let (x2, y2) = p2;
        ((x1 - x2).abs() + 1) as u64 * ((y1 - y2).abs() + 1) as u64
    }

    let n = data.len();
    let mut max_area = 0;

    for i in 0..n {
        for j in (i + 1)..n {
            let area = get_area(data[i], data[j]);
            max_area = max_area.max(area);
        }
    }

    max_area
}

/// Solves part 2 of the puzzle.
///
/// Finds maximum rectangle area that doesn't intersect polygon edges.
///
/// # Arguments
/// * `input` - A string slice containing the puzzle input.
///
/// # Returns
/// The solution for Part 2 as a `u64`.
fn part2(input: &str) -> u64 {
    let data: Vec<(i64, i64)> = input
        .lines()
        .map(|line| {
            let parts: Vec<&str> = line.split(',').collect();
            (parts[0].parse().unwrap(), parts[1].parse().unwrap())
        })
        .collect();

    fn get_area(p1: (i64, i64), p2: (i64, i64)) -> u64 {
        let (x1, y1) = p1;
        let (x2, y2) = p2;
        ((x1 - x2).abs() + 1) as u64 * ((y1 - y2).abs() + 1) as u64
    }

    let n = data.len();
    let mut hori: Vec<(i64, i64, i64, i64)> = Vec::new();
    let mut vert: Vec<(i64, i64, i64, i64)> = Vec::new();

    for i in 0..n {
        let (x, y) = data[i];
        let (x2, y2) = data[(i + 1) % n];
        let x_min = x.min(x2);
        let x_max = x.max(x2);
        let y_min = y.min(y2);
        let y_max = y.max(y2);

        if x_min == x_max {
            vert.push((x_min, x_max, y_min, y_max));
        } else {
            hori.push((x_min, x_max, y_min, y_max));
        }
    }

    fn inside(
        x1: i64,
        y1: i64,
        x2: i64,
        y2: i64,
        hori: &[(i64, i64, i64, i64)],
        vert: &[(i64, i64, i64, i64)],
    ) -> bool {
        for &(a, b, y, _) in hori {
            if (a < x1 && x1 < b || a < x2 && x2 < b) && y1 < y && y < y2 {
                return false;
            }
            if (x1 == a || x2 == b) && y1 < y && y < y2 {
                return false;
            }
        }

        for &(x, _, c, d) in vert {
            if (c < y1 && y1 < d || c < y2 && y2 < d) && x1 < x && x < x2 {
                return false;
            }
            if (y1 == c || y2 == d) && x1 < x && x < x2 {
                return false;
            }
        }
        true
    }

    let mut ans = 0;
    for i in 0..n {
        for j in (i + 1)..n {
            let p1 = data[i];
            let p2 = data[j];
            let x1 = p1.0.min(p2.0);
            let x2 = p1.0.max(p2.0);
            let y1 = p1.1.min(p2.1);
            let y2 = p1.1.max(p2.1);

            if !inside(x1, y1, x2, y2, &hori, &vert) {
                continue;
            }

            ans = ans.max(get_area(p1, p2));
        }
    }

    ans
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
