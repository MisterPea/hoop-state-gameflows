import Link from 'next/link';
import styles from './MainPageGameCard.module.scss';


type GameCardProps = {
  awayPoints: number;
  awayTeam: string;
  awaySeed?: number | null;
  gameDate?: string;
  gameId: string;
  homePoints: number;
  homeTeam: string;
  homeSeed?: number | null;
  gameLabel: string | null;
  gameSubLabel: string | null;
};

// function formatTeamName( team: string, seed?: number | null ) {
//   return seed ? `${team} (${<span>seed</span>})` : team;
// }

export default function MainPageGameCard( props: GameCardProps ) {
  const { awayPoints, awayTeam, awaySeed, gameDate, gameId, homePoints, homeTeam, homeSeed, gameLabel, gameSubLabel } = props;
  let lowerLabel = '';
  if ( gameLabel && gameSubLabel ) lowerLabel = `${gameLabel} - ${gameSubLabel}`;
  else if ( gameLabel ) lowerLabel = gameLabel;
  else if ( gameSubLabel ) lowerLabel = gameSubLabel;

  const homeWin = homePoints > awayPoints;
  return (
    <Link
      className={`${styles.gameCard}`}
      href={`/games/${gameId}`}
      target="_blank"
      prefetch={false}
    >
      <div className={styles.teamCard}>
        <div className={styles.teamHolder}>
          <div className={`${styles.teamRow} ${!homeWin && styles.gameWinner}`}>
            <h3 className={styles.teamName}>{awayTeam}{awaySeed && <span className={styles.seeding}>{` (${awaySeed})`}</span>}</h3>
            <h4 className={styles.teamPoints}>{awayPoints}<span className={styles.winArrow}>◀</span></h4>
          </div>
          <div className={`${styles.teamRow} ${homeWin && styles.gameWinner}`}>
            <h3 className={styles.teamName}>{homeTeam}{homeSeed && <span className={styles.seeding}>{` (${homeSeed})`}</span>}</h3>
            <h4 className={styles.teamPoints}>{homePoints}<span className={styles.winArrow}>◀</span></h4>
          </div>
        </div>
        <p className={`${styles.lowerLabel}`}>{lowerLabel}</p>
      </div>
    </Link >
  );
}
