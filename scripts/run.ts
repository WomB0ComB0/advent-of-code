#!/usr/bin/env bun
/**
 * Quick run script for Advent of Code solutions
 * Usage: bun scripts/run.ts <year> <day> <lang>
 * Example: bun scripts/run.ts 2025 1 ts
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import * as path from 'path';

const languageMappings = {
  rust: 'rs',
  rs: 'rs',
  typescript: 'ts',
  ts: 'ts',
  py: 'py',
  python: 'py',
} as const;

type Language = keyof typeof languageMappings;

// Parse arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: bun scripts/run.ts <year> <day> <lang>');
  console.error('  year: 2015-2025');
  console.error('  day: 1-25');
  console.error('  lang: ts | py | rs | typescript | python | rust');
  console.error('\\nExample: bun scripts/run.ts 2025 1 ts');
  process.exit(1);
}

const [year, day, lang] = args;

// Validate inputs
const yearNum = Number.parseInt(year);
if (isNaN(yearNum) || yearNum < 2015 || yearNum > 2025) {
  console.error(`❌ Invalid year: "${year}" (must be 2015-2025)`);
  process.exit(1);
}

const dayNum = Number.parseInt(day);
if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
  console.error(`❌ Invalid day: "${day}" (must be 1-25)`);
  process.exit(1);
}

if (!languageMappings[lang as Language]) {
  console.error(`❌ Invalid language: "${lang}"`);
  console.error(`   Supported: ${Object.keys(languageMappings).join(', ')}`);
  process.exit(1);
}

const selectedLang = languageMappings[lang as Language];
const basePath = path.join(process.cwd(), 'challenges', year, day);
const langPath = path.join(basePath, selectedLang);

// Check if solution exists
if (!existsSync(langPath)) {
  console.error(`❌ Solution not found: ${langPath}`);
  console.error(`\\n   Create it first with: bun scripts/index.ts create ${year} ${day} ${selectedLang}`);
  process.exit(1);
}

console.log(`\\n🎄 Running AoC ${year} Day ${day} (${selectedLang})\\n`);

// Run the appropriate command based on language
if (selectedLang === 'rs') {
  // Rust - use cargo
  const cargoPath = path.join(langPath, 'Cargo.toml');
  if (existsSync(cargoPath)) {
    console.log('🦀 Running Rust solution with Cargo...\\n');
    const proc = spawn('cargo', ['run'], {
      stdio: 'inherit',
      shell: true,
      cwd: langPath,
    });
    
    proc.on('exit', (code) => {
      process.exit(code || 0);
    });
  } else {
    console.error('❌ Cargo.toml not found in Rust directory');
    process.exit(1);
  }
} else if (selectedLang === 'py') {
  // Python - check for virtual environment
  const pythonFile = path.join(langPath, 'index.py');
  const venvPath = path.join(process.cwd(), '.venv', 'bin', 'python');
  
  if (existsSync(pythonFile)) {
    console.log('🐍 Running Python solution...\\n');
    
    // Use venv python if it exists, otherwise use system python
    const pythonCmd = existsSync(venvPath) ? venvPath : 'python';
    
    const proc = spawn(pythonCmd, [pythonFile], {
      stdio: 'inherit',
      shell: true,
    });
    
    proc.on('exit', (code) => {
      process.exit(code || 0);
    });
  } else {
    console.error(`❌ index.py not found: ${pythonFile}`);
    process.exit(1);
  }
} else if (selectedLang === 'ts') {
  // TypeScript
  const tsFile = path.join(langPath, 'index.ts');
  if (existsSync(tsFile)) {
    console.log('📘 Running TypeScript solution...\\n');
    const proc = spawn('bun', [tsFile], {
      stdio: 'inherit',
      shell: true,
    });
    
    proc.on('exit', (code) => {
      process.exit(code || 0);
    });
  } else {
    console.error(`❌ index.ts not found: ${tsFile}`);
    process.exit(1);
  }
}
