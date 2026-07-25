"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SeasonButton from "../SeasonNavButton/SeasonNavButton";
import styles from "./SeasonNavButtonRow.module.scss";

export type SeasonNavItem = {
  href: string;
  label: string;
  segment: string;
  season: string;
  categories: string[];
};

type SeasonInfo = { suffix: string; href: string; };

type SeasonsNavButtonRowProps = {
  items: SeasonNavItem[];
};

export default function SeasonNavButtonRow( {
  items,
}: SeasonsNavButtonRowProps ) {
  const pathname = usePathname();
  const router = useRouter();
  const selectedRef = useRef<HTMLLIElement>( null );

  // Break seasons into YYYY-YY keys with arrays of potential suffixes (playoffs, nba-cup, etc)
  const seasons: { [key: string]: SeasonInfo[]; } = {};
  if ( Object.keys( seasons ).length === 0 && items ) {
    for ( const { href, label, season } of items ) {
      const labelSuffix = label.slice( 8 ); // strips YYYY-YY_
      if ( seasons[season] ) {
        seasons[season] = [...seasons[season], { suffix: labelSuffix, href }];
      } else {
        seasons[season] = [{ suffix: labelSuffix, href }];
      }
    }
  }

  // trailingSlash is on (next.config.ts) so usePathname() always has a
  // trailing "/", but item.href is built without one — strip it before
  // comparing, or currentItem never matches.
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith( "/" )
      ? pathname.slice( 0, -1 )
      : pathname;

  // Land on the row reflecting the current route (if any) instead of always
  // defaulting to the first year/suffix — otherwise the nav effect below
  // would immediately redirect away from wherever the user landed.

  // Find current pathname
  const currentItem = items.find( ( item ) => item.href === normalizedPathname );
  const defaultYear = currentItem?.season ?? Object.keys( seasons )[0] ?? "";
  const defaultSuffix = currentItem
    ? seasons[defaultYear]?.find( ( { href } ) => href === currentItem.href )
    : seasons[defaultYear]?.[0];

  const [seasonYear, setSeasonYear] = useState<string>( defaultYear );
  const [currSeasonSuffix, setCurrSeasonSuffix] = useState<SeasonInfo | undefined>( defaultSuffix );
  const seasonSuffixes = seasons[seasonYear] ?? [];

  // This captures button presses and advances the route (does not capture back/forward browser clicks)
  useEffect( () => {
    let nextRoute = pathname;
    if ( currSeasonSuffix ) nextRoute = `/seasons/${seasonYear}-${currSeasonSuffix.suffix.replaceAll( ' ', '-' ).toLowerCase()}`;

    if ( nextRoute !== normalizedPathname ) {
      // Get valid route and push new route
      nextRoute = getValidRoute( seasonYear, currSeasonSuffix?.suffix || null );
      router.push( nextRoute );
    }

  }, [currSeasonSuffix?.href, seasonYear] );

  // To capture back/forward button clicks, we nee to derive the path parts from the url
  // The duplicate state logic will not fire unless the new value is different
  useEffect( () => {
    // derive route from url
    const year = pathname.slice( 9, 16 );
    const suffix = seasons[year]?.filter( ( { href } ) => href === normalizedPathname )[0];

    // Guard against redundant sets: this effect also fires for pathname
    // changes caused by our own router.push below (effect 1). .filter()
    // always returns a fresh object, so without this check we'd re-render
    // with a new-but-equal currSeasonSuffix on every push — a mid-navigation
    // re-render that's invisible on the dev server but can knock the static-
    // export prod site off a soft nav into a full page reload.
    if ( year !== seasonYear ) setSeasonYear( year );
    if ( suffix?.href !== currSeasonSuffix?.href ) setCurrSeasonSuffix( suffix );

    selectedRef.current?.scrollIntoView( {
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    } );
  }, [pathname] );

  function handleNavigation( year: string | null, suffixObj: SeasonInfo | null ) {
    if ( year ) setSeasonYear( year );
    if ( suffixObj ) setCurrSeasonSuffix( suffixObj );
  }

  // Takes route constructors (year, suffix) - returns valid route 
  //
  // We need to figure out the possibilities for mouseover preloads
  // So, if we have 2021-22-regular-season selected
  // we could potentially get 2021-22-play-in or 2021-22-playoffs *or*
  // 2025-26-regular-season, 2024-25-regular-season, etc.
  // This is recalculated every state change.
  function getValidRoute( year: string | null, suffix: string | null ) {
    let route = '';
    if ( year ) {
      route = seasons[year].filter( ( { suffix } ) => suffix === currSeasonSuffix?.suffix )[0]?.href;
    }
    if ( suffix ) {
      route = `/seasons/${seasonYear}-${suffix.replaceAll( ' ', '-' ).toLowerCase()}`;
    }

    // if it's not a year change, we don't have to check the route validity
    // as our suffix selections are based off the highlighted year
    if ( !year ) return route;

    const index = seasons[year]?.findIndex( ( { href } ) => {
      return href === route;
    } );
    if ( index === -1 ) {
      route = seasons[year][0].href;
    };
    return route;
  }

  return (
    <nav className={`${styles.seasonRowNav}`}>
      <ul className={styles.upperSeasonNav}>
        {Object.keys( seasons ).map( ( year ) => (
          <li key={year}>
            <SeasonButton
              label={year}
              selected={seasonYear === year}
              onClick={() => handleNavigation( year, null )}
              href={getValidRoute( year, null )}
            />
          </li>
        ) )}
      </ul>
      <ul className={styles.lowerSeasonNav}>
        {seasonSuffixes.map( ( info ) => (
          <li
            key={info.suffix}
            ref={info.href === currSeasonSuffix?.href ? selectedRef : null}
          >
            <SeasonButton
              label={info.suffix}
              selected={currSeasonSuffix?.suffix === info.suffix}
              onClick={() => handleNavigation( null, info )}
              href={getValidRoute( null, info.suffix )}
            />
          </li>
        ) )}
      </ul>
    </nav>
  );
}
