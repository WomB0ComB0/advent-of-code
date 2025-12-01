"""
@file index.py
@module aoc-manager
@description Main script for managing Advent of Code challenges.
Handles creating new challenge directories and running solutions in different languages.
"""

import os
import sys
import logging
from typing import Optional, Callable
from functools import lru_cache
import time

# Add project root to sys.path to enable imports from test module
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..', '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from test.python.runtime import test_algorithm, AlgorithmTest
import random

# Configure logging with a more detailed format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# Add test data generator functions
def generate_test_data(n: int) -> str:
    """Generate test data of size n for algorithm testing"""
    # Generate random directions (L/R) and amounts
    data = []
    for _ in range(n):
        direction = random.choice(['L', 'R'])
        amount = random.randint(1, 200)
        data.append(f"{direction}{amount}")
    return "\n".join(data)


def generate_test_data_complex(n: int) -> str:
    """Generate more complex test data with varying amounts"""
    data = []
    for _ in range(n):
        direction = random.choice(['L', 'R'])
        amount = random.choice([random.randint(1, 50), random.randint(50, 200), random.randint(200, 1000)])
        data.append(f"{direction}{amount}")
    return "\n".join(data)


class AOCError(Exception):
    """Custom exception for Advent of Code related errors."""

    pass


@lru_cache(maxsize=None)
def get_input(year: int, day: int, max_attempts: int = 3) -> str:
    """
    Reads and returns the input file content for a specific Advent of Code challenge.

    Args:
        year (int): The year of the challenge
        day (int): The day number of the challenge
        max_attempts (int): Maximum number of read attempts

    Returns:
        str: The contents of the input file as a string

    Raises:
        AOCError: If input file cannot be read after max attempts
    """
    path = f"challenges/{year}/{day}/input.txt"

    for attempt in range(max_attempts):
        try:
            with open(path, "r", encoding="utf-8") as file:
                content = file.read().strip()
                if not content:
                    logger.warning("Input file is empty: %s", path)
                return content
        except FileNotFoundError:
            logger.warning("Input file not found (Attempt %d): %s", attempt + 1, path)
            if attempt == max_attempts - 1:
                raise AOCError(
                    "Could not read input file after %d attempts", max_attempts
                )
        except IOError as e:
            logger.error("Error reading input file: %s", e)
            if attempt == max_attempts - 1:
                raise AOCError("IO error reading input file: %s", e)

    raise AOCError("Unexpected error in input retrieval")


def solve_challenge(
    input_data: str, solver: Callable[[str], str], part_name: str
) -> Optional[str]:
    """
    Generic solver function with error handling and timing.

    Args:
        input_data (str): The puzzle input
        solver (Callable): The solving function for the challenge part
        part_name (str): Name of the part being solved (for logging)

    Returns:
        Optional[str]: Solution to the challenge part
    """
    try:
        start_time = time.perf_counter()
        solution = solver(input_data)
        end_time = time.perf_counter()

        logger.info("%s solved in %.2f ms", part_name, (end_time - start_time) * 1000)
        return solution
    except Exception as e:
        logger.error("Error solving %s: %s", part_name, e)
        return None


def part1(aoc_input: str) -> str:
    """
    Solves part 1 of the Advent of Code challenge.

    Args:
        aoc_input (str): The puzzle input as a string

    Returns:
        str: The solution to part 1
    """
    current: int = 50
    zeroes: int = 0
    for line in aoc_input.splitlines():
        directories: str = line[0]
        amount: int = int(line[1:])
        if directories == 'L':
            current = (current - amount) % 100
        else:
            current = (current + amount) % 100
        zeroes += (current == 0)
    return zeroes   


def part2(aoc_input: str) -> str:
    """
    Solves part 2 of the Advent of Code challenge.

    Args:
        aoc_input (str): The puzzle input as a string

    Returns:
        str: The solution to part 2
    """
    current: int = 50
    ans: int = 0
    
    # Use lru_cache for memoization to prevent stack overflow
    @lru_cache(maxsize=None)
    def f(p, t, dir):
        if t == 0: return 0
        if p == 0:
            return abs(t) // 100
        elif dir == 'L':
            new_p = max(p - t, 0) % 100
            new_t = t - min(p, t)
            return (new_p == 0) + f(new_p, new_t, dir)
        else:
            new_p = (p + min(100 - p, t)) % 100
            new_t = t - min(100 - p, t)
            return (new_p == 0) + f(new_p, new_t, dir)
    
    for line in aoc_input.splitlines():
        direction: str = line[0]
        amount: int = int(line[1:])
        
        ans += f(current, amount, direction)
        if direction == 'L': amount *= -1
        current = (current + amount) % 100
    return ans
   

async def test_solutions():
    """Run performance tests on the solution functions"""
    test_cases = [
        AlgorithmTest(
            name="Part 1 Solution",
            func=lambda n: part1(generate_test_data(n)),
            generator=lambda n: n,
            n_repeats=50,
        ),
        AlgorithmTest(
            name="Part 2 Solution",
            func=lambda n: part2(generate_test_data_complex(n)),
            generator=lambda n: n,
            n_repeats=50,
        ),
    ]

    for test in test_cases:
        try:
            results = await test_algorithm(test)
            logger.info("Performance test results for %s:", test.name)
            logger.info("Best fit complexity: %s", results[test.name]["best_fit"])
            logger.info("Other complexity fits:")
            for complexity, residual in results[test.name]["other_fits"].items():
                logger.info("  %s: residual=%.2G", complexity, residual)
        except Exception as e:
            logger.error("Failed to test %s: %s", test.name, str(e))


def main() -> int:
    """
    Main function that runs both parts of the challenge and performance tests.

    Returns:
        int: Exit code (0 for success, 1 for failure)
    """
    try:
        # Dynamically extract year and day from script path
        script_path = os.path.abspath(__file__)
        parts = script_path.split(os.sep)

        try:
            # Script is at challenges/{year}/{day}/py/index.py
            # So year is at -4 and day is at -3 from the end
            year = int(parts[-4])
            day = int(parts[-3])
        except (ValueError, IndexError):
            logger.error("Unable to extract year and day from script path: %s", script_path)
            return 1

        # Retrieve input
        try:
            aoc_input = get_input(year, day)
        except AOCError as e:
            logger.error(str(e))
            return 1

        # Solve challenges
        solutions = [
            solve_challenge(aoc_input, part1, "Part 1"),
            solve_challenge(aoc_input, part2, "Part 2"),
        ]

        # Print solutions
        for i, solution in enumerate(solutions, 1):
            if solution is not None:
                print(f"Solution {i}: {solution}")
            else:
                logger.warning("Part %d solution could not be computed", i)

        # Run performance tests if solutions are implemented
        if hasattr(part1, "__code__") and hasattr(part2, "__code__"):
            import asyncio

            asyncio.run(test_solutions())

        return 0

    except Exception as e:
        logger.error("Unexpected error in main: %s", e)
        return 1


if __name__ == "__main__":
    sys.exit(main())
