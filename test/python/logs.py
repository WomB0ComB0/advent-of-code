import logging
from typing import Callable, Optional, Dict, Any
from collections import defaultdict
import asyncio

logger = logging.getLogger(__name__)


class TestError(Exception):
    """Base exception for test-related errors."""

    ...


class TestTimeoutError(TimeoutError):
    """Specific exception for test timeout scenarios."""

    ...


class TestResults:
    """
    A class to manage and log test results with retry mechanism and logging.

    Supports asynchronous test execution with configurable repeat attempts.
    """

    def __init__(self, test: Callable, n_repeats: Optional[int] = 3):
        """
        Initialize TestResults with a test function and number of repeat attempts.

        Args:
            test (Callable): The async test function to be executed
            n_repeats (Optional[int]): Number of times to retry the test, defaults to 3
        """
        self.test = test
        self.test_name = test.__name__
        self.n_repeats = n_repeats

    async def run(self) -> Dict[str, Any]:
        """
        Execute the test with retry mechanism.

        Returns:
            Dict[str, Any]: Test results or raises an exception if all attempts fail

        Raises:
            TestError: If the test fails after all retry attempts
        """
        for attempt in range(1, self.n_repeats + 1):
            try:
                # Execute the test with a timeout to prevent indefinite hanging
                result = await asyncio.wait_for(self.test(), timeout=10.0)
                return self._log_test_results(result, attempt)

            except asyncio.TimeoutError:
                logger.error(
                    "Test %s timed out (Attempt %s/%s)",
                    self.test_name,
                    attempt,
                    self.n_repeats,
                )
                if attempt == self.n_repeats:
                    raise TestTimeoutError(
                        "Test %s consistently timed out", self.test_name
                    )

            except Exception as e:
                logger.error(
                    "Test %s failed (Attempt %s/%s): %s",
                    self.test_name,
                    attempt,
                    self.n_repeats,
                    e,
                )
                if attempt == self.n_repeats:
                    raise TestError(
                        "Test %s failed after %s attempts",
                        self.test_name,
                        self.n_repeats,
                    )

        # This should never be reached due to the raises above, but added for completeness
        raise TestError("Unexpected failure in test %s", self.test_name)

    def _log_test_results(
        self, test_results: Dict[str, Any], attempt: int
    ) -> Dict[str, Any]:
        """
        Log test results and return the results dictionary.

        Args:
            test_results (Dict[str, Any]): Results from the test
            attempt (int): The current attempt number

        Returns:
            Dict[str, Any]: The original test results
        """
        logger.info("Test %s (Attempt %s) - Successful", self.test_name, attempt)

        # If test_results is a defaultdict or has a similar structure
        if isinstance(test_results, defaultdict) or isinstance(test_results, dict):
            for test_name, result in test_results.items():
                logger.info("Subtest: %s", test_name)
                for key, value in result.items():
                    logger.info("  %s: %s", key.capitalize(), value)

        return test_results


# Optional example of how to use the class
async def example_test():
    """
    Example async test function demonstrating usage.

    Returns:
        Dict[str, Dict[str, float]]: A dictionary of test results
    """
    return {"performance_test": {"best": 0.95, "others": 0.75}}


async def main():
    # Example usage
    test_runner = TestResults(example_test)
    try:
        results = await test_runner.run()
        print(results)
    except (TestError, TestTimeoutError) as e:
        print("Test failed: %s", e)


if __name__ == "__main__":
    asyncio.run(main())
