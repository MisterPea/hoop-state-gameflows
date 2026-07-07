import styles from "./GameCompareAttemptMadeBar.module.scss";

type GameCompareAttemptMadeBarProps = {
  awayTricode: string;
  awayAttempts: number;
  awayMade: number;
  homeTricode: string;
  homeAttempts: number;
  homeMade: number;
  chartLabel?: string;
  includePctBadge?: Boolean;
  homeTeamColor?: string;
  awayTeamColor?: string;
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
    includePctBadge } = props;

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
        <div style={{ width: `${100 * awayTotal}%` }} className={styles.barWrap}>
          {includePctBadge && <p className={styles.pctCalloutTop} style={{ left: `${awayMadePct}%` }}>{`${awayMadePct.toFixed( 0 )}%`}</p>}
          <div style={{ width: `${awayMadePct}%` }} className={styles.barMain}>{awayMade}</div>
          {awayMadePct < 100 && <div style={{ width: `${100 - awayMadePct}%` }} className={styles.missedBar}></div>}
        </div>
        <p className={styles.totalNum}>{awayAttempts}</p>


        <p className={styles.tricodeText}>{homeTricode}</p>
        <div style={{ width: `${100 * homeTotal}%` }} className={styles.barWrap}>
          {includePctBadge && <p className={styles.pctCalloutBottom} style={{ left: `${homeMadePct}%` }}>{`${homeMadePct.toFixed( 0 )}%`}</p>}
          <div style={{ width: `${homeMadePct}%` }} className={styles.barMain}>{homeMade}</div>
          {homeMadePct < 100 && <div style={{ width: `${100 - homeMadePct}%` }} className={styles.missedBar}></div>}
        </div>
        <p className={styles.totalNum}>{homeAttempts}</p>
      </div>
    </div>
  );
}
