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

export type RotationSegment = {
  period: number;
  entrySeconds: number;
  exitSeconds: number;
};

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
    `SELECT action_type, action_sub_type, clock, period, person_id, score_home, score_away
     FROM game_actions
     WHERE game_id = ? AND action_type IN ('period', 'substitution', 'game')
     ORDER BY order_number ASC`,
    [gameId],
  ) ) as RotationEventRow[];

  const onCourt = new Set<number>();
  const segmentStart = new Map<number, { period: number; clock: number; }>();
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
    if ( player ) {
      player.segments.push( { period: entry.period, entrySeconds: entry.clock, exitSeconds } );
    }
    segmentStart.delete( personId );
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
        const team = personTeam.get( personId );
        if ( team === "home" && homeLineupTracker ) {
          homeLineupTracker.lineup = teamRoster( "home" );
        } else if ( team === "away" && awayLineupTracker ) {
          awayLineupTracker.lineup = teamRoster( "away" );
        }
      }
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
