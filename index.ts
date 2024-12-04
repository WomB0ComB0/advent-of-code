/**
 * Main script for managing Advent of Code challenges.
 * Handles creating new challenge directories and running solutions in different languages.
 * 
 * @module aoc-manager
 */

import { config } from 'dotenv';
import { spawn } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { downloadInputForYearAndDay, getPuzzleDescription } from './utils/aoc-actions';
import { cp } from 'shelljs';

config();

/**
 * Maps language aliases to their standardized file extensions
 */
const languageMappings = {
  rust: 'rs',
  rs: 'rs', 
  typescript: 'ts',
  ts: 'ts',
  py: 'py',
  python: 'py',
} as const;

type Language = keyof typeof languageMappings;

const [, , action, year, day, lang] = process.argv;

/**
 * Creates a new challenge directory with template files and downloads puzzle input/description.
 * 
 * @async
 * @throws {Error} If year or day is not provided
 * @throws {Error} If downloading puzzle input/description fails
 */
const createFromTemplate = async () => {
  if (!year || !day) {
    console.error('Please provide both year and day');
    process.exit(1);
  }

  const basePath = `./challenges/${year}/${day}`;
  const templateLang = lang ? languageMappings[lang as Language] : 'ts';
  const langPath = `${basePath}/${templateLang}`;
  
  if (!existsSync(basePath)) {
    console.log(`Creating challenge directory at ${basePath}...`);
    mkdirSync(basePath, { recursive: true });
    
    const inputPath = `${basePath}/input.txt`;
    if (!existsSync(inputPath)) {
      console.log('Downloading input...');
      const input = await downloadInputForYearAndDay(day, year);
      writeFileSync(inputPath, input as string);
    }

    const readmePath = `${basePath}/README.md`;
    const readme = await getPuzzleDescription(year, day);
    writeFileSync(readmePath, readme as string);
  }

  if (!existsSync(langPath)) {
    console.log(`Creating ${templateLang} solution directory...`);
    mkdirSync(langPath, { recursive: true });
    cp('-rf', `template/${templateLang}/*`, langPath);
    
    if (templateLang === 'rs') {
      const cargoTomlPath = `${langPath}/Cargo.toml`;
      if (existsSync(cargoTomlPath)) {
        let cargoToml = readFileSync(cargoTomlPath, 'utf8');
        cargoToml = cargoToml.replace(/name = ".*"/, `name = "aoc_${year}_day${day}"`);
        writeFileSync(cargoTomlPath, cargoToml);
      }
    }
  }
};

/**
 * Runs the challenge solution for the specified year/day/language.
 * 
 * @throws {Error} If year or day is not provided
 * @throws {Error} If language is not specified
 */
const runChallenge = () => {
  if (!year || !day) {
    console.error('Please provide both year and day');
    process.exit(1);
  }

  const basePath = `challenges/${year}/${day}`;
  const selectedLang = lang ? languageMappings[lang as Language] : null;
  
  if (selectedLang) {
    runLanguageImplementation(`${basePath}/${selectedLang}`);
  } else {
    console.error('Please specify a language to run');
    process.exit(1);
  }
};

/**
 * Executes the appropriate language-specific solution file.
 * Supports Rust (via Cargo), Python, and TypeScript implementations.
 * 
 * @param {string} folder - Path to the language-specific solution directory
 * @throws {Error} If no suitable solution file is found
 */
const runLanguageImplementation = (folder: string) => {
  if (existsSync(`${folder}/Cargo.toml`)) {
    console.log('Running Rust project...');
    spawn('cargo', ['run'], {
      stdio: 'inherit',
      shell: true,
      cwd: folder
    });
    return;
  }

  const pythonFiles = ['index.py', 'main.py', 'solution.py'];
  const pythonFile = pythonFiles.find(file => existsSync(`${folder}/${file}`));
  
  if (pythonFile) {
    console.log(`Running Python file: ${pythonFile}`);
    spawn('python3', [`${folder}/${pythonFile}`], {
      stdio: 'inherit',
      shell: true
    });
    return;
  }

  const tsFiles = ['index.ts', 'main.ts', 'solution.ts'];
  const tsFile = tsFiles.find(file => existsSync(`${folder}/${file}`));
  
  if (tsFile) {
    console.log(`Running TypeScript file: ${tsFile}`);
    spawn('bun', [`${folder}/${tsFile}`], {
      stdio: 'inherit',
      shell: true
    });
    return;
  }

  console.error('No suitable file found to run');
  process.exit(1);
};

/**
 * Main execution function that processes command line arguments and runs the appropriate action.
 * Supports 'create' for setting up new challenges and 'run' for executing solutions.
 * 
 * @async
 * @throws {Error} If an invalid action is provided
 * @throws {Error} If any operation fails during execution
 */
(async () => {
  try {
    switch (action) {
      case 'create':
        await createFromTemplate();
        break;
      case 'run':
        runChallenge();
        break;
      default:
        console.error('Invalid action. Use "create" or "run".');
        process.exit(1);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
})();