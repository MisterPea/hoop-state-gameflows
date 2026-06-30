import styles from './GameQuarterBoxScore.module.scss';

type BoxScoreProps = {
  boxScoreTitle: string;
  points: number;
  fieldGoalMade: number;
  fieldGoalAttempt: number;
  threePointMade: number;
  threePointAttempt: number;
  blocks: number;
  offensiveRebound: number;
  defensiveRebound: number;
  assists: number;
  turnovers: number;
  steals: number;
  personalFouls: number;
  freeThrowMade: number;
  freeThrowAttempt: number;
  assistToTurnover?: number;
};

export default function GameQuarterBoxScore( props: BoxScoreProps ) {
  const {
    points, fieldGoalMade, fieldGoalAttempt,
    threePointMade, threePointAttempt, blocks,
    offensiveRebound, defensiveRebound, assists,
    turnovers, steals, personalFouls,
    freeThrowMade, freeThrowAttempt, assistToTurnover, boxScoreTitle
  } = props;

  return (
    <div className={styles.boxScoreWrap}>
      <h3>{boxScoreTitle}</h3>
      <div className={styles.boxScore}>
        <div className={styles.gridMain}>
          <span title="Points" className={styles.gridCellTitle}>PTS</span>
          <span title="Field Goals Made" className={styles.gridCellTitle}>FGM</span>
          <span title="Field Goals Attempted" className={styles.gridCellTitle}>FGA</span>
          <span title="Three Pointers Made" className={styles.gridCellTitle}>3PM</span>
          <span title="Three Pointers Attempted" className={styles.gridCellTitle}>3PA</span>
          <span title="Blocks" className={styles.gridCellTitle}>BLK</span>
          <span className={styles.gridCellValue}>{points}</span>
          <span className={styles.gridCellValue}>{fieldGoalMade}</span>
          <span className={styles.gridCellValue}>{fieldGoalAttempt}</span>
          <span className={styles.gridCellValue}>{threePointMade}</span>
          <span className={styles.gridCellValue}>{threePointAttempt}</span>
          <span className={styles.gridCellValue}>{blocks}</span>
          <span title="Offensive Rebounds" className={styles.gridCellTitle}>OR</span>
          <span title="Defensive Rebounds" className={styles.gridCellTitle}>DR</span>
          <span title="Assists" className={styles.gridCellTitle}>AST</span>
          <span title="Turnovers" className={styles.gridCellTitle}>TO</span>
          <span title="Steals" className={styles.gridCellTitle}>STL</span>
          <span title="Personal Fouls" className={styles.gridCellTitle}>PF</span>
          <span className={styles.gridCellValue}>{offensiveRebound}</span>
          <span className={styles.gridCellValue}>{defensiveRebound}</span>
          <span className={styles.gridCellValue}>{assists}</span>
          <span className={styles.gridCellValue}>{turnovers}</span>
          <span className={styles.gridCellValue}>{steals}</span>
          <span className={styles.gridCellValue}>{personalFouls}</span>
          <span title="Free Throws Made" className={styles.gridCellTitle}>FTM</span>
          <span title="Free Throws Attempted" className={styles.gridCellTitle}>FTA</span>
          <span className={styles.gridCellTitle}></span>
          <span title="Assist to Turnover Ratio" className={styles.gridCellTitle}>A/T</span>
          <span className={styles.gridCellTitle}></span>
          <span className={styles.gridCellTitle}></span>
          <span className={styles.gridCellValue}>{freeThrowMade}</span>
          <span className={styles.gridCellValue}>{freeThrowAttempt}</span>
          <span className={styles.gridCellValue}></span>
          <span className={styles.gridCellValue}>{assistToTurnover ?? '—'}</span>
          <span className={styles.gridCellValue}></span>
          <span className={styles.gridCellValue}></span>
        </div>
      </div>
    </div>
  );
}
