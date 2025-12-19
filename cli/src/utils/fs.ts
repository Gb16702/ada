import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

export async function copyDir(src: string, dest: string): Promise<void> {
  mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      const content = await Bun.file(srcPath).text();
      await writeFile(destPath, content);
    }
  }
}

export async function writeFile(path: string, content: string): Promise<void> {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  await Bun.write(path, content);
}

export async function readFile(path: string): Promise<string> {
  return Bun.file(path).text();
}

export function ensureDir(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

export function pathExists(path: string): boolean {
  return existsSync(path);
}

export function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

export function listFiles(dir: string, recursive = false): string[] {
  const files: string[] = [];

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && recursive) {
      files.push(...listFiles(fullPath, true).map((f) => join(entry, f)));
    } else if (stat.isFile()) {
      files.push(entry);
    }
  }

  return files;
}
