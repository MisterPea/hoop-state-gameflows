import Link from 'next/link';
import styles from './MainPageGameCard.module.scss';


type GameCardProps = {
  awayPoints: number;
  awayTeam: string;
  gameDate?: string;
  gameId: string;
  homePoints: number;
  homeTeam: string;
  gameLabel: string | null;
  gameSubLabel: string | null;
};

export default function MainPageGameCard( props: GameCardProps ) {
  const { awayPoints, awayTeam, gameDate, gameId, homePoints, homeTeam, gameLabel, gameSubLabel } = props;
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
    >
      <h3 className={styles.title}>
        <span className={`${!homeWin && styles.gameCardWinner}`}>{awayTeam}</span>
        {` at `}
        <span className={`${homeWin && styles.gameCardWinner}`}>{homeTeam}</span>
      </h3>
      <div className={`${styles.gameCardLowerInfoWrapper}`}>
        <p className={`${styles.lowerLabel}`}>{lowerLabel}</p>
        <h4 className={styles.score}>{`${awayPoints} - ${homePoints}`}</h4>
      </div>
    </Link>
  );
}
