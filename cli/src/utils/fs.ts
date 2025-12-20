import { mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export async function copyDir(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const fileStat = await stat(srcPath);

    if (fileStat.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      const content = await Bun.file(srcPath).text();
      await writeFile(destPath, content);
    }
  }
}

export async function writeFile(path: string, content: string): Promise<void> {
  const dir = dirname(path);
  await mkdir(dir, { recursive: true });
  await Bun.write(path, content);
}

export async function readFile(path: string): Promise<string> {
  return Bun.file(path).text();
}

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const fileStat = await stat(path);
    return fileStat.isDirectory();
  } catch {
    return false;
  }
}

export async function listFiles(dir: string, recursive = false): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const fileStat = await stat(fullPath);

    if (fileStat.isDirectory() && recursive) {
      const subFiles = await listFiles(fullPath, true);
      files.push(...subFiles.map((f) => join(entry, f)));
    } else if (fileStat.isFile()) {
      files.push(entry);
    }
  }

  return files;
}

export async function listDirEntries(dir: string): Promise<{ name: string; isDirectory: boolean }[]> {
  const entries = await readdir(dir);
  const results: { name: string; isDirectory: boolean }[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const fileStat = await stat(fullPath);
    results.push({ name: entry, isDirectory: fileStat.isDirectory() });
  }

  return results;
}
