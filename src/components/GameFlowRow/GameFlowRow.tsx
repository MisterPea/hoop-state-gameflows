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

export default function GameFlowRow( props: GameFlowRowProps ) {
  const { segments, player, minutes, points, rebounds, assists, plusMinus, overtimes, teamColor, teamColorAccent } = props;

  const overtimePeriods = Array.from( { length: overtimes }, ( _, i ) => i + 5 );

  function renderPeriod( period: number ) {
    const dur = periodDuration( period );
    const periodSegs = segments.filter( s => s.period === period );

    return (
      <div
        key={period}
        className={period <= 4 ? styles.regularPeriod : styles.overtimePeriod}
      >
        {periodSegs.map( ( seg, i ) => (

          <div
            key={i}
            className={styles.segment}
            style={{
              left: `${( ( dur - seg.entrySeconds ) / dur ) * 100}%`,
              width: `${( ( seg.entrySeconds - seg.exitSeconds ) / dur ) * 100}%`,
              backgroundColor: teamColor,
              borderBottom: `1.5px solid ${teamColorAccent}`
            }}
          />
        ) )}
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
