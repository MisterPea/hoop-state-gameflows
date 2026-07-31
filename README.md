# Hoop State Gameflows 🏀

  A visual, stats-first look at NBA games — lineup rotations, score-margin trends, shot charts, and full box score.

  **Live site →** _[https://hoopstate.net](https://hoopstate.net/)_

  <br />

  <p align="center">
    By The Numbers — attempt/made comparison bars for both teams
    <img width="700" height="auto" alt="Game Flow — player rotation bars and score margin chart" src="https://github.com/user-attachments/assets/b2824be8-4ad0-45f4-9279-5ef6d34d8455" />
  </p>
    <p align="center">
      Game Flow — player rotation bars and score margin chart
      <img width="700" height="auto" alt="hoopStateScoreMargin" src="https://github.com/user-attachments/assets/cd846c28-cdda-4688-a911-bdb2c2e46c4e" />
    </p>


<p align="center">
  Shot Chart — rim/paint/mid/3PT shot locations for both teams
    <img width="700" alt="Shot Chart — rim/paint/mid/3PT shot locations for both teams" src="https://github.com/user-attachments/assets/8dfa73ff-29c1-471c-802e-a0eef5b4a07f" />
</p>
  
  ## What's here

  Each game/page is constructed from play-by-play data:

  - **Lineup & rotation bars** — who was on the floor, when, and how they performed in that stretch
  - **Score margin chart** — lead changes over the course of the game
  - **Shot chart** — makes/misses plotted on a court, filterable by zone (rim, paint, mid-range, three)
  - **Box score** — full stat lines for both teams
  - Season browsing by date, with a compact/expanded header that responds to scroll (most recent season is available - more to be added soon)

  ## Development

  **Stack:** <br />Next.js (App Router) · React · TypeScript · Sass Modules · SQLite

  Game and play-by-play data is ingested into SQLite via a companion stats ingest project, then read here through [`@misterpea/sqlite-worker-db`](https://github.com/MisterPea/sqlite-worker-db), a worker-threaded SQLite client that keeps DB access off the main thread during static generation. Every game page is pre-rendered at build time — no client-side data fetching, no API layer to keep warm.
  
  Decisions made along the way:
  - **Static generation over an API** — since the underlying data (finished games) never changes, there's no reason to serve it dynamically. Cheaper to host, faster to load.
  - **Optimistic Preload** - When a user hovers over a link for ~150ms, be it a season or game, a signal is sent to preload that link. Thus allowing us to expedite the serving of content to the user. 
  - **Components built and tested in Storybook, isolated from live data** — every chart/row/table (`ShotChart`, `GameFlowRow`,
  `BoxScoreTable`, etc.) is a pure presentational component driven entirely by props. Edge cases — bench player, overtime game,
  blowout margin — are authored directly as story args instead of hunting the ingest DB for a real game that happens to produce them.
  - **Player stint tracking** - Utilize the per-play data to construct a scoring/foul accumulation narrative for every player-stint. 
  - **Court and shot data rendered as inline SVG**, hand-mapped to real NBA court proportions rather than an approximate/placeholder layout.

  <br />

  <sub>**Disclaimer:**<br />Not affiliated with the NBA. Data used for personal/educational purposes.</sub>
