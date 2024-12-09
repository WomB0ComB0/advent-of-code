// TODO: If you don't already have an extension that is click and build, then use this to generate a pdf.

import { spawnSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const year = process.argv[2];
const day = process.argv[3];

{
  if (!year || !day) {
    console.error('Usage: ts-node note.ts <year> <day>');
    process.exit(1);
  }
  if (!existsSync(resolve(__dirname, `../challenges/${year}/${day}`))) {
    console.error(`No such directory: ${year}/${day}`);
    process.exit(1);
  }
  if (isNaN(Number(year)) || isNaN(Number(day))) {
    console.error('Year and day must be numbers');
    process.exit(1);
  }
}

const notes = resolve(__dirname, `../challenges/${year}/${day}/notes.tex`);

const runNotes = async (notes: string): Promise<void> => {
  for (const _ of Array.from({ length: 3 })) {
    try {
      const { stdout } = spawnSync('pandoc', [
        '--from',
        'latex',
        '--to',
        'pdf',
        '--output',
        `${notes.replace('.tex', '.pdf')}`,
        `${notes}`,
      ]);
      console.log(stdout.toString());
    } catch (error) {
      console.error(error);
    } finally {
      unlinkSync(`${notes.replace('.tex', '.pdf')}`);
    }
  }
};

const main = async (): Promise<void> => {
  await runNotes(notes);
};

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(console.error);
}
