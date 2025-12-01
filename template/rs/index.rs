use anyhow::{Context, Result};
use big_o_test::*;
use log::{info, LevelFilter};
use simple_logger::SimpleLogger;
use std::env;
use std::fs;
use std::path::PathBuf;

/// Configuration for input file reading
#[derive(Debug, Clone)]
struct InputConfig;

/// Implements input configuration extraction with more robust path handling
impl InputConfig {
    fn input_path() -> Result<PathBuf> {
        let current_dir = env::current_dir().context("Failed to get current directory")?;

        let potential_path = current_dir
            .parent()
            .unwrap_or(&current_dir)
            .join("input.txt");

        if potential_path.exists() {
            println!("Found input file at: {}", potential_path.display());
            return Ok(potential_path);
        }

        Err(anyhow::anyhow!(
            "Could not find input file. Searched path: {:?}",
            potential_path
        ))
    }
}

/// Reads the puzzle input from a file with enhanced error handling
fn read_input() -> Result<String> {
    let input_path = InputConfig::input_path()?;

    fs::read_to_string(&input_path)
        .with_context(|| format!("Failed to read input from {:?}", input_path))
}

/// Solves part 1 of the puzzle
fn part1(input: &str) -> u32 {
    // TODO: Implement part 1 solution
    0
}

/// Solves part 2 of the puzzle
fn part2(input: &str) -> u32 {
    // TODO: Implement part 2 solution
    0
}

/// Main entry point for the program
fn main() -> Result<()> {
    // Initialize logging with better error handling
    SimpleLogger::new()
        .with_level(LevelFilter::Info)
        .init()
        .context("Logging initialization failed")?;

    // Read input with early validation
    let input = read_input()?;

    // Performance testing with more descriptive names
    info!("\nRunning Part 1:");
    test_algorithm(
        "Part 1",
        15,
        || {
            part1(&input);
        }, // Directly return u32 without converting to f64
        1_000,
        || part1(&input), // Changed to u32 instead of f64
        10_000,
        || part1(&input), // Changed to u32 instead of f64
        BigOAlgorithmComplexity::ON,
        BigOAlgorithmComplexity::ON,
    );
    println!("Part 1: {}\n", part1(&input));

    info!("\nRunning Part 2:");
    test_algorithm(
        "Part 2",
        15,
        || {
            part2(&input);
        }, // Directly return u32 without converting to f64
        1_000,
        || part2(&input), // Changed to u32 instead of f64
        10_000,
        || part2(&input), // Changed to u32 instead of f64
        BigOAlgorithmComplexity::ON,
        BigOAlgorithmComplexity::ON,
    );
    println!("Part 2: {}\n", part2(&input));

    Ok(())
}

/// Integration tests module
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        let input = read_input().expect("Input reading failed");
        let result = part1(&input);
        assert!(result > 0, "Part 1 solution must be non-negative");
    }

    #[test]
    fn test_part2() {
        let input = read_input().expect("Input reading failed");
        let result = part2(&input);
        assert!(result > 0, "Part 2 solution must be non-negative");
    }
}
