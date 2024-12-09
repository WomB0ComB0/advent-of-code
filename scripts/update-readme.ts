import fs from 'node:fs/promises';
import path from 'node:path';

import { existsSync } from 'node:fs';
import { load } from 'cheerio';
import prettier from 'prettier';

async function get(url: string) {
  const response = await fetch(`https://adventofcode.com${url}`, {
    headers: {
      Cookie: `session=${process.env.SESSION_COOKIE}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  if (text.includes('[Log In]</a>')) {
    throw new Error('Not authenticated. Check your session cookie.');
  }

  return text;
}

async function getStars(year: number) {
  const contents = await get(`/${year}`);
  const $ = load(contents);

  const starsByDay = new Map(Array.from({ length: 25 }, (_, i) => [i + 1, 0]));

  for (const el of $('a[class*="calendar-day"][aria-label]')) {
    const label = el.attribs['aria-label'];
    if (!label) continue;

    const classes = el.attribs.class?.split(' ') || [];

    const isVeryComplete = classes.includes('calendar-verycomplete');
    const isComplete = classes.includes('calendar-complete');

    const dayMatch = /Day (\d+)/.exec(label);
    if (!dayMatch) continue;

    const day = Number(dayMatch[1]);
    const stars = isVeryComplete ? 2 : isComplete ? 1 : 0;

    starsByDay.set(day, stars);
  }

  return Array.from(starsByDay.values());
}

function transpose(grid: any[][]) {
  return grid[0].map((_, i) => grid.map((row) => row[i]));
}

// --

const contents = await get(`/${new Date().getFullYear()}/events`);
const $ = load(contents);

const totals: [number, ...number[]][] = [];
for await (const event of $('.eventlist-event')) {
  const year = Number($(event).find('a:first-of-type').text().trim().slice(1, -1));
  totals.push([year, ...(await getStars(year))]);
}

const data = transpose(totals.reverse());

const output = [['Day', ...data[0].map((year) => `[${year}][link-${year}]`)]];
output.push([':---:', ...data[0].map(() => ':---')]);

for (const [idx, row] of data.slice(1).entries()) {
  output.push([
    `**${idx + 1}**`,
    ...row.map((stars) => (stars === 2 ? '⭐⭐' : stars === 1 ? '⭐' : ' ')),
  ]);
}

output.push([
  '**Total:**',
  ...data.slice(1).reduce(
    (acc, row) =>
      acc.map((v, i) => {
        const total = v + row[i];
        if (total === 50) {
          return '**50**';
        }
        return total;
      }),
    Array(data[0].length).fill(0),
  ),
]);

// Main README.md
{
  const allStars = data.slice(1).reduce((acc, row) => acc + row.reduce((acc, v) => acc + v, 0), 0);
  const markdown = `Total stars: **${allStars}**\n\n${output.map((row) => `|${row.join(' | ')}|`).join('\n')}\n\n${data[0]
    .map(
      (year) =>
        `[link-${year}]: https://github.com/WomB0ComB0/advent-of-code/tree/master/challenges/${year}`,
    )
    .join('\n')}`;
  if (!existsSync(path.join(process.cwd(), 'README.md'))) {
    await fs.writeFile(
      path.join(process.cwd(), 'README.md'),
      '<!-- start -->\n<!-- end -->',
      'utf8',
    );
  }
  const readme = path.join(process.cwd(), 'README.md');
  const contents = await fs.readFile(readme, 'utf8');
  await fs.writeFile(
    readme,
    await prettier.format(
      contents.replace(
        /<\!-- start -->([\s\S]*)<\!-- end -->/g,
        `<!-- start -->\n${markdown}\n<!-- end -->`,
      ),
      { parser: 'markdown' },
    ),
  );
}

// Sub README.md
{
  for (const [year, ...stars] of totals) {
    if (!existsSync(path.join(process.cwd(), `challenges/${year}`))) continue;

    const count = stars.reduce((acc, v) => acc + v, 0);

    const output = [
      ['Day', 'Part 1', 'Part 2'],
      [':---:', ':---:', ':---:'],
    ];

    for (const [idx, count] of stars.entries()) {
      output.push([`**${idx + 1}**`, count >= 1 ? '⭐' : ' ', count === 2 ? '⭐' : ' ']);
    }

    const markdown = `Total stars: **${count}**\n\n${output.map((row) => `|${row.join(' | ')}|`).join('\n')}\n`;

    const readmePath = path.join(process.cwd(), `challenges/${year}/README.md`);
    if (!existsSync(readmePath)) {
      await fs.writeFile(readmePath, '<!-- start -->\n<!-- end -->', 'utf8');
    }
    const readme = readmePath;
    const contents = await fs.readFile(readme, 'utf8');
    await fs.writeFile(
      readme,
      await prettier.format(
        contents.replace(
          /<\!-- start -->([\s\S]*)<\!-- end -->/g,
          `<!-- start -->\n${markdown}\n<!-- end -->`,
        ),
        { parser: 'markdown' },
      ),
    );
  }
}
