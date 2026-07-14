import type { RotationSegment } from "@/lib/nba-data";
import styles from "./GameFlowRow.module.scss";

type GameFlowRowProps = {
  segments: RotationSegment[];
  player: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  plusMinus: number;
  overtimes: number;
  teamColor: string;
  teamColorAccent: string;
};

const REGULAR_PERIODS = [1, 2, 3, 4];

function periodDuration( period: number ) {
  return period <= 4 ? 720 : 300;
}

function formatClock( seconds: number ): string {
  const m = Math.floor( seconds / 60 );
  const s = Math.floor( seconds % 60 );
  return `${m}:${s.toString().padStart( 2, "0" )}`;
}

export default function GameFlowRow( props: GameFlowRowProps ) {
  const { segments, player, minutes, points, rebounds, assists, plusMinus, overtimes, teamColor, teamColorAccent } = props;
  
  const overtimePeriods = Array.from( { length: overtimes }, ( _, i ) => i + 5 );
  
  let totalFouls = 0;
  
  function renderPeriod( period: number ) {
    const dur = periodDuration( period );
    const periodSegs = segments.filter( s => s.period === period );

    return (
      <div
        key={period}
        className={period <= 4 ? styles.regularPeriod : styles.overtimePeriod}
      >
        {periodSegs.map( ( seg, i ) => {
          totalFouls += seg.stats.personalFouls;
          return (

            <div
              key={i}
              className={styles.segment}
              style={{
                left: `${( ( dur - seg.entrySeconds ) / dur ) * 100}%`,
                width: `${( ( seg.entrySeconds - seg.exitSeconds ) / dur ) * 100}%`,
                backgroundColor: teamColor,
                borderBottom: `1.5px solid ${teamColorAccent}`
              }}
            >
              <div className={styles.tooltip}>
                <div className={styles.tooltipTime}>
                  {formatClock( seg.entrySeconds )} – {formatClock( seg.exitSeconds )}
                </div>
                <div className={styles.tooltipStats}>
                  <ul>
                    <li><span>2PT:</span>{`  ${seg.stats.twoPointMade}-${seg.stats.twoPointAttempted}`}</li>
                    <li><span>3PT:</span>{`  ${seg.stats.threePointMade}-${seg.stats.threePointAttempted}`}</li>
                    <li><span>FT:</span>{`  ${seg.stats.freeThrowsMade}-${seg.stats.freeThrowsAttempted}`}</li>
                    <li><span>PF:</span>{`  ${seg.stats.personalFouls}`}</li>
                    <li><span>PF-G:</span>{`  ${totalFouls}`}</li>
                  </ul>
                </div>
              </div>
            </div>
          );
        } )}
      </div>
    );
  }

  return (
    <div className={styles.gameFlowRow}>
      <h4 className={styles.gameFlowPlayer}>{player}</h4>
      <div className={styles.gameFlowPeriods}>
        {REGULAR_PERIODS.map( renderPeriod )}
        {overtimePeriods.map( renderPeriod )}
      </div>
      <div className={styles.gameFlowStats}>
        <p className={styles.statElement}>{minutes}</p>
        <p className={styles.statElement}>{points}</p>
        <p className={styles.statElement}>{rebounds}</p>
        <p className={styles.statElement}>{assists}</p>
        <p className={styles.statElement}>{plusMinus > 0 ? `+${plusMinus}` : plusMinus}</p>
      </div>
    </div>
  );
}
