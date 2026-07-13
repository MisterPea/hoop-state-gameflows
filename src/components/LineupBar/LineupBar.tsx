import type { LineupInterval } from "@/lib/nba-data";
import styles from "./LineupBar.module.scss";

type LineupBarProps = {
  intervals: LineupInterval[];
  overtimes: number;
};

const REGULAR_PERIODS = [1, 2, 3, 4];

function periodDuration( period: number ) {
  return period <= 4 ? 720 : 300;
}

const SATURATION = 70;
const LIGHTNESS = 46;

// 0 = yellow, most negative = red, most positive = green.
function intervalHue( value: number, min: number, max: number ): number {
  if ( value <= 0 ) {
    const t = min === 0 ? 1 : value / min;
    return 52 * ( 1 - t );
  }
  const t = max === 0 ? 0 : value / max;
  return 52 + 52 * t;
}

function intervalColor( hue: number ): string {
  return `hsl(${hue}, ${SATURATION}%, ${LIGHTNESS}%)`;
}

// Threshold swap instead of a blend-mode trick: mix-blend-mode: difference
// with white text cancels to invisible exactly at 50% grey (i.e. every 0 stint).
function intervalTextColor( lightness: number ): string {
  return lightness > 50 ? "var(--foreground)" : "var(--background)";
}

function formatClock( seconds: number ): string {
  const m = Math.floor( seconds / 60 );
  const s = Math.floor( seconds % 60 );
  return `${m}:${s.toString().padStart( 2, "0" )}`;
}

export default function LineupBar( { intervals, overtimes }: LineupBarProps ) {
  const values = intervals.map( i => i.plusMinus );
  const min = Math.min( ...values, 0 );
  const max = Math.max( ...values, 0 );

  const overtimePeriods = Array.from( { length: overtimes }, ( _, i ) => i + 5 );

  function renderPeriod( period: number ) {
    const dur = periodDuration( period );
    const periodIntervals = intervals.filter( i => i.period === period );
    return (
      <div key={period} className={period <= 4 ? styles.periodBar : styles.overtimePeriod}>
        {periodIntervals.map( ( interval, idx ) => {
          const hue = intervalHue( interval.plusMinus, min, max );
          return (
            <div
              key={idx}
              className={styles.interval}
              style={{
                left: `${( ( dur - interval.entrySeconds ) / dur ) * 100}%`,
                width: `${( ( interval.entrySeconds - interval.exitSeconds ) / dur ) * 100}%`,
                backgroundColor: intervalColor( hue ),
              }}
            >
              <span className={styles.intervalLabel} style={{ color: intervalTextColor( LIGHTNESS ) }}>
                {interval.plusMinus > 0 ? `+${interval.plusMinus}` : interval.plusMinus}
              </span>
              <div className={styles.tooltip}>
                <div className={styles.tooltipTime}>
                  {formatClock( interval.entrySeconds )} – {formatClock( interval.exitSeconds )}
                </div>
                <ul className={styles.tooltipLineup}>
                  {interval.lineup.map( player => (
                    <li key={player.personId}>{player.playerName}</li>
                  ) )}
                </ul>
              </div>
            </div>
          );
        } )}
      </div>
    );
  }

  return (
    <div className={styles.lineupBar}>
      <div className={styles.lineupLabel}>
        Lineup +/-
      </div>
      <div className={styles.periods}>
        {REGULAR_PERIODS.map( renderPeriod )}
        {overtimePeriods.map( renderPeriod )}
      </div>
      <div className={styles.statsTitle}>
        <p className={styles.statElement}>MIN</p>
        <p className={styles.statElement}>PTS</p>
        <p className={styles.statElement}>REB</p>
        <p className={styles.statElement}>AST</p>
        <p className={styles.statElement}>+/-</p>
      </div>
    </div>
  );
}
