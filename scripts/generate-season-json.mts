import { generateSeasonJsonFiles } from "../src/lib/generate-season-json.ts";

generateSeasonJsonFiles().catch((err) => {
  console.error("[generate-season-json] failed:", err);
  process.exit(1);
});
