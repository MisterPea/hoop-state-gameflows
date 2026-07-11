import styles from "./GameCompareAttemptMadeBar.module.scss";

type GameCompareAttemptMadeBarProps = {
  awayTricode: string;
  awayAttempts: number;
  awayMade: number;
  homeTricode: string;
  homeAttempts: number;
  homeMade: number;
  chartLabel?: string;
  includePctBadge?: boolean;
  includeMadeAmt?: boolean;
  includeTotal?: boolean;
  homeTeamColor?: string;
  awayTeamColor?: string;
  includeMissedAmt?: boolean;
};

export default function GameCompareAttemptMadeBar( props: GameCompareAttemptMadeBarProps ) {
  const {
    awayTricode,
    awayAttempts,
    awayMade,
    homeTricode,
    homeAttempts,
    homeMade,
    chartLabel,
    includePctBadge,
    includeMadeAmt,
    homeTeamColor,
    awayTeamColor,
    includeTotal,
    includeMissedAmt
  } = props;

  let includeBarTotal = true;
  if ( includeTotal === false ) includeBarTotal = false;

  const maxAttempts = Math.max( homeAttempts, awayAttempts );

  const homeTotal = homeAttempts / maxAttempts;
  const awayTotal = awayAttempts / maxAttempts;
  const homeMadePct = ( homeMade / homeAttempts ) * 100;
  const awayMadePct = ( awayMade / awayAttempts ) * 100;

  return (
    <div className={styles.attemptMadeBarWrap}>
      {chartLabel && <h4>{chartLabel}</h4>}
      <div className={styles.barWrapInfo}>
        <p className={styles.tricodeText}>{awayTricode}</p>
        <div className={styles.barTrack}>
          <div
            style={{ width: `calc((100% - var(--num-reserve)) * ${awayTotal})` }}
            className={styles.barWrap}
          >
            {includePctBadge && <p className={styles.pctCalloutTop} style={{ left: `${awayMadePct}%` }}>{`${awayMadePct.toFixed( 0 )}%`}</p>}
            <div
              style={{ width: `${awayMadePct}%`, ...( awayTeamColor && { backgroundColor: awayTeamColor } ) }}
              className={styles.barMain}
            >{includeMadeAmt && awayMade}</div>
            {awayMadePct < 100 &&
              <div
                style={{ width: `${100 - awayMadePct}%` }}
                className={`${styles.missedBar} ${includeMissedAmt ? styles.includeMissed : ''}`}
              >{includeMissedAmt && awayAttempts - awayMade}
              </div>}
          </div>
          {includeBarTotal && <p className={styles.totalNum}>{awayAttempts}</p>}
        </div>
      </div>

      <div className={styles.barWrapInfo}>
        <p className={styles.tricodeText}>{homeTricode}</p>
        <div className={styles.barTrack}>
          <div
            style={{ width: `calc((100% - var(--num-reserve)) * ${homeTotal})` }}
            className={styles.barWrap}
          >
            {includePctBadge && <p className={styles.pctCalloutBottom} style={{ left: `${homeMadePct}%` }}>{`${homeMadePct.toFixed( 0 )}%`}</p>}
            <div
              style={{ width: `${homeMadePct}%`, ...( homeTeamColor && { backgroundColor: homeTeamColor } ) }}
              className={styles.barMain}
            >{includeMadeAmt && homeMade}</div>
            {homeMadePct < 100 && <div style={{ width: `${100 - homeMadePct}%` }} className={`${styles.missedBar} ${includeMissedAmt ? styles.includeMissed : ''}`}>{includeMissedAmt && homeAttempts - homeMade}</div>}
          </div>
          {includeBarTotal && <p className={styles.totalNum}>{homeAttempts}</p>}
        </div>
      </div>

    </div>
  );
}
