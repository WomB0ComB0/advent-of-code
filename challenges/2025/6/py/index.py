"""
@file index.py
@module aoc-manager
@description Main script for managing Advent of Code challenges.

This module provides utilities for:
- Retrieving puzzle input from local files.
- Running solutions for Part 1 and Part 2 of a challenge.
- Performing performance tests on implemented solutions.
- Handling errors gracefully during input retrieval and solution execution.

It is designed to be executed within a specific challenge directory (e.g., `challenges/2023/01`).
"""

import os
import sys
import logging
from typing import Optional, Callable
from functools import lru_cache
import time

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
    """
    Generates a string of `n` random integers, each between 1 and 1000,
    separated by newlines. This is used for basic algorithm testing.

    Args:
        n (int): The number of random integers to generate.

    Returns:
        str: A newline-separated string of random integers.
    """
    return "\n".join(str(random.randint(1, 1000)) for _ in range(n))


def generate_test_data_complex(n: int) -> str:
    """
    Generates a string of `n` lines of more complex, mixed-type test data.
    Each line can contain a random number, a random string, or a combination
    of both, simulating varied input formats.

    Args:
        n (int): The number of lines of complex data to generate.

    Returns:
        str: A newline-separated string of mixed-type data.
    """
    data = []
    for _ in range(n):
        data_type = random.choice(["number", "string", "mixed"])
        if data_type == "number":
            data.append(str(random.randint(1, 1000)))
        elif data_type == "string":
            data.append("".join(random.choices("abcdefghijk", k=5)))
        else:
            data.append(
                f"{random.randint(1,100)} {''.join(random.choices('abcdefghijk', k=3))}"
            )
    return "\n".join(data)


class AOCError(Exception):
    """Custom exception for Advent of Code related errors,
    typically used for issues like missing input files or other operational failures.
    """

    pass


@lru_cache(maxsize=None)
def get_input(year: int, day: int, max_attempts: int = 3) -> str:
    """
    Reads and returns the input file content for a specific Advent of Code challenge.
    The input file is expected at `challenges/{year}/{day}/input.txt`.
    It retries reading the file up to `max_attempts` times in case of transient issues.

    Args:
        year (int): The year of the challenge (e.g., 2023).
        day (int): The day number of the challenge (e.g., 1).
        max_attempts (int): Maximum number of read attempts if the file is not found
                            or an IO error occurs.

    Returns:
        str: The contents of the input file as a string, with leading/trailing whitespace removed.

    Raises:
        AOCError: If the input file cannot be read after the specified number of attempts,
                  or if an unexpected IO error occurs.
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
                    f"Could not read input file after {max_attempts} attempts: {path}"
                )
        except IOError as e:
            logger.error("Error reading input file: %s", e)
            if attempt == max_attempts - 1:
                raise AOCError(f"IO error reading input file: {e}")

    raise AOCError("Unexpected error in input retrieval")


def solve_challenge(
    input_data: str, solver: Callable[[str], str], part_name: str
) -> Optional[str]:
    """
    Generic solver function that executes a given challenge part's solver function
    with error handling and performance timing.

    Args:
        input_data (str): The puzzle input string to be passed to the solver.
        solver (Callable[[str], str]): The function that implements the logic for
                                       a specific part of the challenge (e.g., `part1` or `part2`).
                                       It should accept a string and return a string.
        part_name (str): A descriptive name for the part being solved (e.g., "Part 1", "Part 2"),
                         used for logging.

    Returns:
        Optional[str]: The solution string returned by the solver function if successful,
                       otherwise `None` if an error occurred during execution.
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
    Solves part 1 of the Advent of Code challenge for the current day.
    Transposes lines into columns and applies operations based on the last character.

    Args:
        aoc_input (str): The puzzle input as a string.

    Returns:
        str: The solution to part 1 as a string.
    """
    from functools import reduce
    from operator import add, mul
    
    lines = [line.rstrip() for line in aoc_input.strip().split('\n')]
    
    total = sum(
        reduce([add, mul][c[-1] == "*"], map(int, c[:-1]))
        for c in list(map(list, zip(*map(str.split, lines))))
    )
    
    return str(total)


def part2(aoc_input: str) -> str:
    """
    Solves part 2 of the Advent of Code challenge for the current day.
    Parses multi-digit numbers from columns and applies operations.

    Args:
        aoc_input (str): The puzzle input as a string.

    Returns:
        str: The solution to part 2 as a string.
    """
    from functools import reduce
    from operator import add, mul
    
    lines = [line.rstrip() for line in aoc_input.strip().split('\n')]
    
    def process(left: int, right: int) -> int:
        op = [add, mul][lines[-1][left] == "*"]
        nums = []
        for x in range(left, right + 1):
            num = 0
            for y in range(len(lines) - 1):
                if x < len(lines[y]) and (char := lines[y][x]) != " ":
                    num = num * 10 + int(char)
            nums.append(num)
        return reduce(op, nums)
    
    n = max(map(len, lines))
    total = left = 0
    for right in range(1, n):
        if right < len(lines[-1]) and lines[-1][right] != " ":
            total += process(left, right - 2)
            left = right
    
    return str(total + process(left, n - 1))


async def test_solutions():
    """
    Runs performance tests on the implemented solution functions (`part1` and `part2`).
    It uses `AlgorithmTest` to define test cases with generated data and
    `test_algorithm` to analyze their time complexity.
    Results, including best-fit complexity and other complexity fits, are logged.
    """
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
