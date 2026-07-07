import styles from "./GameCompareAttemptMadeBar.module.scss";

type GameCompareAttemptMadeBarProps = {
  homeAttempts: number;
  homeMade: number;
  awayAttempts: number;
  awayMade: number;
  innerChartLabel?: string;
  includeTotalLabel?: Boolean;
  includeMadeLabel?: Boolean;
  includePctBadge?: Boolean;
  homeTeamColor?: string;
  awayTeamColor?: string;
};

export default function GameCompareAttemptMadeBar( props: GameCompareAttemptMadeBarProps ) {
  const { homeAttempts,
    homeMade,
    awayAttempts,
    awayMade,
    innerChartLabel,
    includeMadeLabel,
    includeTotalLabel,
    includePctBadge } = props;

  const maxAttempts = Math.max( homeAttempts, awayAttempts );

  const homeTotal = homeAttempts / maxAttempts;
  const awayTotal = awayAttempts / maxAttempts;
  const homeMadePct = ( homeMade / homeAttempts ) * 100;
  const awayMadePct = ( awayMade / awayAttempts ) * 100;

  return (
    <div className={styles.attemptMadeBarWrap}>
      {innerChartLabel && <h4 className={styles.innerChartLabel}>{innerChartLabel}</h4>}
      <div className={`${styles.barsWrap} ${includePctBadge ? styles.pctBadgeSpacer: ''}`}>
        <div className={styles.barRow}>
          <div className={styles.outerBar} style={{ transform: `scaleX(${awayTotal})` }}>
            <div className={styles.innerBarMade} style={{ width: `${awayMadePct}%` }}>
              {includePctBadge && <p style={{ left: `${awayMadePct}%` }} className={styles.midLabelTop}>{`${awayMadePct.toFixed( 0 )}%`}</p>}
              {includeMadeLabel && <p className={styles.madeLabel}>{awayMade}</p>}
            </div>
            <div className={styles.innerBarMiss} style={{ width: `${100 - awayMadePct}%` }}></div>
          </div>
          {includeTotalLabel && <p className={styles.totalLabel}>{awayAttempts}</p>}
        </div>
        <div className={styles.barRow}>
          <div className={styles.outerBar} style={{ transform: `scaleX(${homeTotal})` }}>
            <div className={styles.innerBarMade} style={{ width: `${homeMadePct}%` }}>
              {includeMadeLabel && <p className={styles.madeLabel}>{homeMade}</p>}
            </div>
            <div className={styles.innerBarMiss} style={{ width: `${100 - homeMadePct}%` }}></div>
            {includePctBadge && <p style={{ left: `${homeMadePct}%` }} className={styles.midLabelBottom}>{`${homeMadePct.toFixed( 0 )}%`}</p>}
          </div>
          {includeTotalLabel && <p className={styles.totalLabel}>{homeAttempts}</p>}
        </div>
      </div>
    </div>
  );
}
