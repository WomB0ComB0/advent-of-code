import os
import sys
import big_o
import random
from typing import Callable
from dataclasses import dataclass
import logging
from test.python.logs import TestResults

# Add project root to Python path
project_root = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..")
)
sys.path.insert(0, project_root)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class AlgorithmTest:
    name: str
    func: Callable[[int], None]
    generator: Callable[[int], int]
    n_repeats: int = 100


async def test_algorithm(test: AlgorithmTest) -> dict:
    """Run big-O analysis on an algorithm and return results."""
    try:
        best, others = big_o.big_o(
            test.func,
            test.generator,
            min_n=100,
            max_n=10000,
            n_measures=10,
            n_repeats=test.n_repeats,
            n_timings=5,
        )

        results = {
            test.name: {
                "best_fit": str(best),
                "other_fits": {
                    str(class_): float(residuals)
                    for class_, residuals in others.items()
                },
            }
        }

        logger.info("\n=== %s ===", test.name)
        logger.info("Best fit: %s", best)
        for class_, residuals in others.items():
            logger.info("%s    (res: %.2G)", class_, residuals)

        return results

    except Exception as e:
        logger.error("Error testing algorithm %s: %s", test.name, str(e))
        raise


def remove_duplicates_wrapper(n: int) -> None:
    """Wrapper for remove duplicates algorithm."""
    data = ["".join(random.choices("abcdefghijk", k=5)) for _ in range(n)]
    result = []
    for item in data:
        if item not in result:
            result.append(item)


def binary_search_wrapper(n: int) -> None:
    """Wrapper for binary search algorithm."""
    data = list(range(n))
    target = n // 2
    left, right = 0, len(data) - 1
    while left <= right:
        mid = (left + right) // 2
        if data[mid] == target:
            break
        elif data[mid] < target:
            left = mid + 1
        else:
            right = mid - 1


async def main():
    test_cases = [
        AlgorithmTest(
            name="Remove Duplicates (Front)",
            func=remove_duplicates_wrapper,
            generator=lambda n: n,
        ),
        AlgorithmTest(
            name="Binary Search", func=binary_search_wrapper, generator=lambda n: n
        ),
    ]

    for test in test_cases:
        test_runner = TestResults(lambda: test_algorithm(test))
        try:
            results = await test_runner.run()
            logger.info("Test results for %s: %s", test.name, results)
        except Exception as e:
            logger.error("Test failed for %s: %s", test.name, str(e))


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
