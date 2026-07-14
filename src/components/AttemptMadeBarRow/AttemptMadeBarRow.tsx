import styles from "./AttemptMadeBarRow.module.scss";

type AttemptMadeBarRowProps = {
  label?: string;
  attempts: number;
  made: number;
  scale: number;
  pctCalloutPosition?: "top" | "bottom";
  includePctBadge?: boolean;
  includeMissedAmt?: boolean;
  includeTotal?: boolean;
  teamColor?: string;
  className?: string;
};

export default function AttemptMadeBarRow( props: AttemptMadeBarRowProps ) {
  const {
    label,
    attempts,
    made,
    scale,
    pctCalloutPosition = "top",
    includePctBadge,
    includeMissedAmt,
    includeTotal = true,
    teamColor,
    className,
  } = props;

  const madePct = ( made / attempts ) * 100;

  const pctCalloutClass = pctCalloutPosition === "bottom"
    ? styles.pctCalloutBottom
    : styles.pctCalloutTop;

  return (
    <div className={`${styles.barWrapInfo} ${className ?? ""}`}>
      <p className={styles.tricodeText}>{label}</p>
      <div className={styles.barTrack}>
        <div
          style={{ width: `calc((100% - var(--num-reserve)) * ${scale})` }}
          className={styles.barWrap}
        >
          {includePctBadge && <p className={pctCalloutClass} style={{ left: `${madePct}%` }}>{`${madePct.toFixed( 0 )}%`}</p>}
          <div
            style={{ width: `${madePct}%`, ...( teamColor && { backgroundColor: teamColor } ) }}
            className={styles.barMain}
          >{made}</div>
          {madePct < 100 &&
            <div
              style={{ width: `${100 - madePct}%` }}
              className={`${styles.missedBar} ${includeMissedAmt ? styles.includeMissed : ''}`}
            >{includeMissedAmt && attempts - made}
            </div>}
        </div>
        {includeTotal && <p className={styles.totalNum}>{attempts}</p>}
      </div>
    </div>
  );
}
