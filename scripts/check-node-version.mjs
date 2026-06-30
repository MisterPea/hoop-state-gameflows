const requiredNodeMajor = 24;
const requiredNodeVersion = "24.13.1";
const requiredNpmMajor = 11;

const nodeVersion = process.versions.node;
const [nodeMajor] = nodeVersion.split(".").map(Number);
const npmVersion =
  process.env.npm_config_user_agent?.match(/npm\/(\d+\.\d+\.\d+)/)?.[1] ??
  null;
const [npmMajor] = (npmVersion ?? "").split(".").map(Number);

const errors = [];

if (nodeMajor !== requiredNodeMajor) {
  errors.push(
    `Expected Node ${requiredNodeVersion} (major ${requiredNodeMajor}), but found ${nodeVersion}.`,
  );
}

if (npmVersion && npmMajor !== requiredNpmMajor) {
  errors.push(
    `Expected npm ${requiredNpmMajor}.x, but found ${npmVersion}.`,
  );
}

if (errors.length > 0) {
  console.error(
    [
      "",
      "This repo is standardized on Node 24 for SQLite worker support.",
      ...errors,
      "",
      "The SQLite dependency stack includes better-sqlite3, which is a native module.",
      "It must be installed and run with the same Node.js version used for `npm run dev`.",
      "",
      "Recommended fix:",
      "1. `nvm use 24.13.1`",
      "2. Reinstall or rebuild native modules in that same shell",
      "   - preferred: remove `node_modules` and run `npm install`",
      "   - fallback: `npm rebuild better-sqlite3`",
      "",
    ].join("\n"),
  );

  process.exit(1);
}
