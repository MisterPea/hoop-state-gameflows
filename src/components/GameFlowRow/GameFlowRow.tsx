import styles from './GameFlowRow.module.scss';

type GameFlowRowProps = {
  actions: any[];
  player: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  plusMinus: number;
  overtimes: number;
};

export default function GameFlowRow( props: GameFlowRowProps ) {


  const { actions, player, minutes, points, rebounds, assists, plusMinus, overtimes } = props;
  const overtimeArray = [];

  for ( let i = 0; i < overtimes; i += 1 ) {
    overtimeArray.push( <div className={`${styles.overTime}${i + 1}`}></div> );
  }
  return (
    <div className={styles.gameFlowRow}>
      <h4 className={styles.gameFlowPlayer}>{player}</h4>
      <div className={styles.gameFlowPeriods}>
        <div className={`${styles.period1} ${styles.regularPeriod}`}></div>
        <div className={`${styles.period2} ${styles.regularPeriod}`}></div>
        <div className={`${styles.period3} ${styles.regularPeriod}`}></div>
        <div className={`${styles.period4} ${styles.regularPeriod}`}></div>
        {overtimeArray.map( ( e ) => ( e ) )}
      </div>
      <div className={styles.gameFlowStats}>
        <p className={styles.statElement}>{minutes}</p>
        <p className={styles.statElement}>{points}</p>
        <p className={styles.statElement}>{rebounds}</p>
        <p className={styles.statElement}>{assists}</p>
        <p className={styles.statElement}>{plusMinus}</p>
      </div>
    </div>
  );
}
