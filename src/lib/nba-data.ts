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

// Tricode - Team name mapping
const tricodeToTeamName: Record<string, string> = {
  ATL: "Atlanta Hawks",
  BOS: "Boston Celtics",
  BKN: "Brooklyn Nets",
  CHA: "Charlotte Hornets",
  CHI: "Chicago Bulls",
  CLE: "Cleveland Cavaliers",
  DAL: "Dallas Mavericks",
  DEN: "Denver Nuggets",
  DET: "Detroit Pistons",
  GSW: "Golden State Warriors",
  HOU: "Houston Rockets",
  IND: "Indiana Pacers",
  LAC: "Los Angeles Clippers",
  LAL: "Los Angeles Lakers",
  MEM: "Memphis Grizzlies",
  MIA: "Miami Heat",
  MIL: "Milwaukee Bucks",
  MIN: "Minnesota Timberwolves",
  NOP: "New Orleans Pelicans",
  NYK: "New York Knicks",
  OKC: "Oklahoma City Thunder",
  ORL: "Orlando Magic",
  PHI: "Philadelphia 76ers",
  PHX: "Phoenix Suns",
  POR: "Portland Trail Blazers",
  SAC: "Sacramento Kings",
  SAS: "San Antonio Spurs",
  TOR: "Toronto Raptors",
  UTA: "Utah Jazz",
  WAS: "Washington Wizards",
};

// Tricode - Team (nickname only) mapping
const tricodeToTeam: Record<string, string> = {
  ATL: "Hawks",
  BOS: "Celtics",
  BKN: "Nets",
  CHA: "Hornets",
  CHI: "Bulls",
  CLE: "Cavaliers",
  DAL: "Mavericks",
  DEN: "Nuggets",
  DET: "Pistons",
  GSW: "Warriors",
  HOU: "Rockets",
  IND: "Pacers",
  LAC: "Clippers",
  LAL: "Lakers",
  MEM: "Grizzlies",
  MIA: "Heat",
  MIL: "Bucks",
  MIN: "Timberwolves",
  NOP: "Pelicans",
  NYK: "Knicks",
  OKC: "Thunder",
  ORL: "Magic",
  PHI: "76ers",
  PHX: "Suns",
  POR: "Trail Blazers",
  SAC: "Kings",
  SAS: "Spurs",
  TOR: "Raptors",
  UTA: "Jazz",
  WAS: "Wizards",
};

type GameSummaryRow = {
  game_id: string;
  home_team: string;
  away_team: string;
  home_points: number;
  away_points: number;
  last_action_at: string | null;
  home_field_goals_attempted: number;
  home_field_goals_made: number;
  away_field_goals_attempted: number;
  away_field_goals_made: number;
  home_three_pointers_attempted: number;
  home_three_pointers_made: number;
  away_three_pointers_attempted: number;
  away_three_pointers_made: number;
  home_two_pointers_attempted: number;
  home_two_pointers_made: number;
  away_two_pointers_attempted: number;
  away_two_pointers_made: number;
  home_free_throws_attempted: number;
  home_free_throws_made: number;
  away_free_throws_attempted: number;
  away_free_throws_made: number;
  home_fast_break_points_attempted: number;
  home_fast_break_points_made: number;
  away_fast_break_points_attempted: number;
  away_fast_break_points_made: number;
  home_points_in_the_paint_attempted: number;
  home_points_in_the_paint_made: number;
  away_points_in_the_paint_attempted: number;
  away_points_in_the_paint_made: number;
  home_second_chance_points_attempted: number;
  home_second_chance_points_made: number;
  away_second_chance_points_attempted: number;
  away_second_chance_points_made: number;
  home_turnovers: number;
  home_turnovers_total: number;
  away_turnovers: number;
  away_turnovers_total: number;
  home_assists_turnover_ratio: number;
  away_assists_turnover_ratio: number;
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
  away_seed: number | null;
  away_wins: number | null;
  away_losses: number | null;
  game_date: string;
  game_id: string;
  home_points: number;
  home_team: string;
  home_seed: number | null;
  home_wins: number | null;
  home_losses: number | null;
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
  homeFieldGoalsAttempted: number;
  homeFieldGoalsMade: number;
  awayFieldGoalsAttempted: number;
  awayFieldGoalsMade: number;
  homeThreePointersAttempted: number;
  homeThreePointersMade: number;
  awayThreePointersAttempted: number;
  awayThreePointersMade: number;
  homeTwoPointersAttempted: number;
  homeTwoPointersMade: number;
  awayTwoPointersAttempted: number;
  awayTwoPointersMade: number;
  homeFreeThrowsAttempted: number;
  homeFreeThrowsMade: number;
  awayFreeThrowsAttempted: number;
  awayFreeThrowsMade: number;
  homeFastBreakPointsAttempted: number;
  homeFastBreakPointsMade: number;
  awayFastBreakPointsAttempted: number;
  awayFastBreakPointsMade: number;
  homePointsInThePaintAttempted: number;
  homePointsInThePaintMade: number;
  awayPointsInThePaintAttempted: number;
  awayPointsInThePaintMade: number;
  homeSecondChancePointsAttempted: number;
  homeSecondChancePointsMade: number;
  awaySecondChancePointsAttempted: number;
  awaySecondChancePointsMade: number;
  homeTurnovers: number;
  homeTurnoversTotal: number;
  awayTurnovers: number;
  awayTurnoversTotal: number;
  homeAssistsTurnoverRatio: number;
  awayAssistsTurnoverRatio: number;
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
    homeFieldGoalsAttempted: row.home_field_goals_attempted,
    homeFieldGoalsMade: row.home_field_goals_made,
    awayFieldGoalsAttempted: row.away_field_goals_attempted,
    awayFieldGoalsMade: row.away_field_goals_made,
    homeThreePointersAttempted: row.home_three_pointers_attempted,
    homeThreePointersMade: row.home_three_pointers_made,
    awayThreePointersAttempted: row.away_three_pointers_attempted,
    awayThreePointersMade: row.away_three_pointers_made,
    homeTwoPointersAttempted: row.home_two_pointers_attempted,
    homeTwoPointersMade: row.home_two_pointers_made,
    awayTwoPointersAttempted: row.away_two_pointers_attempted,
    awayTwoPointersMade: row.away_two_pointers_made,
    homeFreeThrowsAttempted: row.home_free_throws_attempted,
    homeFreeThrowsMade: row.home_free_throws_made,
    awayFreeThrowsAttempted: row.away_free_throws_attempted,
    awayFreeThrowsMade: row.away_free_throws_made,
    homeFastBreakPointsAttempted: row.home_fast_break_points_attempted,
    homeFastBreakPointsMade: row.home_fast_break_points_made,
    awayFastBreakPointsAttempted: row.away_fast_break_points_attempted,
    awayFastBreakPointsMade: row.away_fast_break_points_made,
    homePointsInThePaintAttempted: row.home_points_in_the_paint_attempted,
    homePointsInThePaintMade: row.home_points_in_the_paint_made,
    awayPointsInThePaintAttempted: row.away_points_in_the_paint_attempted,
    awayPointsInThePaintMade: row.away_points_in_the_paint_made,
    homeSecondChancePointsAttempted: row.home_second_chance_points_attempted,
    homeSecondChancePointsMade: row.home_second_chance_points_made,
    awaySecondChancePointsAttempted: row.away_second_chance_points_attempted,
    awaySecondChancePointsMade: row.away_second_chance_points_made,
    homeTurnovers: row.home_turnovers,
    homeTurnoversTotal: row.home_turnovers_total,
    awayTurnovers: row.away_turnovers,
    awayTurnoversTotal: row.away_turnovers_total,
    homeAssistsTurnoverRatio: row.home_assists_turnover_ratio,
    awayAssistsTurnoverRatio: row.away_assists_turnover_ratio,
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
      WHERE game_category IN ('regular_season', 'nba_cup', 'nba_cup_final', 'play_in', 'playoffs', 'finals')
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
        MAX(ga.time_actual) AS last_action_at,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.field_goals_attempted END) AS home_field_goals_attempted,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.field_goals_made END) AS home_field_goals_made,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.field_goals_attempted END) AS away_field_goals_attempted,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.field_goals_made END) AS away_field_goals_made,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.three_pointers_attempted END) AS home_three_pointers_attempted,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.three_pointers_made END) AS home_three_pointers_made,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.three_pointers_attempted END) AS away_three_pointers_attempted,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.three_pointers_made END) AS away_three_pointers_made,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.two_pointers_attempted END) AS home_two_pointers_attempted,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.two_pointers_made END) AS home_two_pointers_made,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.two_pointers_attempted END) AS away_two_pointers_attempted,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.two_pointers_made END) AS away_two_pointers_made,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.free_throws_attempted END) AS home_free_throws_attempted,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.free_throws_made END) AS home_free_throws_made,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.free_throws_attempted END) AS away_free_throws_attempted,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.free_throws_made END) AS away_free_throws_made,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.fast_break_points_attempted END) AS home_fast_break_points_attempted,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.fast_break_points_made END) AS home_fast_break_points_made,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.fast_break_points_attempted END) AS away_fast_break_points_attempted,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.fast_break_points_made END) AS away_fast_break_points_made,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.points_in_the_paint_attempted END) AS home_points_in_the_paint_attempted,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.points_in_the_paint_made END) AS home_points_in_the_paint_made,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.points_in_the_paint_attempted END) AS away_points_in_the_paint_attempted,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.points_in_the_paint_made END) AS away_points_in_the_paint_made,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.second_chance_points_attempted END) AS home_second_chance_points_attempted,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.second_chance_points_made END) AS home_second_chance_points_made,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.second_chance_points_attempted END) AS away_second_chance_points_attempted,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.second_chance_points_made END) AS away_second_chance_points_made,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.turnovers END) AS home_turnovers,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.turnovers_total END) AS home_turnovers_total,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.turnovers END) AS away_turnovers,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.turnovers_total END) AS away_turnovers_total,
        MAX(CASE WHEN gs.home_away = 'home' THEN gs.assists_turnover_ratio END) AS home_assists_turnover_ratio,
        MAX(CASE WHEN gs.home_away = 'away' THEN gs.assists_turnover_ratio END) AS away_assists_turnover_ratio
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
  awayTricode: string;
  awaySeed: number | null;
  awayWins: number | null;
  awayLosses: number | null;
  gameDate: string; // or DateString, see below
  gameId: string;
  homePoints: number;
  homeTeam: string;
  homeTricode: string;
  homeSeed: number | null;
  homeWins: number | null;
  homeLosses: number | null;
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
        g.home_seed,
        g.away_seed,
        g.home_wins,
        g.home_losses,
        g.away_wins,
        g.away_losses,
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
      awayTeam: tricodeToTeam[row.away_team],
      awayTricode: row.away_team,
      awaySeed: row.away_seed || null,
      awayWins: row.away_wins,
      awayLosses: row.away_losses,
      gameDate: row.game_date,
      gameId: row.game_id,
      homePoints: row.home_points,
      homeTeam: tricodeToTeam[row.home_team],
      homeTricode: row.home_team,
      homeSeed: row.home_seed || null,
      homeWins: row.home_wins,
      homeLosses: row.home_losses,
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

export type StintStats = {
  twoPointMade: number;
  twoPointAttempted: number;
  threePointMade: number;
  threePointAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  personalFouls: number;
};

export type RotationSegment = {
  period: number;
  entrySeconds: number;
  exitSeconds: number;
  stats: StintStats;
};

function emptyStintStats(): StintStats {
  return {
    twoPointMade: 0,
    twoPointAttempted: 0,
    threePointMade: 0,
    threePointAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    personalFouls: 0,
  };
}

export type PlayerRotation = {
  personId: number;
  playerName: string;
  teamTricode: string;
  homeAway: "home" | "away";
  segments: RotationSegment[];
  minutesPlayed: number;
  points: number;
  rebounds: number;
  assists: number;
  plusMinus: number;
};

export type LineupPlayer = {
  personId: number;
  playerName: string;
};

export type LineupInterval = {
  period: number;
  entrySeconds: number;
  exitSeconds: number;
  plusMinus: number;
  lineup: LineupPlayer[];
};

export type GameRotations = {
  home: PlayerRotation[];
  away: PlayerRotation[];
  homeLineups: LineupInterval[];
  awayLineups: LineupInterval[];
  overtimes: number;
};

const teamColors: Record<string, string> = {
  ATL: "#C8102E",
  BOS: "#1F9952",
  BKN: "#323232",
  CHA: "#3193A3",
  CHI: "#E3174B",
  CLE: "#A20647",
  DAL: "#206D9E",
  DEN: "#294369",
  DET: "#DB1C3B",
  GSW: "#206D9E",
  HOU: "#DF0A3C",
  IND: "#164883",
  LAC: "#BF0E2D",
  LAL: "#723BA6",
  MEM: "#86A2DC",
  MIA: "#59C3EF",
  MIL: "#47A463",
  MIN: "#24679C",
  NOP: "#18375E",
  NYK: "#3B94DB",
  OKC: "#379FDC",
  ORL: "#81B4D3",
  PHI: "#2693E0",
  PHX: "#5948BD",
  POR: "#E03A3E",
  SAC: "#654AA2",
  SAS: "#717475",
  TOR: "#CE1141",
  UTA: "#1A5291",
  WAS: "#EB2B48",
};

const teamAccentColors: Record<string, string> = {
  ATL: "#FDB927",
  BOS: "#E8BB66",
  BKN: "#FFFFFF",
  CHA: "#644AA5",
  CHI: "#343434",
  CLE: "#FDB419",
  DAL: "#B8C4CA",
  DEN: "#FEC524",
  DET: "#2D52C7",
  GSW: "#B8C4CA",
  HOU: "#343434",
  IND: "#FFB417",
  LAC: "#326AD7",
  LAL: "#FFB71C",
  MEM: "#3543B1",
  MIA: "#FF58D2",
  MIL: "#FFE9BB",
  MIN: "#89DA23",
  NOP: "#D22B46",
  NYK: "#FF943A",
  OKC: "#FF4C35",
  ORL: "#C4CED4",
  PHI: "#ED2758",
  PHX: "#FF7D3F",
  POR: "#343434",
  SAC: "#CEBDCA",
  SAS: "#343434",
  TOR: "#343434",
  UTA: "#F9A01B",
  WAS: "#003E84",
};

export function getTeamColor( tricode: string ): string {
  return teamColors[tricode] ?? "#888888";
}

export function getTeamAccentColor( tricode: string ): string {
  return teamAccentColors[tricode] ?? "#CCCCCC";
}

export function getTeamName( tricode: string ): string {
  return tricodeToTeamName[tricode] ?? tricode;
}

export function getTeamNickname( tricode: string ): string {
  return tricodeToTeam[tricode] ?? tricode;
}

type ParticipantRow = {
  person_id: number;
  name_i: string;
  team_tricode: string;
  home_away: string;
  starter: number;
  jersey_number: string | null;
  minutes_played: number;
  points: number;
  rebounds_total: number;
  assists: number;
  plus_minus: number;
};

type RotationEventRow = {
  action_type: string;
  action_sub_type: string | null;
  clock: number | null;
  period: number;
  person_id: number | null;
  score_home: number | null;
  score_away: number | null;
  shot_result: string | null;
};

export async function getPlayerRotations( gameId: string ): Promise<GameRotations> {
  const db = getDb();

  const participantRows = ( await db.getAllData(
    `SELECT person_id, name_i, team_tricode, home_away, starter, jersey_number,
            minutes_played, points, rebounds_total, assists, plus_minus
     FROM box_score_participants
     WHERE game_id = ? AND is_official = 0 AND played = 1`,
    [gameId],
  ) ) as ParticipantRow[];

  const nameCounts = new Map<string, number>();
  for ( const row of participantRows ) {
    const key = `${row.home_away}:${row.name_i}`;
    nameCounts.set( key, ( nameCounts.get( key ) ?? 0 ) + 1 );
  }

  const playerMap = new Map<number, PlayerRotation>();
  const starters = new Set<number>();

  for ( const row of participantRows ) {
    const isDuplicateName = ( nameCounts.get( `${row.home_away}:${row.name_i}` ) ?? 0 ) > 1;
    const playerName = isDuplicateName && row.jersey_number
      ? `${row.name_i} (#${row.jersey_number})`
      : row.name_i;

    playerMap.set( row.person_id, {
      personId: row.person_id,
      playerName,
      teamTricode: row.team_tricode,
      homeAway: row.home_away as "home" | "away",
      segments: [],
      minutesPlayed: row.minutes_played,
      points: row.points,
      rebounds: row.rebounds_total,
      assists: row.assists,
      plusMinus: Math.round( row.plus_minus ),
    } );
    if ( row.starter === 1 ) starters.add( row.person_id );
  }

  const personTeam = new Map<number, "home" | "away">();
  for ( const row of participantRows ) {
    personTeam.set( row.person_id, row.home_away as "home" | "away" );
  }

  const eventRows = ( await db.getAllData(
    `SELECT action_type, action_sub_type, clock, period, person_id, score_home, score_away, shot_result
     FROM game_actions
     WHERE game_id = ? AND action_type IN ('period', 'substitution', 'game', '2pt', '3pt', 'freethrow', 'foul')
     ORDER BY order_number ASC`,
    [gameId],
  ) ) as RotationEventRow[];

  const onCourt = new Set<number>();
  const segmentStart = new Map<number, { period: number; clock: number; }>();
  const currentStint = new Map<number, StintStats>();
  let inPeriod = false;
  let maxPeriod = 4;

  type LineupTracker = { period: number; entrySeconds: number; scoreDiff: number; lineup: LineupPlayer[]; };
  let homeLineupTracker: LineupTracker | null = null;
  let awayLineupTracker: LineupTracker | null = null;
  const homeLineups: LineupInterval[] = [];
  const awayLineups: LineupInterval[] = [];
  let lastScoreHome = 0;
  let lastScoreAway = 0;

  function periodDuration( period: number ) {
    return period <= 4 ? 720 : 300;
  }

  function teamRoster( team: "home" | "away" ): LineupPlayer[] {
    const roster: LineupPlayer[] = [];
    for ( const id of onCourt ) {
      if ( personTeam.get( id ) !== team ) continue;
      const player = playerMap.get( id );
      if ( player ) roster.push( { personId: id, playerName: player.playerName } );
    }
    return roster.sort( ( a, b ) => a.playerName.localeCompare( b.playerName ) );
  }

  function closeSegment( personId: number, exitSeconds: number ) {
    const entry = segmentStart.get( personId );
    if ( !entry ) return;
    const player = playerMap.get( personId );
    const stats = currentStint.get( personId ) ?? emptyStintStats();
    if ( player ) {
      player.segments.push( { period: entry.period, entrySeconds: entry.clock, exitSeconds, stats } );
    }
    segmentStart.delete( personId );
    currentStint.delete( personId );
  }

  function closeLineup( tracker: LineupTracker, list: LineupInterval[], exitSeconds: number, currentDiff: number, teamSign: 1 | -1 ) {
    if ( tracker.entrySeconds === exitSeconds ) return;
    list.push( {
      period: tracker.period,
      entrySeconds: tracker.entrySeconds,
      exitSeconds,
      plusMinus: ( currentDiff - tracker.scoreDiff ) * teamSign,
      lineup: tracker.lineup,
    } );
  }

  for ( const event of eventRows ) {
    const { action_type: type, action_sub_type: subType, period } = event;
    const clock = event.clock ?? 0;
    const personId = event.person_id;

    if ( event.score_home != null ) lastScoreHome = event.score_home;
    if ( event.score_away != null ) lastScoreAway = event.score_away;

    if ( type === "period" && subType === "start" ) {
      inPeriod = true;
      if ( period > maxPeriod ) maxPeriod = period;
      if ( period === 1 ) {
        for ( const id of starters ) onCourt.add( id );
      }
      const dur = periodDuration( period );
      for ( const id of onCourt ) {
        segmentStart.set( id, { period, clock: dur } );
        currentStint.set( id, emptyStintStats() );
      }
      const scoreDiff = lastScoreHome - lastScoreAway;
      homeLineupTracker = { period, entrySeconds: dur, scoreDiff, lineup: teamRoster( "home" ) };
      awayLineupTracker = { period, entrySeconds: dur, scoreDiff, lineup: teamRoster( "away" ) };
    } else if ( type === "period" && subType === "end" ) {
      inPeriod = false;
      for ( const id of onCourt ) closeSegment( id, 0 );
      const scoreDiff = lastScoreHome - lastScoreAway;
      if ( homeLineupTracker ) { closeLineup( homeLineupTracker, homeLineups, 0, scoreDiff, 1 ); homeLineupTracker = null; }
      if ( awayLineupTracker ) { closeLineup( awayLineupTracker, awayLineups, 0, scoreDiff, -1 ); awayLineupTracker = null; }
    } else if ( type === "game" && subType === "end" ) {
      for ( const id of onCourt ) closeSegment( id, 0 );
      const scoreDiff = lastScoreHome - lastScoreAway;
      if ( homeLineupTracker ) { closeLineup( homeLineupTracker, homeLineups, 0, scoreDiff, 1 ); homeLineupTracker = null; }
      if ( awayLineupTracker ) { closeLineup( awayLineupTracker, awayLineups, 0, scoreDiff, -1 ); awayLineupTracker = null; }
    } else if ( type === "substitution" && subType === "out" && personId != null ) {
      const team = personTeam.get( personId );
      if ( inPeriod ) {
        closeSegment( personId, clock );
        const scoreDiff = lastScoreHome - lastScoreAway;
        onCourt.delete( personId );
        if ( team === "home" && homeLineupTracker ) {
          closeLineup( homeLineupTracker, homeLineups, clock, scoreDiff, 1 );
          homeLineupTracker = { period, entrySeconds: clock, scoreDiff, lineup: teamRoster( "home" ) };
        } else if ( team === "away" && awayLineupTracker ) {
          closeLineup( awayLineupTracker, awayLineups, clock, scoreDiff, -1 );
          awayLineupTracker = { period, entrySeconds: clock, scoreDiff, lineup: teamRoster( "away" ) };
        }
      } else {
        onCourt.delete( personId );
      }
    } else if ( type === "substitution" && subType === "in" && personId != null ) {
      onCourt.add( personId );
      if ( inPeriod ) {
        segmentStart.set( personId, { period, clock } );
        currentStint.set( personId, emptyStintStats() );
        const team = personTeam.get( personId );
        if ( team === "home" && homeLineupTracker ) {
          homeLineupTracker.lineup = teamRoster( "home" );
        } else if ( team === "away" && awayLineupTracker ) {
          awayLineupTracker.lineup = teamRoster( "away" );
        }
      }
    } else if ( type === "2pt" && personId != null ) {
      const stats = currentStint.get( personId );
      if ( stats ) {
        stats.twoPointAttempted += 1;
        if ( event.shot_result === "Made" ) stats.twoPointMade += 1;
      }
    } else if ( type === "3pt" && personId != null ) {
      const stats = currentStint.get( personId );
      if ( stats ) {
        stats.threePointAttempted += 1;
        if ( event.shot_result === "Made" ) stats.threePointMade += 1;
      }
    } else if ( type === "freethrow" && personId != null ) {
      const stats = currentStint.get( personId );
      if ( stats ) {
        stats.freeThrowsAttempted += 1;
        if ( event.shot_result === "Made" ) stats.freeThrowsMade += 1;
      }
    } else if ( type === "foul" && subType === "personal" && personId != null ) {
      const stats = currentStint.get( personId );
      if ( stats ) stats.personalFouls += 1;
    }
  }

  const overtimes = Math.max( 0, maxPeriod - 4 );

  const sortPlayers = ( a: PlayerRotation, b: PlayerRotation ) => {
    if ( a.minutesPlayed !== b.minutesPlayed ) return b.minutesPlayed - a.minutesPlayed;
    return a.playerName.localeCompare( b.playerName );
  };

  const home = [...playerMap.values()].filter( p => p.homeAway === "home" ).sort( sortPlayers );
  const away = [...playerMap.values()].filter( p => p.homeAway === "away" ).sort( sortPlayers );

  return { home, away, homeLineups, awayLineups, overtimes };
}

export type ScoreMarginPoint = {
  period: number;
  clockSeconds: number;
  margin: number; // home points minus away points
  homeScore: number;
  awayScore: number;
};

export type GameScoreMargin = {
  points: ScoreMarginPoint[];
  overtimes: number;
  maxHomeLead: number;
  maxAwayLead: number;
};

export function getMaxHomeLead( points: ScoreMarginPoint[] ): number {
  return points.reduce( ( max, p ) => Math.max( max, p.margin ), 0 );
}

export function getMaxAwayLead( points: ScoreMarginPoint[] ): number {
  return points.reduce( ( max, p ) => Math.max( max, -p.margin ), 0 );
}

type ScoreEventRow = {
  action_type: string;
  action_sub_type: string | null;
  clock: number | null;
  period: number;
  score_home: number | null;
  score_away: number | null;
};

export async function getScoreMargin( gameId: string ): Promise<GameScoreMargin> {
  const db = getDb();

  function periodDuration( period: number ) {
    return period <= 4 ? 720 : 300;
  }

  const rows = ( await db.getAllData(
    `SELECT action_type, action_sub_type, clock, period, score_home, score_away
     FROM game_actions
     WHERE game_id = ?
     ORDER BY order_number ASC`,
    [gameId],
  ) ) as ScoreEventRow[];

  let cumHome = 0;
  let cumAway = 0;
  let maxPeriod = 4;
  const points: ScoreMarginPoint[] = [];

  for ( const row of rows ) {
    if ( row.score_home != null ) cumHome = row.score_home;
    if ( row.score_away != null ) cumAway = row.score_away;

    if ( row.action_type === "period" && row.action_sub_type === "start" ) {
      if ( row.period > maxPeriod ) maxPeriod = row.period;
      points.push( { period: row.period, clockSeconds: periodDuration( row.period ), margin: cumHome - cumAway, homeScore: cumHome, awayScore: cumAway } );
    } else if ( row.action_type === "period" && row.action_sub_type === "end" ) {
      points.push( { period: row.period, clockSeconds: 0, margin: cumHome - cumAway, homeScore: cumHome, awayScore: cumAway } );
    } else if ( row.score_home != null || row.score_away != null ) {
      points.push( { period: row.period, clockSeconds: row.clock ?? 0, margin: cumHome - cumAway, homeScore: cumHome, awayScore: cumAway } );
    }
  }

  return {
    points,
    overtimes: Math.max( 0, maxPeriod - 4 ),
    maxHomeLead: getMaxHomeLead( points ),
    maxAwayLead: getMaxAwayLead( points ),
  };
}

export type BoxScorePlayer = {
  personId: number;
  playerName: string;
  jerseyNumber: string | null;
  position: string | null;
  starter: boolean;
  played: boolean;
  playingStatus: "ACTIVE" | "INACTIVE";
  teamTricode: string;
  homeAway: "home" | "away";
  minutesPlayed: number;
  points: number;
  trueShootingPct: number | null;
  usagePct: number | null;
  per: number | null;
  rebounds: number;
  reboundsOffensive: number;
  reboundsDefensive: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  freeThrowPct: number;
  twoPointMade: number;
  twoPointAttempted: number;
  twoPointPct: number;
  threePointMade: number;
  threePointAttempted: number;
  threePointPct: number;
  plusMinus: number;
};

export type GameBoxScore = {
  home: BoxScorePlayer[];
  away: BoxScorePlayer[];
};

// League-average constants (VOP/factor/DRB%, pace, PER normalization) used to turn a single
// game's raw box line into a Hollinger-style PER. These are season-wide aggregates, expensive
// to compute, and identical for every game in a season, so they're cached per season.
type LeagueContext = {
  vop: number;
  factor: number;
  drbp: number;
  ftPerPf: number;
  ftaPerPf: number;
  lgPace: number;
  normConstant: number;
  teamAstToFg: Map<string, number>;
  teamPace: Map<string, number>;
};

type LeagueTotalsRow = {
  team_tricode?: string;
  pts: number;
  fg: number;
  fga: number;
  tpm: number;
  ast: number;
  orb: number;
  trb: number;
  tov: number;
  ft: number;
  fta: number;
  pf: number;
  stl: number;
  blk: number;
  mp: number;
};

type TeamGameStatRow = {
  game_id: string;
  team_tricode: string;
  home_away: string;
  fga: number;
  fgm: number;
  fta: number;
  orb: number;
  drb: number;
  tov: number;
};

type TeamMinutesRow = {
  game_id: string;
  team_tricode: string;
  team_minutes: number;
};

const LEAGUE_TOTALS_SELECT = `
  SUM(bsp.points) AS pts, SUM(bsp.field_goals_made) AS fg, SUM(bsp.field_goals_attempted) AS fga,
  SUM(bsp.three_point_made) AS tpm, SUM(bsp.assists) AS ast,
  SUM(bsp.rebounds_offensive) AS orb, SUM(bsp.rebounds_total) AS trb, SUM(bsp.turnovers) AS tov,
  SUM(bsp.free_throws_made) AS ft, SUM(bsp.free_throws_attempted) AS fta,
  SUM(bsp.fouls_personal) AS pf, SUM(bsp.steals) AS stl, SUM(bsp.blocks) AS blk,
  SUM(bsp.minutes_played) AS mp
`;

async function computeLeagueContext( season: string ): Promise<LeagueContext> {
  const db = getDb();

  const [lgTotals] = ( await db.getAllData(
    `SELECT ${LEAGUE_TOTALS_SELECT}
     FROM box_score_participants bsp
     JOIN games g ON g.game_id = bsp.game_id
     WHERE g.season = ? AND bsp.is_official = 0 AND bsp.played = 1`,
    [season],
  ) ) as LeagueTotalsRow[];

  const teamTotalsRows = ( await db.getAllData(
    `SELECT bsp.team_tricode, ${LEAGUE_TOTALS_SELECT}
     FROM box_score_participants bsp
     JOIN games g ON g.game_id = bsp.game_id
     WHERE g.season = ? AND bsp.is_official = 0 AND bsp.played = 1
     GROUP BY bsp.team_tricode`,
    [season],
  ) ) as LeagueTotalsRow[];

  const teamGameStatRows = ( await db.getAllData(
    `SELECT gs.game_id, gs.team_tricode, gs.home_away,
            gs.field_goals_attempted AS fga, gs.field_goals_made AS fgm,
            gs.free_throws_attempted AS fta, gs.rebounds_offensive AS orb,
            gs.rebounds_defensive AS drb, gs.turnovers_total AS tov
     FROM game_statistics gs
     JOIN games g ON g.game_id = gs.game_id
     WHERE g.season = ?`,
    [season],
  ) ) as TeamGameStatRow[];

  const teamMinutesRows = ( await db.getAllData(
    `SELECT bsp.game_id, bsp.team_tricode, SUM(bsp.minutes_played) AS team_minutes
     FROM box_score_participants bsp
     JOIN games g ON g.game_id = bsp.game_id
     WHERE g.season = ? AND bsp.is_official = 0 AND bsp.played = 1
     GROUP BY bsp.game_id, bsp.team_tricode`,
    [season],
  ) ) as TeamMinutesRow[];

  const gameStatsByGame = new Map<string, { home?: TeamGameStatRow; away?: TeamGameStatRow; }>();
  for ( const row of teamGameStatRows ) {
    const entry = gameStatsByGame.get( row.game_id ) ?? {};
    if ( row.home_away === "home" ) entry.home = row; else entry.away = row;
    gameStatsByGame.set( row.game_id, entry );
  }

  const teamMinutesByGame = new Map<string, number>();
  for ( const row of teamMinutesRows ) {
    teamMinutesByGame.set( `${row.game_id}:${row.team_tricode}`, row.team_minutes );
  }

  // Pace (possessions per 48 min) needs both teams' box totals for a game, since it's
  // estimated from combined possessions. It's shared by both teams for that single game.
  let lgPaceSum = 0;
  let lgPaceCount = 0;
  const teamPaceSum = new Map<string, number>();
  const teamPaceCount = new Map<string, number>();

  for ( const { home, away } of gameStatsByGame.values() ) {
    if ( !home || !away ) continue;
    const gameId = home.game_id;
    const teamMinutes = teamMinutesByGame.get( `${gameId}:${home.team_tricode}` )
      ?? teamMinutesByGame.get( `${gameId}:${away.team_tricode}` );
    if ( !teamMinutes ) continue;

    const homePoss = home.fga + 0.4 * home.fta
      - 1.07 * ( home.orb / ( home.orb + away.drb || 1 ) ) * ( home.fga - home.fgm )
      + home.tov;
    const awayPoss = away.fga + 0.4 * away.fta
      - 1.07 * ( away.orb / ( away.orb + home.drb || 1 ) ) * ( away.fga - away.fgm )
      + away.tov;
    const gamePace = 48 * ( ( homePoss + awayPoss ) / 2 ) / ( teamMinutes / 5 );

    lgPaceSum += gamePace;
    lgPaceCount += 1;
    teamPaceSum.set( home.team_tricode, ( teamPaceSum.get( home.team_tricode ) ?? 0 ) + gamePace );
    teamPaceCount.set( home.team_tricode, ( teamPaceCount.get( home.team_tricode ) ?? 0 ) + 1 );
    teamPaceSum.set( away.team_tricode, ( teamPaceSum.get( away.team_tricode ) ?? 0 ) + gamePace );
    teamPaceCount.set( away.team_tricode, ( teamPaceCount.get( away.team_tricode ) ?? 0 ) + 1 );
  }

  const lgPace = lgPaceCount > 0 ? lgPaceSum / lgPaceCount : 100;
  const teamPace = new Map<string, number>();
  for ( const [team, sum] of teamPaceSum ) {
    teamPace.set( team, sum / ( teamPaceCount.get( team ) ?? 1 ) );
  }

  const factor = ( 2 / 3 ) - ( 0.5 * ( lgTotals.ast / lgTotals.fg ) ) / ( 2 * ( lgTotals.fg / lgTotals.ft ) );
  const vop = lgTotals.pts / ( lgTotals.fga - lgTotals.orb + lgTotals.tov + 0.44 * lgTotals.fta );
  const drbp = ( lgTotals.trb - lgTotals.orb ) / lgTotals.trb;
  const ftPerPf = lgTotals.ft / lgTotals.pf;
  const ftaPerPf = lgTotals.fta / lgTotals.pf;

  function rawUPerSum( t: LeagueTotalsRow, astToFg: number ) {
    return t.tpm
      + ( 2 / 3 ) * t.ast
      + ( 2 - factor * astToFg ) * t.fg
      + t.ft * 0.5 * ( 1 + ( 1 - astToFg ) + ( 2 / 3 ) * astToFg )
      - vop * t.tov
      - vop * drbp * ( t.fga - t.fg )
      - vop * 0.44 * ( 0.44 + 0.56 * drbp ) * ( t.fta - t.ft )
      + vop * ( 1 - drbp ) * ( t.trb - t.orb )
      + vop * drbp * t.orb
      + vop * t.stl
      + vop * drbp * t.blk
      - t.pf * ( ftPerPf - 0.44 * ftaPerPf * vop );
  }

  // By linearity of uPER in the box-score categories, the minutes-weighted average uPER across
  // a group of players equals uPER computed on that group's *summed* stats. That lets the
  // per-team and league-wide normalization constants be derived from aggregate SQL sums instead
  // of looping over every individual player-game in the season.
  const teamAstToFg = new Map<string, number>();
  let paceAdjSum = 0;
  let mpSum = 0;

  for ( const t of teamTotalsRows ) {
    if ( !t.team_tricode || !t.fg ) continue;
    const astToFg = t.ast / t.fg;
    teamAstToFg.set( t.team_tricode, astToFg );
    const pace = teamPace.get( t.team_tricode ) ?? lgPace;
    paceAdjSum += rawUPerSum( t, astToFg ) * ( lgPace / pace );
    mpSum += t.mp;
  }

  const lgAvgPaceAdjUPer = mpSum > 0 ? paceAdjSum / mpSum : 1;
  const normConstant = lgAvgPaceAdjUPer !== 0 ? 15 / lgAvgPaceAdjUPer : 1;

  return { vop, factor, drbp, ftPerPf, ftaPerPf, lgPace, normConstant, teamAstToFg, teamPace };
}

const leagueContextCache = new Map<string, Promise<LeagueContext>>();

function getLeagueContext( season: string ): Promise<LeagueContext> {
  let cached = leagueContextCache.get( season );
  if ( !cached ) {
    cached = computeLeagueContext( season );
    leagueContextCache.set( season, cached );
  }
  return cached;
}

type BoxScoreParticipantRow = {
  person_id: number;
  name_i: string;
  team_tricode: string;
  home_away: string;
  starter: number;
  played: number;
  jersey_number: string | null;
  position: string | null;
  playing_status: string;
  minutes_played: number;
  points: number;
  assists: number;
  blocks: number;
  steals: number;
  turnovers: number;
  fouls_personal: number;
  rebounds_offensive: number;
  rebounds_defensive: number;
  rebounds_total: number;
  field_goals_made: number;
  field_goals_attempted: number;
  two_point_made: number;
  two_point_attempts: number;
  two_point_pct: number;
  three_point_made: number;
  three_point_attempts: number;
  three_point_pct: number;
  free_throws_made: number;
  free_throws_attempted: number;
  free_throw_pct: number;
  plus_minus: number;
};

type TeamBoxTotalsRow = {
  team_tricode: string;
  field_goals_attempted: number;
  free_throws_attempted: number;
  turnovers_total: number;
};

export async function getBoxScorePlayers( gameId: string ): Promise<GameBoxScore> {
  const db = getDb();

  const gameRow = ( await db.getData(
    `SELECT season FROM games WHERE game_id = ?`,
    [gameId],
  ) ) as { season: string; } | undefined;

  const participantRows = ( await db.getAllData(
    `SELECT person_id, name_i, team_tricode, home_away, starter, played,
            jersey_number, position, playing_status, minutes_played,
            points, assists, blocks, steals, turnovers, fouls_personal,
            rebounds_offensive, rebounds_defensive, rebounds_total,
            field_goals_made, field_goals_attempted,
            two_point_made, two_point_attempts, two_point_pct,
            three_point_made, three_point_attempts, three_point_pct,
            free_throws_made, free_throws_attempted, free_throw_pct,
            plus_minus
     FROM box_score_participants
     WHERE game_id = ? AND is_official = 0`,
    [gameId],
  ) ) as BoxScoreParticipantRow[];

  const teamTotalsRows = ( await db.getAllData(
    `SELECT team_tricode, field_goals_attempted, free_throws_attempted, turnovers_total
     FROM game_statistics
     WHERE game_id = ?`,
    [gameId],
  ) ) as TeamBoxTotalsRow[];

  const teamMinutes = new Map<string, number>();
  for ( const row of participantRows ) {
    if ( row.played !== 1 ) continue;
    teamMinutes.set( row.team_tricode, ( teamMinutes.get( row.team_tricode ) ?? 0 ) + row.minutes_played );
  }

  const teamBoxTotals = new Map<string, TeamBoxTotalsRow>();
  for ( const row of teamTotalsRows ) {
    teamBoxTotals.set( row.team_tricode, row );
  }

  const leagueContext = gameRow ? await getLeagueContext( gameRow.season ) : null;

  function mapPlayer( row: BoxScoreParticipantRow ): BoxScorePlayer {
    const played = row.played === 1;
    const minutes = row.minutes_played;

    let trueShootingPct: number | null = null;
    let usagePct: number | null = null;
    let per: number | null = null;

    if ( played && minutes > 0 ) {
      const tsaDenominator = 2 * ( row.field_goals_attempted + 0.44 * row.free_throws_attempted );
      trueShootingPct = tsaDenominator > 0 ? row.points / tsaDenominator : 0;

      const teamTotals = teamBoxTotals.get( row.team_tricode );
      const tmMinutes = teamMinutes.get( row.team_tricode );
      if ( teamTotals && tmMinutes ) {
        const usageDenominator = teamTotals.field_goals_attempted
          + 0.44 * teamTotals.free_throws_attempted
          + teamTotals.turnovers_total;
        usagePct = usageDenominator > 0
          ? 100 * ( ( row.field_goals_attempted + 0.44 * row.free_throws_attempted + row.turnovers ) * ( tmMinutes / 5 ) )
          / ( minutes * usageDenominator )
          : 0;
      }

      if ( leagueContext ) {
        const { vop, factor, drbp, ftPerPf, ftaPerPf, lgPace, normConstant } = leagueContext;
        const astToFg = leagueContext.teamAstToFg.get( row.team_tricode ) ?? 0;

        const rawUPer = row.three_point_made
          + ( 2 / 3 ) * row.assists
          + ( 2 - factor * astToFg ) * row.field_goals_made
          + row.free_throws_made * 0.5 * ( 1 + ( 1 - astToFg ) + ( 2 / 3 ) * astToFg )
          - vop * row.turnovers
          - vop * drbp * ( row.field_goals_attempted - row.field_goals_made )
          - vop * 0.44 * ( 0.44 + 0.56 * drbp ) * ( row.free_throws_attempted - row.free_throws_made )
          + vop * ( 1 - drbp ) * ( row.rebounds_total - row.rebounds_offensive )
          + vop * drbp * row.rebounds_offensive
          + vop * row.steals
          + vop * drbp * row.blocks
          - row.fouls_personal * ( ftPerPf - 0.44 * ftaPerPf * vop );

        const teamPace = leagueContext.teamPace.get( row.team_tricode ) ?? lgPace;
        per = ( rawUPer / minutes ) * ( lgPace / teamPace ) * normConstant;
      }
    }

    return {
      personId: row.person_id,
      playerName: row.name_i,
      jerseyNumber: row.jersey_number,
      position: row.position,
      starter: row.starter === 1,
      played,
      playingStatus: row.playing_status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      teamTricode: row.team_tricode,
      homeAway: row.home_away as "home" | "away",
      minutesPlayed: minutes,
      points: row.points,
      trueShootingPct,
      usagePct,
      per,
      reboundsOffensive: row.rebounds_offensive,
      reboundsDefensive: row.rebounds_defensive,
      rebounds: row.rebounds_total,
      assists: row.assists,
      steals: row.steals,
      blocks: row.blocks,
      turnovers: row.turnovers,
      personalFouls: row.fouls_personal,
      freeThrowsMade: row.free_throws_made,
      freeThrowsAttempted: row.free_throws_attempted,
      freeThrowPct: row.free_throw_pct,
      twoPointMade: row.two_point_made,
      twoPointAttempted: row.two_point_attempts,
      twoPointPct: row.two_point_pct,
      threePointMade: row.three_point_made,
      threePointAttempted: row.three_point_attempts,
      threePointPct: row.three_point_pct,
      plusMinus: Math.round( row.plus_minus ),
    };
  }

  const players = participantRows.map( mapPlayer );

  const sortPlayers = ( a: BoxScorePlayer, b: BoxScorePlayer ) => {
    if ( a.played !== b.played ) return a.played ? -1 : 1;
    if ( a.starter !== b.starter ) return a.starter ? -1 : 1;
    if ( a.minutesPlayed !== b.minutesPlayed ) return b.minutesPlayed - a.minutesPlayed;
    if ( a.playingStatus !== b.playingStatus ) return a.playingStatus === "ACTIVE" ? -1 : 1;
    return a.playerName.localeCompare( b.playerName );
  };

  return {
    home: players.filter( p => p.homeAway === "home" ).sort( sortPlayers ),
    away: players.filter( p => p.homeAway === "away" ).sort( sortPlayers ),
  };
}

export type ShotZone = "rim" | "paint" | "mid" | "three";

export type ShotChartPoint = {
  actionNumber: number;
  x: number; // 0-100, normalized so every shot for a team lands on the same half-court
  y: number; // 0-100
  made: boolean;
  zone: ShotZone;
  period: number;
  clockSeconds: number;
  description: string;
};

export type GameShotChart = {
  home: ShotChartPoint[];
  away: ShotChartPoint[];
};

type ShotActionRow = {
  action_number: number;
  team_tricode: string;
  home_away: string;
  period: number;
  clock: number | null;
  x: number | null;
  y: number | null;
  side: string | null;
  shot_result: string | null;
  area: string | null;
  shot_distance: number | null;
  play_description: string | null;
};

// Pre-2022-23 games have no `area` from the source API. When it's missing, derive the
// zone from shot_distance and court position instead. x/y here are already mirrored so
// every shot lands on the same half: 100 x-units span the 94ft court length (baseline at
// x=0), 100 y-units span the 50ft width. Backtested against ~938k shots that do have a
// real `area` label: 98.4% agreement.
function deriveShotZone( x: number, y: number, shotDistance: number | null ): ShotZone {
  if ( shotDistance === null ) return "mid";
  if ( shotDistance <= 4.4 ) return "rim";

  const xFeet = x * 0.94;
  const centerOffsetFeet = Math.abs( y * 0.5 - 25 );

  const isCornerThree = xFeet <= 13 && centerOffsetFeet >= 21;
  if ( isCornerThree || shotDistance >= 23.5 ) return "three";

  const inPaint = xFeet <= 19 && centerOffsetFeet <= 8;
  return inPaint ? "paint" : "mid";
}

function shotZone( row: ShotActionRow, x: number, y: number ): ShotZone {
  switch ( row.area ) {
    case "Restricted Area": return "rim";
    case "In The Paint (Non-RA)": return "paint";
    case "Mid-Range": return "mid";
    case "Left Corner 3":
    case "Right Corner 3":
    case "Above the Break 3": return "three";
    default: return deriveShotZone( x, y, row.shot_distance );
  }
}

export async function getShotChartData( gameId: string ): Promise<GameShotChart> {
  const db = getDb();

  const rows = ( await db.getAllData(
    `
      SELECT
        ga.action_number,
        ga.team_tricode,
        gs.home_away,
        ga.period,
        ga.clock,
        ga.x,
        ga.y,
        ga.side,
        ga.shot_result,
        ga.area,
        ga.shot_distance,
        ga.play_description
      FROM game_actions ga
      JOIN game_statistics gs ON gs.game_id = ga.game_id AND gs.team_tricode = ga.team_tricode
      WHERE ga.game_id = ? AND ga.is_field_goal = 1 AND ga.x IS NOT NULL AND ga.y IS NOT NULL
      ORDER BY ga.action_number ASC
    `,
    [gameId],
  ) ) as ShotActionRow[];

  const home: ShotChartPoint[] = [];
  const away: ShotChartPoint[] = [];

  for ( const row of rows ) {
    const rawX = row.x ?? 0;
    const rawY = row.y ?? 0;
    // Teams switch baskets each half; mirror "right" side shots so every attempt
    // for a team lands on the same half of the court.
    const x = row.side === "right" ? 100 - rawX : rawX;
    const y = row.side === "right" ? 100 - rawY : rawY;

    const point: ShotChartPoint = {
      actionNumber: row.action_number,
      x,
      y,
      made: row.shot_result === "Made",
      zone: shotZone( row, x, y ),
      period: row.period,
      clockSeconds: row.clock ?? 0,
      description: row.play_description ?? "",
    };

    ( row.home_away === "home" ? home : away ).push( point );
  }

  return { home, away };
}
