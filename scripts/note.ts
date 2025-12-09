// Compiles Typst notes to PDF

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const year = process.argv[2];
const day = process.argv[3];

{
  if (!year || !day) {
    console.error('Usage: bun note.ts <year> <day>');
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

const notes = resolve(__dirname, `../challenges/${year}/${day}/notes.typ`);
const pdfPath = notes.replace('.typ', '.pdf');

function detectOS(): { type: string; distro?: string } {
  const platform = process.platform;
  
  if (platform === 'darwin') {
    return { type: 'macos' };
  }
  
  if (platform === 'linux') {
    try {
      const osRelease = readFileSync('/etc/os-release', 'utf-8');
      if (osRelease.includes('arch') || osRelease.includes('Arch')) {
        return { type: 'linux', distro: 'arch' };
      }
      if (osRelease.includes('ubuntu') || osRelease.includes('Ubuntu') || 
          osRelease.includes('debian') || osRelease.includes('Debian')) {
        return { type: 'linux', distro: 'debian' };
      }
      if (osRelease.includes('fedora') || osRelease.includes('Fedora')) {
        return { type: 'linux', distro: 'fedora' };
      }
    } catch (e) {
      // Fallback
    }
    return { type: 'linux', distro: 'unknown' };
  }
  
  return { type: 'unknown' };
}

function checkTypst(): boolean {
  try {
    const result = spawnSync('which', ['typst']);
    return result.status === 0;
  } catch (e) {
    return false;
  }
}

function installTypst(): boolean {
  const os = detectOS();
  console.log('typst not found. Installing...');
  
  try {
    if (os.type === 'macos') {
      console.log('Installing via Homebrew...');
      execSync('brew install typst', { stdio: 'inherit' });
      return true;
    }
    
    if (os.type === 'linux') {
      if (os.distro === 'arch') {
        console.log('Installing via pacman...');
        execSync('sudo pacman -S --noconfirm typst', { stdio: 'inherit' });
        return true;
      }
      
      if (os.distro === 'debian') {
        console.log('Installing via cargo (Rust package manager)...');
        execSync('cargo install typst-cli', { stdio: 'inherit' });
        return true;
      }
      
      if (os.distro === 'fedora') {
        console.log('Installing via dnf...');
        execSync('sudo dnf install -y typst', { stdio: 'inherit' });
        return true;
      }
      
      console.error('Unknown Linux distribution. Please install typst manually.');
      console.error('Visit: https://github.com/typst/typst#installation');
      return false;
    }
    
    console.error('Unsupported OS. Please install typst manually.');
    console.error('Visit: https://github.com/typst/typst#installation');
    return false;
  } catch (error) {
    console.error('Installation failed:', error);
    return false;
  }
}

const runNotes = async (notes: string): Promise<void> => {
  // Check and install typst if needed
  if (!checkTypst()) {
    const installed = installTypst();
    if (!installed) {
      console.error('Failed to install typst. Please install it manually.');
      return;
    }
    console.log('✓ typst installed successfully');
  }
  
  try {
    console.log(`Compiling ${notes}...`);
    
    const result = spawnSync('typst', [
      'compile',
      notes,
      pdfPath,
    ]);
    
    if (result.error) {
      console.error('Error running typst:', result.error.message);
      return;
    }
    
    if (result.status !== 0) {
      console.error('Typst compilation failed with status:', result.status);
      if (result.stderr) {
        console.error('Error output:', result.stderr.toString());
      }
      return;
    }
    
    if (result.stdout) {
      const output = result.stdout.toString();
      if (output.trim()) {
        console.log(output);
      }
    }
    
    if (existsSync(pdfPath)) {
      console.log(`✓ PDF created: ${pdfPath}`);
    } else {
      console.log('PDF was not created');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
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
