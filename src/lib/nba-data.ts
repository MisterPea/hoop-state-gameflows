import "server-only";
import path from "node:path";
import { DB, type DbMethods } from "@misterpea/sqlite-worker-db";

// Tricode - City mapping
const tricodeToCity: Record<string, string> = {
  ATL: "Atlanta",
  BOS: "Boston",
  BKN: "Brooklyn",
  CHA: "Charlotte",
  CHI: "Chicago",
  CLE: "Cleveland",
  DAL: "Dallas",
  DEN: "Denver",
  DET: "Detroit",
  GSW: "Golden State",
  HOU: "Houston",
  IND: "Indiana",
  LAC: "LA Clippers",
  LAL: "LA Lakers",
  MEM: "Memphis",
  MIA: "Miami",
  MIL: "Milwaukee",
  MIN: "Minnesota",
  NOP: "New Orleans",
  NYK: "New York",
  OKC: "Oklahoma City",
  ORL: "Orlando",
  PHI: "Philadelphia",
  PHX: "Phoenix",
  POR: "Portland",
  SAC: "Sacramento",
  SAS: "San Antonio",
  TOR: "Toronto",
  UTA: "Utah",
  WAS: "Washington",
};


type GameSummaryRow = {
  game_id: string;
  home_team: string;
  away_team: string;
  home_points: number;
  away_points: number;
  last_action_at: string | null;
};

type GameActionRow = {
  action_number: number;
  period: number;
  clock: number | null;
  team_tricode: string | null;
  action_type: string;
  action_sub_type: string | null;
  player_name_i: string | null;
  score_home: number | null;
  score_away: number | null;
  play_description: string | null;
};

type SeasonGameSummaryRow = {
  away_points: number;
  away_team: string;
  game_date: string;
  game_id: string;
  home_points: number;
  home_team: string;
  game_label: string;
  game_sub_label: string;
};

export type GameSummary = {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homePoints: number;
  awayPoints: number;
  lastActionAt: string | null;
};

export type GameAction = {
  actionNumber: number;
  period: number;
  clock: number | null;
  teamTricode: string | null;
  actionType: string;
  actionSubType: string | null;
  playerName: string | null;
  scoreHome: number | null;
  scoreAway: number | null;
  playDescription: string | null;
};

export type SeasonSegment = {
  categories: string[];
  href: string;
  label: string;
  season: string;
  segment: string;
};

// export type SeasonGameSummary = {
//   awayPoints: number;
//   awayTeam: string;
//   gameDate: string;
//   gameId: string;
//   homePoints: number;
//   homeTeam: string;
// };

declare global {
  // eslint-disable-next-line no-var
  var __nbaGameFlowDb: DbMethods | undefined;
}

function resolveDataPaths() {
  const ingestRoot =
    process.env.NBA_GAME_FLOW_INGEST_DIR ??
    path.resolve( process.cwd(), "../nba-game-flow-ingest" );

  const schemaPath =
    process.env.NBA_STATS_SCHEMA_PATH ??
    path.resolve( ingestRoot, "src/db/schema.sql" );

  const dbPath =
    process.env.NBA_STATS_DB_PATH ??
    path.resolve( ingestRoot, "src/db/nba_stats.db" );

  return { schemaPath, dbPath };
}

function getDb() {
  if ( !globalThis.__nbaGameFlowDb ) {
    const { schemaPath, dbPath } = resolveDataPaths();

    globalThis.__nbaGameFlowDb = new DB( {
      schemaPath,
      dbPath,
    } );
  }

  return globalThis.__nbaGameFlowDb;
}

function mapGameSummary( row: GameSummaryRow ): GameSummary {
  return {
    gameId: row.game_id,
    homeTeam: tricodeToCity[row.home_team],
    awayTeam: tricodeToCity[row.away_team],
    homePoints: row.home_points,
    awayPoints: row.away_points,
    lastActionAt: row.last_action_at,
  };
}

function mapGameAction( row: GameActionRow ): GameAction {
  return {
    actionNumber: row.action_number,
    period: row.period,
    clock: row.clock,
    teamTricode: row.team_tricode,
    actionType: row.action_type,
    actionSubType: row.action_sub_type,
    playerName: row.player_name_i,
    scoreHome: row.score_home,
    scoreAway: row.score_away,
    playDescription: row.play_description,
  };
}

function slugifySeasonSegment( value: string ) {
  return value
    .toLowerCase()
    .replaceAll( /[^a-z0-9]+/g, "-" )
    .replaceAll( /^-+|-+$/g, "" );
}

function buildSeasonSegment(
  season: string,
  labelSuffix: string,
  segmentSuffix: string,
  categories: string[],
): SeasonSegment {
  const label = `${season} ${labelSuffix}`;
  const segment = slugifySeasonSegment( `${season}-${segmentSuffix}` );

  return {
    categories,
    href: `/seasons/${segment}`,
    label,
    season,
    segment,
  };
}

export async function getAllGameIds() {
  const db = getDb();
  const rows = ( await db.getAllData(
    `
      SELECT DISTINCT game_id
      FROM games
      ORDER BY game_id DESC
    `,
  ) ) as Array<{ game_id: string; }>;

  return rows.map( ( row ) => row.game_id );
}

export async function getGameSummary( gameId: string ) {
  const db = getDb();
  const row = ( await db.getData(
    `
      SELECT
        gs.game_id,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.team_tricode END) AS home_team,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.team_tricode END) AS away_team,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.points END) AS home_points,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.points END) AS away_points,
        MAX(ga.time_actual) AS last_action_at
      FROM game_statistics gs
      LEFT JOIN game_actions ga ON ga.game_id = gs.game_id
      WHERE gs.game_id = ?
      GROUP BY gs.game_id
    `,
    [gameId],
  ) ) as GameSummaryRow | undefined;

  return row ? mapGameSummary( row ) : null;
}

export async function getRecentGameActions( gameId: string, limit = 20 ) {
  const db = getDb();
  const rows = ( await db.getAllData(
    `
      SELECT
        action_number,
        period,
        clock,
        team_tricode,
        action_type,
        action_sub_type,
        player_name_i,
        score_home,
        score_away,
        play_description
      FROM game_actions
      WHERE game_id = ?
      ORDER BY action_number DESC
      LIMIT ?
    `,
    [gameId, limit],
  ) ) as GameActionRow[];

  return rows.map( mapGameAction );
}

export async function getSeasonSegments(): Promise<SeasonSegment[]> {
  const db = getDb();
  const rows = ( await db.getAllData(
    `
      SELECT DISTINCT
        season,
        game_category
      FROM games
      WHERE game_category IN ('regular_season', 'nba_cup', 'nba_cup_final', 'play_in', 'playoffs', 'finals')
      ORDER BY season DESC, game_category ASC
    `,
  ) ) as Array<{ game_category: string; season: string; }>;

  const grouped = new Map<string, Set<string>>();

  rows.forEach( ( row ) => {
    const current = grouped.get( row.season ) ?? new Set<string>();
    current.add( row.game_category );
    grouped.set( row.season, current );
  } );

  const items: SeasonSegment[] = [];

  Array.from( grouped.entries() )
    .sort( ( [seasonA], [seasonB] ) => seasonB.localeCompare( seasonA ) )
    .forEach( ( [season, categories] ) => {
      if ( categories.has( "playoffs" ) || categories.has( "finals" ) ) {
        items.push(
          buildSeasonSegment( season, "Playoffs", "playoffs", ["playoffs", "finals"] ),
        );
      }

      if ( categories.has( "nba_cup" ) || categories.has( "nba_cup_final" ) ) {
        items.push(
          buildSeasonSegment( season, "NBA Cup", "nba-cup", ["nba_cup", "nba_cup_final"] ),
        );
      }

      if ( categories.has( "play_in" ) ) {
        items.push(
          buildSeasonSegment( season, "Play-In", "play-in", ["play_in"] ),
        );
      }

      if ( categories.has( "regular_season" ) ) {
        items.push(
          buildSeasonSegment( season, "Regular Season", "regular-season", ["regular_season"] ),
        );
      }
    } );

  return items;
}

export async function getSeasonSegment( segment: string ) {
  const items = await getSeasonSegments();
  return items.find( ( item ) => item.segment === segment ) ?? null;
}

export type ConsolidatedGameSummary = {
  awayPoints: number;
  awayTeam: string;
  gameDate: string; // or DateString, see below
  gameId: string;
  homePoints: number;
  homeTeam: string;
  gameLabel: string | null;
  gameSubLabel: string | null;
};

type GamesByDate = Record<string, GameSummary[]>;

/**
 * Returns all games for specified season segment. Returned as keyed array of objects
 */
export async function getGamesForSeasonSegment( segment: string ): Promise<Record<string, ConsolidatedGameSummary[]>> {

  const db = getDb();
  const seasonSegment = await getSeasonSegment( segment );

  if ( !seasonSegment ) {
    return {};
  }

  const categoryPlaceholders = seasonSegment.categories.map( () => "?" ).join( ", " );
  const rows = ( await db.getAllData(
    `
      SELECT
        g.game_id,
        g.game_date,
        g.game_label,
        g.game_sub_label,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.team_tricode END) AS home_team,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.team_tricode END) AS away_team,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.points END) AS home_points,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.points END) AS away_points
      FROM games g
      LEFT JOIN game_statistics gs ON gs.game_id = g.game_id
      WHERE g.season = ?
        AND g.game_category IN (${categoryPlaceholders})
      GROUP BY g.game_date,g.game_id
      ORDER BY g.game_date DESC, g.game_id DESC
    `,
    [seasonSegment.season, ...seasonSegment.categories],
  ) ) as SeasonGameSummaryRow[];


  // Pack up output into date-keyed array of objects: YYYY-MM-DD:[{data}, {data}]
  const gameRowObject: Record<string, any> = {};
  rows.forEach( ( row ) => {
    const d = gameRowObject[row.game_date];
    const currGame = {
      awayPoints: row.away_points,
      awayTeam: tricodeToCity[row.away_team],
      gameDate: row.game_date,
      gameId: row.game_id,
      homePoints: row.home_points,
      homeTeam: tricodeToCity[row.home_team],
      gameLabel: row.game_label || null,
      gameSubLabel: row.game_sub_label || null
    };
    if ( row.game_date in gameRowObject ) {
      gameRowObject[row.game_date] = [...d, currGame];
    } else {
      gameRowObject[row.game_date] = [currGame];
    }
  } );

  return gameRowObject;

}

export async function getDateSections(): Promise<Record<string, string[]>> {
  const dateSections: Record<string, string[]> = {};
  const items = await getSeasonSegments();

  items.forEach( ( item ) => {
    dateSections[item.label] = item.categories.map(
      ( category ) => `${item.season}__${category}`,
    );
  } );

  return dateSections;
}

/**
 * @param {string[]} gameCategories Array of year categories in the format YYYY__category
 */
export async function getGamesBySection( gameCategories: string[] ) {
  const db = getDb();
  const conditions = gameCategories.map( () => "(season = ? AND game_category = ?)" ).join( " OR " );
  const params = gameCategories.flatMap( ( currentCategory ) => {
    const [season, gameCategory] = currentCategory.split( "__" );
    return [season, gameCategory];
  } );

  return db.getAllData(
    `
      SELECT game_id, game_date
      FROM games
      WHERE ${conditions}
      ORDER BY game_date DESC, game_id DESC
    `,
    params,
  );
}

export async function getOfficials( gameId: string ) {
  const db = getDb();
  const rows = await db.getAllData(
    `SELECT official_assignment, name_i
     FROM box_score_participants
     WHERE game_id = ? AND is_official = 1`,
    [gameId],
  ) as Array<{ official_assignment: string; name_i: string; }>;

  const keyMap: Record<string, string> = {
    '1': 'referee1',
    '2': 'referee2',
    '3': 'referee3',
    'ALT': 'refereeAlt',
  };

  return Object.fromEntries(
    rows.flatMap( ( { official_assignment, name_i } ) => {
      const suffix = official_assignment.includes( 'ALT' ) ? 'ALT' : official_assignment.match( /\d$/ )?.[0];
      const key = suffix ? keyMap[suffix] : null;
      return key ? [[key, name_i]] : [];
    } ),
  ) as Record<string, string>;
}

export async function getDate( gameId: string ) {
  const db = getDb();
  const date = await db.getData( `
    SELECT game_date FROM games WHERE game_id = ?
    `, [gameId] );
  if ( date ) return date.game_date;
  else return null;
}


