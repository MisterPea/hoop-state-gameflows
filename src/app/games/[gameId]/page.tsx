import styles from "./gamePage.module.scss";
import { notFound } from "next/navigation";
import {
  getAllGameIds,
  getDate,
  getGameSummary,
  getOfficials,
  getRecentGameActions,
} from "@/lib/nba-data";
import GamePageTitle from "@/components/GamePageTitle/GamePageTitle";
import GamePageTitleInfo from "@/components/GamePageTitleInfo/GamePageTitleInfo";
import GameSectionWrapper from "@/components/GameSectionWrapper/GameSectionWrapper";

export const runtime = "nodejs";
export const dynamicParams = false;

export async function generateStaticParams() {
  const gameIds = await getAllGameIds();

  return gameIds.map( ( gameId ) => ( {
    gameId,
  } ) );
}

// function formatTimestamp(value: string | null) {
//   if (!value) {
//     return "Unknown";
//   }

//   return new Intl.DateTimeFormat("en-US", {
//     dateStyle: "full",
//     timeStyle: "short",
//   }).format(new Date(value));
// }

// function formatClock(clock: number | null) {
//   if (clock === null || Number.isNaN(clock)) {
//     return "--:--";
//   }

//   const totalSeconds = Math.max(clock, 0);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;

//   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
// }

export default async function GamePage( props: PageProps<"/games/[gameId]"> ) {
  const { gameId } = await props.params;
  const [summary, actions, officials, date] = await Promise.all( [
    getGameSummary( gameId ),
    getRecentGameActions( gameId ),
    getOfficials( gameId ),
    getDate( gameId )
  ] );

  if ( !summary ) {
    notFound();
  }

  return (
    <main>
      <section>
        <header>
          <GamePageTitle
            homeTeam={summary.homeTeam}
            homeScore={summary.homePoints}
            awayTeam={summary.awayTeam}
            awayScore={summary.awayPoints}
          />
          <div className={styles.dateGameIdRow}>
            <GamePageTitleInfo
              title="Date:"
              data={date}
            />
            <GamePageTitleInfo
              title="Game Id:"
              data={summary.gameId}
            />
          </div>
          <div >
            <GamePageTitleInfo
              title="Officials:"
              referee1={officials.referee1}
              referee2={officials.referee2}
              referee3={officials.referee3}
              refereeAlt={officials.refereeAlt}
            />
          </div>
        </header>
        <GameSectionWrapper title="Game Flow"><p>fff</p></GameSectionWrapper>
        <section>
          <h2>Recent Actions</h2>
          <ul
            style={{
              display: "grid",
              gap: "0.75rem",
              listStyle: "none",
              padding: 0,
            }}
          >
            {actions.map( ( action ) => (
              <li
                key={action.actionNumber}
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "12px",
                  padding: "0.75rem 1rem",
                }}
              >

                <p>{action.playDescription ?? action.actionType}</p>
                <p>
                  {action.scoreAway !== null && action.scoreHome !== null
                    ? `${action.scoreAway} - ${action.scoreHome}`
                    : "Score unavailable"}
                </p>
              </li>
            ) )}
          </ul>
        </section>
      </section>
    </main>
  );
}
