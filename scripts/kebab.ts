import { readdir } from 'node:fs/promises';
import { rename } from 'node:fs/promises';
import path from 'node:path';

const toKebabCase = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_.]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .replace(/[^a-z0-9-]/g, '');
};

const isKebabCase = (str: string): boolean => {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str) && str.toLowerCase() === str;
};

const processPath = async (
  currentPath: string,
  skipExtensions: string[] = ['.git', 'node_modules', 'env', 'target'],
) => {
  try {
    const entries = await readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (skipExtensions.some((ext) => entry.name.includes(ext))) {
        console.log(`Skipping ${fullPath}`);
        continue;
      }

      const dirName = path.dirname(entry.name);
      const baseName = path.basename(entry.name, path.extname(entry.name));
      const ext = path.extname(entry.name);

      if (!isKebabCase(baseName)) {
        const newBaseName = toKebabCase(baseName);
        const newName =
          dirName === '.' ? `${newBaseName}${ext}` : path.join(dirName, `${newBaseName}${ext}`);
        const newPath = path.join(currentPath, newName);

        if (newPath !== fullPath) {
          try {
            await rename(fullPath, newPath);
            console.log(`Renamed: ${entry.name} → ${newName}`);
          } catch (error) {
            console.error(`Error renaming ${fullPath}:`, error);
          }
        }
      }

      if (entry.isDirectory()) {
        await processPath(path.join(currentPath, entry.name), skipExtensions);
      }
    }
  } catch (error) {
    console.error(`Error processing ${currentPath}:`, error);
  }
};

if (import.meta.main) {
  const startPath = process.argv[2] || process.cwd();
  console.log(`Starting directory rename from: ${startPath}`);

  processPath(startPath)
    .then(() => console.log('Finished renaming files and directories'))
    .catch((error) => console.error('Error:', error));
}

export { processPath, toKebabCase };
