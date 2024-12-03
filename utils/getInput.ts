import { readFileSync } from 'fs';
import { join } from 'path';

export const getInput = (year: number, day: number): string => {
    const path = join(__dirname, '..', 'challenges', year.toString(), day.toString(), 'input.txt');
    return readFileSync(path, 'utf-8');
};