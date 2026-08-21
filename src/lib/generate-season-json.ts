import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getGamesForSeasonSegment,
  getSeasonSegments,
  shutdownDb,
} from "./nba-data.ts";

const OUTPUT_DIR = path.join(process.cwd(), "public", "data", "season-games");

/**
 * Writes one JSON file per season segment (e.g. `2025-26-playoffs.json`) to
 * public/data/season-games/, mirroring getGamesForSeasonSegment's shape.
 * public/ is copied verbatim into out/ by the static export, so these are
 * fetchable at runtime from /data/season-games/<segment>.json.
 */
export async function generateSeasonJsonFiles(): Promise<void> {
  const segments = await getSeasonSegments();
  await mkdir(OUTPUT_DIR, { recursive: true });

  try {
    for (const seasonSegment of segments) {
      const games = await getGamesForSeasonSegment(seasonSegment.segment);
      const filePath = path.join(OUTPUT_DIR, `${seasonSegment.segment}.json`);
      await writeFile(filePath, JSON.stringify(games));
      console.log(`[generate-season-json] wrote ${filePath}`);
    }
  } finally {
    await shutdownDb();
  }
}
