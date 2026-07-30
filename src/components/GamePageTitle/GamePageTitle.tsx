import { Logo, type TeamLogoCode } from "@/lib/team-logos";
import styles from './GamePageTitle.module.scss';

type GamePageTitleProps = {
  homeTeam: string;
  homeScore: number;
  homeTricode?: string;
  awayTeam: string;
  awayScore: number;
  awayTricode?: string;
};

export default function GamePageTitle( gameTitleInfo: GamePageTitleProps ) {
  const { homeTeam, homeScore, homeTricode, awayTeam, awayScore, awayTricode } = gameTitleInfo;

  return (
    <div className={`${styles.gameTitle}`}>
      <h1 className={styles.titleRow}>
        <span className={styles.teamUnit}>
          {awayTricode && <Logo tricode={awayTricode as TeamLogoCode} className={styles.logo} />}
          <span className={styles.teamName}>{awayTeam}</span>
          <span className={styles.score}>({awayScore})</span>
        </span>
        <span className={styles.atSpan}>at</span>
        <span className={styles.teamUnit}>
          {homeTricode && <Logo tricode={homeTricode as TeamLogoCode} className={styles.logo} />}
          <span className={styles.teamName}>{homeTeam}</span>
          <span className={styles.score}>({homeScore})</span>
        </span>
      </h1>
    </div>
  );

}
