import styles from "./gamePage.module.scss";
import { notFound } from "next/navigation";
import {
  getAllGameIds,
  getBoxScorePlayers,
  getDate,
  getGameSummary,
  getOfficials,
  getPlayerRotations,
  getRecentGameActions,
  getScoreMargin,
  getShotChartData,
  getTeamAccentColor,
  getTeamColor,
  getTeamName,
  getTeamNickname,
} from "@/lib/nba-data";
import GameFlowRow from "@/components/GameFlowRow/GameFlowRow";
import LineupBar from "@/components/LineupBar/LineupBar";
import ScoreMarginChart from "@/components/ScoreMarginChart/ScoreMarginChart";
import BoxScoreTable from "@/components/BoxScoreTable/BoxScoreTable";
import GamePageTitle from "@/components/GamePageTitle/GamePageTitle";
import GamePageTitleInfo from "@/components/GamePageTitleInfo/GamePageTitleInfo";
import GameSectionWrapper from "@/components/GameSectionWrapper/GameSectionWrapper";
import GameCompareAttemptMadeBar from "@/components/GameCompareAttemptMadeBar/GameCompareAttemptMadeBar";
import ShotChart from "@/components/ShotChart/ShotChart";
import { formatGameDate } from "@/lib/format-date";

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
  const [summary, actions, officials, date, rotations, scoreMargin, boxScore, shotChart] = await Promise.all( [
    getGameSummary( gameId ),
    getRecentGameActions( gameId ),
    getOfficials( gameId ),
    getDate( gameId ),
    getPlayerRotations( gameId ),
    getScoreMargin( gameId ),
    getBoxScorePlayers( gameId ),
    getShotChartData( gameId ),
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
            homeTricode={homeTricode}
            awayTricode={awayTricode}
          />
          <div className={styles.dateGameIdRow}>
            <GamePageTitleInfo
              title="Date:"
              data={formatGameDate( date )}
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
        <GameSectionWrapper title="By The Numbers" className={styles.sectionWrapper}>
          <div className={styles.byTheNumbersGrid}>
            <GameCompareAttemptMadeBar
              chartLabel="2 Pointers"
              awayTricode={awayTricode}
              awayAttempts={summary.awayTwoPointersAttempted}
              awayMade={summary.awayTwoPointersMade}
              homeTricode={homeTricode}
              homeAttempts={summary.homeTwoPointersAttempted}
              homeMade={summary.homeTwoPointersMade}
              includePctBadge
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
            />
            <GameCompareAttemptMadeBar
              chartLabel="3 Pointers"
              awayTricode={awayTricode}
              awayAttempts={summary.awayThreePointersAttempted}
              awayMade={summary.awayThreePointersMade}
              homeTricode={homeTricode}
              homeAttempts={summary.homeThreePointersAttempted}
              homeMade={summary.homeThreePointersMade}
              includePctBadge
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
            />
            <GameCompareAttemptMadeBar
              chartLabel="Free Throws"
              awayTricode={awayTricode}
              awayAttempts={summary.awayFreeThrowsAttempted}
              awayMade={summary.awayFreeThrowsMade}
              homeTricode={homeTricode}
              homeAttempts={summary.homeFreeThrowsAttempted}
              homeMade={summary.homeFreeThrowsMade}
              includePctBadge
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
            />
            <GameCompareAttemptMadeBar
              chartLabel="Fast Break Points"
              awayTricode={awayTricode}
              awayAttempts={summary.awayFastBreakPointsAttempted}
              awayMade={summary.awayFastBreakPointsMade}
              homeTricode={homeTricode}
              homeAttempts={summary.homeFastBreakPointsAttempted}
              homeMade={summary.homeFastBreakPointsMade}
              includePctBadge
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
            />
            <GameCompareAttemptMadeBar
              chartLabel="Points in the Paint"
              awayTricode={awayTricode}
              awayAttempts={summary.awayPointsInThePaintAttempted}
              awayMade={summary.awayPointsInThePaintMade}
              homeTricode={homeTricode}
              homeAttempts={summary.homePointsInThePaintAttempted}
              homeMade={summary.homePointsInThePaintMade}
              includePctBadge
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
            />
            <GameCompareAttemptMadeBar
              chartLabel="Second Chance Points"
              awayTricode={awayTricode}
              awayAttempts={summary.awaySecondChancePointsAttempted}
              awayMade={summary.awaySecondChancePointsMade}
              homeTricode={homeTricode}
              homeAttempts={summary.homeSecondChancePointsAttempted}
              homeMade={summary.homeSecondChancePointsMade}
              includePctBadge
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
            />
            <GameCompareAttemptMadeBar
              chartLabel="Player Turnovers - Team Turnovers"
              awayTricode={awayTricode}
              awayAttempts={summary.awayTurnoversTotal}
              awayMade={summary.awayTurnovers}
              homeTricode={homeTricode}
              homeAttempts={summary.homeTurnoversTotal}
              homeMade={summary.homeTurnovers}
              includeTotal={false}
              includeMissedAmt
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
            />
            <GameCompareAttemptMadeBar
              chartLabel="Assist/Turnover Ratio"
              awayTricode={awayTricode}
              awayAttempts={+summary.awayAssistsTurnoverRatio.toFixed( 6 )}
              awayMade={+summary.awayAssistsTurnoverRatio.toFixed( 6 )}
              homeTricode={homeTricode}
              homeAttempts={+summary.homeAssistsTurnoverRatio.toFixed( 6 )}
              homeMade={+summary.homeAssistsTurnoverRatio.toFixed( 6 )}
              awayTeamColor={getTeamColor( awayTricode )}
              homeTeamColor={getTeamColor( homeTricode )}
              includeTotal={false}
            />
          </div>
        </GameSectionWrapper>
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
            homeTeam={getTeamNickname( homeTricode )}
            awayTeam={getTeamNickname( awayTricode )}
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
          <BoxScoreTable
            teamName={getTeamName( awayTricode )}
            players={boxScore.away}
          />
          <BoxScoreTable
            teamName={getTeamName( homeTricode )}
            players={boxScore.home}
          />

          <h5 className={styles.boxScoreLegendTitle}>Legend</h5>
          <div className={styles.boxScoreLegendElements}>
            <ul>
              <li><span>MIN</span> - Minutes Played</li>
              <li><span>FT</span> - Free Throws Made/Attempted</li>
              <li><span>PTS</span> - Total Points Scored</li>
              <li><span>TOV</span> - Turnovers</li>
              <li><span>FT%</span> - Free Throw Percentage</li>
              <li><span>TS%</span> - True Shooting Percentage</li>
              <li><span>PF</span> - Personal Fouls</li>
              <li><span>2PT</span> - 2 Pointers Made/Attempted</li>
              <li><span>REB</span> - Rebounds</li>
              <li><span>ORB</span> - Offensive Rebounds</li>
              <li><span>2PT%</span> - 2 Point Percentage</li>
              <li><span>AST</span> - Assists</li>
              <li><span>DRB</span> - Defensive Rebounds</li>
              <li><span>3PT</span> - 3 Pointers Made/Attempted</li>
              <li><span>PER</span> - Player Efficiency Rating</li>
              <li><span>STL</span> - Steals</li>
              <li><span>3PT%</span> - 3 Point Percentage</li>
              <li><span>USG%</span> - Usage Percentage</li>
              <li><span>BLK</span> - Blocks</li>
            </ul>
          </div>
        </GameSectionWrapper>
        <GameSectionWrapper title="Shot Chart" className={styles.sectionWrapper}>
          <div className={styles.shotChartGrid}>
            <ShotChart teamName={getTeamName( awayTricode )} shots={shotChart.away} />
            <ShotChart teamName={getTeamName( homeTricode )} shots={shotChart.home} />
          </div>
        </GameSectionWrapper>
      </section>
    </main>
  );
}
