use anyhow::{Context, Result};
use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::PathBuf;

/// Configuration for input file reading
#[derive(Debug, Clone)]
struct InputConfig;

/// Implements input configuration extraction with more robust path handling
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

/// Reads the puzzle input from a file with enhanced error handling
fn read_input() -> Result<String> {
    let input_path = InputConfig::input_path()?;

    fs::read_to_string(&input_path)
        .with_context(|| format!("Failed to read input from {:?}", input_path))
}

/// Solves part 1 of the puzzle
fn part1(input: &str) -> u32 {
    let mut current: i32 = 50;
    let mut zeroes: u32 = 0;

    for line in input.lines() {
        let direction = line.chars().next().unwrap();
        let amount = line[1..].parse::<i32>().unwrap();

        if direction == 'L' {
            current = (current - amount).rem_euclid(100);
        } else {
            current = (current + amount).rem_euclid(100);
        }

        if current == 0 {
            zeroes += 1;
        }
    }
    zeroes
}

/// Solves part 2 of the puzzle
fn part2(input: &str) -> u32 {
    let mut current: i32 = 50;
    let mut ans: u32 = 0;
    let mut memo: HashMap<(i32, i32, char), u32> = HashMap::new();

    fn f(p: i32, t: i32, dir: char, memo: &mut HashMap<(i32, i32, char), u32>) -> u32 {
        if t == 0 {
            return 0;
        }

        // Check memoization
        if let Some(&result) = memo.get(&(p, t, dir)) {
            return result;
        }

        let result = if p == 0 {
            (t.abs() / 100) as u32
        } else if dir == 'L' {
            let new_p = (p - t).max(0).rem_euclid(100);
            let new_t = t - p.min(t);
            (if new_p == 0 { 1 } else { 0 }) + f(new_p, new_t, dir, memo)
        } else {
            let new_p = (p + (100 - p).min(t)).rem_euclid(100);
            let new_t = t - (100 - p).min(t);
            (if new_p == 0 { 1 } else { 0 }) + f(new_p, new_t, dir, memo)
        };

        memo.insert((p, t, dir), result);
        result
    }

    for line in input.lines() {
        let direction = line.chars().next().unwrap();
        let amount = line[1..].parse::<i32>().unwrap();

        ans += f(current, amount, direction, &mut memo);

        if direction == 'L' {
            current = (current - amount).rem_euclid(100);
        } else {
            current = (current + amount).rem_euclid(100);
        }
    }
    ans
}

/// Main entry point for the program
fn main() -> Result<()> {
    // Read input with early validation
    let input = read_input()?;

    // Run and print solutions
    println!("Part 1: {}", part1(&input));
    println!("Part 2: {}", part2(&input));

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
