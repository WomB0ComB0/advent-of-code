/**
 * Main script for managing Advent of Code challenges.
 * Handles creating new challenge directories and running solutions in different languages.
 *
 * @module aoc-manager
 */

import { spawn } from 'child_process';
import { config } from 'dotenv';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { cp } from 'shelljs';
import { downloadInputForYearAndDay, getPuzzleDescription } from '../utils/aoc-actions';

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

/**
 * Parses command line arguments with better validation
 */
const parseArguments = () => {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: npm run start <action> <year> <day> [language]');
    console.error('  action: create | run');
    console.error('  year: 2015-2025');
    console.error('  day: 1-25');
    console.error('  language (optional): ts | py | rs | typescript | python | rust');
    console.error('\nExample: npm run start create 2025 1 ts');
    process.exit(1);
  }

  const [action, year, day, lang] = args;

  // Validate action
  if (!['create', 'run'].includes(action)) {
    console.error(`❌ Invalid action: "${action}"`);
    console.error('   Must be either "create" or "run"');
    process.exit(1);
  }

  // Validate year
  const yearNum = Number.parseInt(year);
  if (isNaN(yearNum) || yearNum < 2015 || yearNum > 2025) {
    console.error(`❌ Invalid year: "${year}"`);
    console.error('   Year must be between 2015 and 2025');
    process.exit(1);
  }

  // Validate day
  const dayNum = Number.parseInt(day);
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
    console.error(`❌ Invalid day: "${day}"`);
    console.error('   Day must be between 1 and 25');
    process.exit(1);
  }

  // Validate language if provided
  if (lang && !languageMappings[lang as Language]) {
    console.error(`❌ Invalid language: "${lang}"`);
    console.error(`   Supported languages: ${Object.keys(languageMappings).join(', ')}`);
    process.exit(1);
  }

  return { action, year, day, lang };
};

const { action, year, day, lang } = parseArguments();

/**
 * Creates a new challenge directory with template files and downloads puzzle input/description.
 *
 * @async
 * @throws {Error} If downloading puzzle input/description fails
 */
const createFromTemplate = async () => {
  const basePath = `./challenges/${year}/${day}`;
  const templateLang = lang ? languageMappings[lang as Language] : 'ts';
  const langPath = `${basePath}/${templateLang}`;

  console.log(`\n📅 Creating Advent of Code ${year} - Day ${day}`);
  console.log(`🔧 Language: ${templateLang}\n`);

  if (!existsSync(basePath)) {
    console.log(`📁 Creating challenge directory at ${basePath}...`);
    mkdirSync(basePath, { recursive: true });

    const inputPath = `${basePath}/input.txt`;
    if (!existsSync(inputPath)) {
      console.log('⬇️  Downloading input...');
      try {
        const input = await downloadInputForYearAndDay(day, year);
        writeFileSync(inputPath, input as string);
        console.log('✅ Input downloaded');
      } catch (error) {
        console.error('❌ Failed to download input:', error);
        throw error;
      }
    }

    const readmePath = `${basePath}/README.md`;
    console.log('⬇️  Downloading puzzle description...');
    try {
      const readme = await getPuzzleDescription(year, day);
      writeFileSync(readmePath, readme as string);
      console.log('✅ Puzzle description downloaded');
    } catch (error) {
      console.error('❌ Failed to download puzzle description:', error);
      throw error;
    }

    const notesPath = `${basePath}/notes.typ`;
    console.log('📝 Creating notes template...');
    const notesTemplate = createTypstTemplate(year, day);
    writeFileSync(notesPath, notesTemplate);
    console.log('✅ Notes template created');
  } else {
    console.log(`ℹ️  Challenge directory already exists at ${basePath}`);
  }

  if (!existsSync(langPath)) {
    console.log(`\n🚀 Creating ${templateLang} solution directory...`);
    mkdirSync(langPath, { recursive: true });

    const templatePath = `template/${templateLang}`;
    if (!existsSync(templatePath)) {
      console.error(`❌ Template directory not found: ${templatePath}`);
      console.error(`   Please create a template directory at ${templatePath}`);
      process.exit(1);
    }

    cp('-rf', `${templatePath}/*`, langPath);
    console.log(`✅ ${templateLang} template copied`);

    if (templateLang === 'rs') {
      const cargoTomlPath = `${langPath}/Cargo.toml`;
      if (existsSync(cargoTomlPath)) {
        console.log('⚙️  Updating Cargo.toml...');
        let cargoToml = readFileSync(cargoTomlPath, 'utf8');
        cargoToml = cargoToml.replace(/name = ".*"/, `name = "aoc_${year}_day${day}"`);
        writeFileSync(cargoTomlPath, cargoToml);
        console.log('✅ Cargo.toml updated');
      }
    }
  } else {
    console.log(`ℹ️  ${templateLang} solution directory already exists`);
  }

  console.log(`\n✨ Setup complete! Your challenge is ready at ${basePath}`);
  console.log(`\n💡 To run your solution: npm run start run ${year} ${day} ${templateLang}`);
};

const createTypstTemplate = (year: string, day: string) => {
  return `#set document(title: "Advent of Code ${year} - Day ${day}", author: "Your Name")
#set page(numbering: "1")

= Advent of Code ${year} - Day ${day}

== Problem Understanding
// Brief description of the problem and key insights

== Part 1

=== Approach
// Describe your approach to solving part 1

=== Implementation Details
// Key implementation details, algorithms, data structures

=== Complexity Analysis
- *Time Complexity:* $O(?)$
- *Space Complexity:* $O(?)$

== Part 2

=== Approach
// Describe your approach to solving part 2

=== Implementation Details
// Key implementation details, algorithms, data structures

=== Complexity Analysis
- *Time Complexity:* $O(?)$
- *Space Complexity:* $O(?)$

== Key Learnings
// What did you learn from this problem?
// Any interesting techniques or observations?

== Code Snippets
\`\`\`python
# Your code here
\`\`\`
`;
};

/**
 * Runs the challenge solution for the specified year/day/language.
 *
 * @throws {Error} If language is not specified
 */
const runChallenge = () => {
  const basePath = `challenges/${year}/${day}`;
  const selectedLang = lang ? languageMappings[lang as Language] : null;

  if (!selectedLang) {
    console.error('❌ Please specify a language to run');
    console.error(`   Supported languages: ${Object.keys(languageMappings).join(', ')}`);
    console.error(`\n   Example: npm run start run ${year} ${day} ts`);
    process.exit(1);
  }

  const langPath = `${basePath}/${selectedLang}`;

  if (!existsSync(langPath)) {
    console.error(`❌ Solution directory not found: ${langPath}`);
    console.error(`\n   Create it first with: npm run start create ${year} ${day} ${selectedLang}`);
    process.exit(1);
  }

  console.log(`\n🎄 Running Advent of Code ${year} - Day ${day} (${selectedLang})\n`);
  runLanguageImplementation(langPath);
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
    console.log('🦀 Running Rust solution with Cargo...\n');
    spawn('cargo', ['run'], {
      stdio: 'inherit',
      shell: true,
      cwd: folder,
    });
    return;
  }

  const pythonFiles = ['index.py', 'main.py', 'solution.py'];
  const pythonFile = pythonFiles.find((file) => existsSync(`${folder}/${file}`));

  if (pythonFile) {
    console.log(`🐍 Running Python file: ${pythonFile}\n`);
    spawn('python', [`${folder}/${pythonFile}`], {
      stdio: 'inherit',
      shell: true,
    });
    return;
  }

  const tsFiles = ['index.ts', 'main.ts', 'solution.ts'];
  const tsFile = tsFiles.find((file) => existsSync(`${folder}/${file}`));

  if (tsFile) {
    console.log(`📘 Running TypeScript file: ${tsFile}\n`);
    spawn('bun', [`${folder}/${tsFile}`], {
      stdio: 'inherit',
      shell: true,
    });
    return;
  }

  console.error('❌ No suitable file found to run');
  console.error(`   Looking for one of: ${[...pythonFiles, ...tsFiles, 'Cargo.toml'].join(', ')}`);
  process.exit(1);
};

/**
 * Main execution function that processes command line arguments and runs the appropriate action.
 * Supports 'create' for setting up new challenges and 'run' for executing solutions.
 *
 * @async
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
    }
  } catch (error) {
    console.error('\n❌ An error occurred:', error);
    process.exit(1);
  }
})();
