import { $ } from 'bun';

async function main() {
  const year = Number(Bun.argv[2]) || 2023;
  const d = Number(Bun.argv[3]) || 25;

  if (year < 2023 || year > new Date().getFullYear()) {
    console.error(`Year ${year} is out of range (2023-${new Date().getFullYear()})`);
    return;
  }

  for (const day of Array.from({ length: d }, (_, i) => i + 1)) {
    try {
      console.log(`Attempting day ${day} of year ${year}`);
      await $`bun run start create ${year} ${day} typescript`;
      await $`bun run start create ${year} ${day} python`;
      await $`bun run start create ${year} ${day} rust`;
    } catch (error) {
      console.error(`Failed on day ${day}:`, error);
      break;
    }
  }
}

main().catch(console.error);
