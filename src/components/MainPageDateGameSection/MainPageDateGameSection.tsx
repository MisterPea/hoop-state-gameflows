import type { ConsolidatedGameSummary } from "@/lib/nba-data";
import { formatGameDate } from "@/lib/format-date";
import styles from "./MainPageDateGameSection.module.scss";
import MainPageGameCard from "../MainPageGameCard/MainPageGameCard";

type Props = {
  gamesData: Record<string, ConsolidatedGameSummary[]>;
};

const ROW_WIDTH = 3;

type DateGroup = {
  date: string;
  games: ConsolidatedGameSummary[];
  span: number;
};

// Lays dates out left-to-right, capping each at ROW_WIDTH card-widths.
// Whenever a row can't be filled exactly (the next date doesn't fit the
// remaining columns, or the list runs out), the leftover width is handed
// to the last date placed in that row instead of left blank — so a lone
// or lightly-loaded day stretches to fill the row rather than leaving
// empty grid tracks next to it.
function computeDateGroups( gamesData: Record<string, ConsolidatedGameSummary[]> ): DateGroup[] {
  const groups: DateGroup[] = Object.entries( gamesData ).map( ( [date, games] ) => ( {
    date,
    games,
    span: Math.min( games.length, ROW_WIDTH ),
  } ) );

  let rowRemaining = ROW_WIDTH;
  let rowStart = 0;

  const closeRow = ( endExclusive: number ) => {
    if ( endExclusive === rowStart ) return;
    if ( rowRemaining > 0 ) {
      groups[endExclusive - 1].span += rowRemaining;
    }
    rowRemaining = ROW_WIDTH;
    rowStart = endExclusive;
  };

  groups.forEach( ( group, i ) => {
    if ( group.span > rowRemaining ) {
      closeRow( i );
    }
    rowRemaining -= group.span;
  } );
  closeRow( groups.length );

  return groups;
}

function columnCountClass( gameCount: number ) {
  if ( gameCount <= 1 ) return styles.countOne;
  if ( gameCount === 2 ) return styles.countTwo;
  return styles.countThreePlus;
}

export default function MainPageDateGameSection( { gamesData }: Props ) {
  const dateGroups = computeDateGroups( gamesData );

  return (
    <>
      {dateGroups.map( ( { date, games, span } ) => (
        <section
          key={date}
          className={styles.gameDateSection}
          style={{ gridColumn: `span ${span}` }}
        >
          <h3 className={`${styles.dateTitle}`}>{formatGameDate( date )}</h3>
          <ul className={`${styles.gameDateSectionUl} ${columnCountClass( games.length )}`}>
            {games.map( ( game ) => (
              < li key={`${date}-${game.gameId}`} className={styles.gameDateSectionLi}>
                <MainPageGameCard
                  homeTeam={game.homeTeam}
                  homeTricode={game.homeTricode}
                  homePoints={game.homePoints}
                  homeSeed={game.homeSeed}
                  homeWins={game.homeWins}
                  homeLosses={game.homeLosses}
                  awayTeam={game.awayTeam}
                  awayTricode={game.awayTricode}
                  awayPoints={game.awayPoints}
                  awaySeed={game.awaySeed}
                  awayWins={game.awayWins}
                  awayLosses={game.awayLosses}
                  gameId={game.gameId}
                  gameLabel={game.gameLabel}
                  gameSubLabel={game.gameSubLabel}
                />
              </li>
            ) )}
          </ul>
        </section >
      ) )
      }
    </>
  );
}
