import styles from "./gamePage.module.scss";
import { notFound } from "next/navigation";
import {
  getAllGameIds,
  getDate,
  getGameSummary,
  getOfficials,
  getPlayerRotations,
  getRecentGameActions,
  getScoreMargin,
  getTeamAccentColor,
  getTeamColor,
  getTeamName,
} from "@/lib/nba-data";
import GameFlowRow from "@/components/GameFlowRow/GameFlowRow";
import LineupBar from "@/components/LineupBar/LineupBar";
import ScoreMarginChart from "@/components/ScoreMarginChart/ScoreMarginChart";
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

export default async function GamePage( props: PageProps<"/games/[gameId]"> ) {
  const { gameId } = await props.params;
  const [summary, actions, officials, date, rotations, scoreMargin] = await Promise.all( [
    getGameSummary( gameId ),
    getRecentGameActions( gameId ),
    getOfficials( gameId ),
    getDate( gameId ),
    getPlayerRotations( gameId ),
    getScoreMargin( gameId ),
  ] );

  if ( !summary ) {
    notFound();
  }

  const homeTricode = rotations.home[0]?.teamTricode ?? "";
  const awayTricode = rotations.away[0]?.teamTricode ?? "";

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
        <GameSectionWrapper title="Game Flow" className={styles.sectionWrapper}>
          <div className={styles.awayWrapper}>
            {rotations.away.map( player => (
              <GameFlowRow
                key={player.personId}
                segments={player.segments}
                player={player.playerName}
                minutes={player.minutesPlayed}
                points={player.points}
                rebounds={player.rebounds}
                assists={player.assists}
                plusMinus={player.plusMinus}
                overtimes={rotations.overtimes}
                teamColor={getTeamColor( player.teamTricode )}
                teamColorAccent={getTeamAccentColor( player.teamTricode )}
              />
            ) )}
          </div>
          <LineupBar intervals={rotations.awayLineups} overtimes={rotations.overtimes} />
          <ScoreMarginChart
            points={scoreMargin.points}
            overtimes={scoreMargin.overtimes}
            maxHomeLead={scoreMargin.maxHomeLead}
            maxAwayLead={scoreMargin.maxAwayLead}
            homeColor={getTeamColor( homeTricode )}
            awayColor={getTeamColor( awayTricode )}
            homeTeam={getTeamName( homeTricode )}
            awayTeam={getTeamName( awayTricode )}
            homeTricode={homeTricode}
            awayTricode={awayTricode}
            homeScore={summary.homePoints}
            awayScore={summary.awayPoints}
          />
          <LineupBar intervals={rotations.homeLineups} overtimes={rotations.overtimes} />
          <div className={styles.homeWrapper}>
            {rotations.home.map( player => (
              <GameFlowRow
                key={player.personId}
                segments={player.segments}
                player={player.playerName}
                minutes={player.minutesPlayed}
                points={player.points}
                rebounds={player.rebounds}
                assists={player.assists}
                plusMinus={player.plusMinus}
                overtimes={rotations.overtimes}
                teamColor={getTeamColor( player.teamTricode )}
                teamColorAccent={getTeamAccentColor( player.teamTricode )}
              />
            ) )}
          </div>
        </GameSectionWrapper>
        <GameSectionWrapper title="Box Scores">

          <p>dd</p>
        </GameSectionWrapper>
      </section>
    </main>
  );
}
