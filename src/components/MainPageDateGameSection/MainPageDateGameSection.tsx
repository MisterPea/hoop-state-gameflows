import type { ConsolidatedGameSummary } from "@/lib/nba-data";
import { formatGameDate } from "@/lib/format-date";
import styles from "./MainPageDateGameSection.module.scss";
import MainPageGameCard from "../MainPageGameCard/MainPageGameCard";

type Props = {
  gamesData: Record<string, ConsolidatedGameSummary[]>;
};

export default function MainPageDateGameSection( { gamesData }: Props ) {
  return (
    <>
      {Object.entries( gamesData ).map( ( [date, games] ) => (
        <section key={date} className={`${styles.gameDateSection}`}>
            <h3 className={`${styles.dateTitle}`}>{formatGameDate( date )}</h3>
            <ul className={styles.gameDateSectionUl}>
              {games.map( ( game ) => (
                <li key={`${date}-${game.gameId}`} className={styles.gameDateSectionLi}>
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
        </section>
      ) )}
    </>
  );
}
