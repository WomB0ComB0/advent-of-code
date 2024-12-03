# 2024

This project contains solutions to [Advent of Code](https://adventofcode.com/)
2024, using [Deno](https://deno.com/) and Typescript.

## Usage

You must have [aocd](https://github.com/Macil/aocd) installed and have set your
session cookie with it:

```
aocd set-cookie COOKIE_VALUE_HERE
```

Then you can run any solution script:

```
deno run -A day_1.ts
```

You can run one day's tests with `deno test day_1.ts` or by clicking the play
button next to it inside of Visual Studio Code. You can run all days' tests with
`deno test`.

You can debug a script within Visual Studio Code by opening the "Run and Debug"
view on the left side of Visual Studio Code, picking either the "Debug Current
File" or "Debug Current File's Tests" configuration in the dropdown, and then
clicking the play button next to it. You can set breakpoints by clicking to the
left of a line number to place a red dot.

You can also debug a script outside of Visual Studio Code by running
`deno run -A --inspect-brk day_1.ts` or `deno test --inspect-brk day_1.ts`.

If you want to use a local file as input for a problem instead of fetching it
from the Advent of Code website, you can add the `--input` flag to use a
specific file:

```
deno run -A day_1.ts --input myInput.txt
```

When you're confident about a solution, you can add the `--submit` (or `-s`)
flag to submit the solution and see if it was correct:

```
deno run -A day_1.ts --submit
```

You can use this command to create a new day_N.ts file from the template for a
new day:

```
aocd start 2
```
