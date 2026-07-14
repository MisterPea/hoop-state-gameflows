import AttemptMadeBarRow from "../AttemptMadeBarRow/AttemptMadeBarRow";
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
    homeTeamColor,
    awayTeamColor,
    includeTotal,
    includeMissedAmt
  } = props;

  const maxAttempts = Math.max( homeAttempts, awayAttempts );

  return (
    <div className={styles.attemptMadeBarWrap}>
      {chartLabel && <h4>{chartLabel}</h4>}
      <AttemptMadeBarRow
        label={awayTricode}
        attempts={awayAttempts}
        made={awayMade}
        scale={awayAttempts / maxAttempts}
        pctCalloutPosition="top"
        includePctBadge={includePctBadge}
        includeMissedAmt={includeMissedAmt}
        includeTotal={includeTotal}
        teamColor={awayTeamColor}
      />
      <AttemptMadeBarRow
        label={homeTricode}
        attempts={homeAttempts}
        made={homeMade}
        scale={homeAttempts / maxAttempts}
        pctCalloutPosition="bottom"
        includePctBadge={includePctBadge}
        includeMissedAmt={includeMissedAmt}
        includeTotal={includeTotal}
        teamColor={homeTeamColor}
      />
    </div>
  );
}
