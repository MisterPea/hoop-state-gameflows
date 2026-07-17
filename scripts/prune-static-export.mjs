import { existsSync, statSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";

// Static export routes that are only ever reached via a full page
// navigation (target="_blank" links, direct URL access) and never via a
// client-side <Link> transition. Next.js still emits per-route RSC/segment
// prefetch payloads for these directories on every `next build` — dead
// weight that's safe to delete post-build. Add to this list once a new
// route is confirmed to follow the same full-navigation-only pattern.
const PRUNE_DIRS = ["games"];

const outDir = path.join(process.cwd(), "out");

async function pruneDir(dirName) {
  const baseDir = path.join(outDir, dirName);
  if (!existsSync(baseDir)) return { removed: 0, bytes: 0 };

  const entries = await readdir(baseDir, { withFileTypes: true });
  let removed = 0;
  let bytes = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const htmlSibling = path.join(baseDir, `${entry.name}.html`);
    if (!existsSync(htmlSibling)) continue;

    const prefetchDir = path.join(baseDir, entry.name);
    bytes += await dirSize(prefetchDir);
    await rm(prefetchDir, { recursive: true, force: true });
    removed += 1;
  }

  return { removed, bytes };
}

async function dirSize(dir) {
  let total = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += await dirSize(entryPath);
    } else {
      total += statSync(entryPath).size;
    }
  }
  return total;
}

function formatBytes(bytes) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)}MB`;
}

async function main() {
  let totalRemoved = 0;
  let totalBytes = 0;

  for (const dirName of PRUNE_DIRS) {
    const { removed, bytes } = await pruneDir(dirName);
    totalRemoved += removed;
    totalBytes += bytes;
    console.log(`[prune-static-export] out/${dirName}: removed ${removed} prefetch dirs (${formatBytes(bytes)})`);
  }

  console.log(`[prune-static-export] total: ${totalRemoved} dirs, ${formatBytes(totalBytes)} reclaimed`);
}

main().catch((err) => {
  console.error("[prune-static-export] failed:", err);
  process.exit(1);
});
