import type { ConsolidatedGameSummary } from "@/lib/nba-data";
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
            <h3 className={`${styles.dateTitle}`}>{date}</h3>
            <ul className={styles.gameDateSectionUl}>
              {games.map( ( game ) => (
                <li key={`${date}-${game.gameId}`} className={styles.gameDateSectionLi}>
                  <MainPageGameCard
                    homeTeam={game.homeTeam}
                    homePoints={game.homePoints}
                    awayTeam={game.awayTeam}
                    awayPoints={game.awayPoints}
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
