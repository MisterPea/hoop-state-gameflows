import styles from './GamePageTitle.module.scss';

type GamePageTitleProps = {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
};

export default function GamePageTitle( gameTitleInfo: GamePageTitleProps ) {
  const { homeTeam, homeScore, awayTeam, awayScore } = gameTitleInfo;

  return (
    <div className={`${styles.gameTitle}`}>
      <h1><span className={styles.teamUnit}>{awayTeam} <span className={styles.score}>({awayScore})</span></span><span className={styles.atSpan}>{" at "}</span><span className={styles.teamUnit}>{homeTeam} <span className={styles.score}>({homeScore})</span></span></h1>
    </div>
  );

}
