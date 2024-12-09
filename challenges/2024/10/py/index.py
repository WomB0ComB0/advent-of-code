import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def get_input(year: int, day: int) -> str:
    with open(f"{year}/day{day}/input.txt", "r", encoding="utf-8") as file:
        return file.read()


def part1(aoc_input: str) -> str:
    pass


def part2(aoc_input: str) -> str:
    pass


def main() -> None:
    aoc_input = get_input(2024, 1)
    print(f"Solution 1: {part1(aoc_input)}")
    print(f"Solution 2: {part2(aoc_input)}")


if __name__ == "__main__":
    main()
