'use client';

import Link from 'next/link';
import styles from './MainPageGameCard.module.scss';
import { useRef, useEffect } from 'react';
import { Logo, type TeamLogoCode } from '../../lib/team-logos';
import TeamLogo from '../TeamLogo/TeamLogo';


type GameCardProps = {
  awayPoints: number;
  awayTeam: string;
  awayTricode?: string;
  awaySeed?: number | null;
  awayWins?: number | null;
  awayLosses?: number | null;
  gameDate?: string;
  gameId: string;
  homePoints: number;
  homeTeam: string;
  homeTricode?: string;
  homeSeed?: number | null;
  homeWins?: number | null;
  homeLosses?: number | null;
  gameLabel: string | null;
  gameSubLabel: string | null;
};

export default function MainPageGameCard( props: GameCardProps ) {
  const {
    awayPoints, awayTeam, awayTricode, awaySeed, awayWins, awayLosses,
    gameDate, gameId,
    homePoints, homeTeam, homeTricode, homeSeed, homeWins, homeLosses,
    gameLabel, gameSubLabel,
  } = props;
  let lowerLabel = '';
  if ( gameLabel && gameSubLabel ) lowerLabel = `${gameLabel} - ${gameSubLabel}`;
  else if ( gameLabel ) lowerLabel = gameLabel;
  else if ( gameSubLabel ) lowerLabel = gameSubLabel;
  else if ( awayTricode && homeTricode && awayWins != null && awayLosses != null && homeWins != null && homeLosses != null ) {
    lowerLabel = `${awayTricode}: ${awayWins}-${awayLosses} - ${homeTricode}: ${homeWins}-${homeLosses}`;
  }

  const prefetchTimer = useRef<NodeJS.Timeout>( null );
  const PREFETCH_MS = 250;
  const gameUrl = `/games/${gameId}`;

  // router.prefetch() only warms Next's in-memory RSC cache for a same-tab
  // soft nav — useless here since target="_blank" always forces a hard
  // navigation in a fresh tab. A native <link rel="prefetch"> hits the
  // browser's HTTP cache instead, which the new tab's request can reuse.
  function addPrefetchLink( href: string ) {
    if ( document.head.querySelector( `link[rel="prefetch"][href="${href}"]` ) ) return;
    const link = document.createElement( 'link' );
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild( link );
  }

  function handlePrefetchTimer() {
    prefetchTimer.current = setTimeout( () => {
      addPrefetchLink( gameUrl );
    }, PREFETCH_MS );
  }

  function removePrefetchTimer() {
    if ( prefetchTimer.current ) {
      clearTimeout( prefetchTimer.current );
      prefetchTimer.current = null;
    }
  }
  useEffect( () => removePrefetchTimer, [] );

  const homeWin = homePoints > awayPoints;
  return (
    <Link
      className={`${styles.gameCard}`}
      href={gameUrl}
      target="_blank"
      prefetch={false}
      onMouseEnter={handlePrefetchTimer}
      onMouseLeave={removePrefetchTimer}
    >
      <div className={styles.teamCard}>
        <div className={styles.teamHolder}>
          <div className={`${styles.teamRow} ${!homeWin && styles.gameWinner}`}>
            <div className={styles.logoHolder}>
              {awayTricode && <TeamLogo tricode={awayTricode} teamName="" />}
            </div>
            <h3 className={styles.teamName}>{awayTeam}{awaySeed && <span className={styles.seeding}>{` (${awaySeed})`}</span>}</h3>
            <h4 className={styles.teamPoints}>{awayPoints}<span className={styles.winArrow}>◀</span></h4>
          </div>
          <div className={`${styles.teamRow} ${homeWin && styles.gameWinner}`}>
            <div className={styles.logoHolder}>
              {homeTricode && <TeamLogo tricode={homeTricode} teamName="" />}
            </div>
            <h3 className={styles.teamName}>{homeTeam}{homeSeed && <span className={styles.seeding}>{` (${homeSeed})`}</span>}</h3>
            <h4 className={styles.teamPoints}>{homePoints}<span className={styles.winArrow}>◀</span></h4>
          </div>
        </div>
        <p className={`${styles.lowerLabel}`}>{lowerLabel}</p>
      </div>
    </Link >
  );
}
