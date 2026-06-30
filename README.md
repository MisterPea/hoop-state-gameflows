This is a [Next.js](https://nextjs.org) project for generating static NBA game pages from SQLite-backed game and play-by-play data.

## Getting Started

This repo is standardized on Node `24.13.1`.

```bash
nvm use
```

If you switch Node versions, reinstall native modules before running the app again:

```bash
npm rebuild better-sqlite3
```

The preferred reset path is a clean reinstall in the same Node 24 shell that will run the app:

```bash
rm -rf node_modules package-lock.json
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app reads from a sibling SQLite ingest repo by default. You can override the data locations with:

- `NBA_GAME_FLOW_INGEST_DIR`
- `NBA_STATS_SCHEMA_PATH`
- `NBA_STATS_DB_PATH`

If `npm run dev` fails with a `better-sqlite3` ABI error, it means the native module was installed with a different Node version than the one currently running Next.js.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
