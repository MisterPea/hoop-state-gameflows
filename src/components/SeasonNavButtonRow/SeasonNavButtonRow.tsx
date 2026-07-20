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
  const isFirstRender = useRef( true );

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
  const currentItem = items.find( ( item ) => item.href === normalizedPathname );
  const defaultYear = currentItem?.season ?? Object.keys( seasons )[0] ?? "";
  const defaultSuffix = currentItem
    ? seasons[defaultYear]?.find( ( { href } ) => href === currentItem.href )
    : seasons[defaultYear]?.[0];

  const [seasonYear, setSeasonYear] = useState<string>( defaultYear );
  const [currSeasonSuffix, setCurrSeasonSuffix] = useState<
    SeasonInfo | undefined
  >( defaultSuffix );

  // This nav lives in seasons/layout.tsx so it stays mounted across route
  // changes — useState's initial value only ever applies once. Resync
  // whenever the route changes underneath it (pasted URL, back/forward)
  // so the selection doesn't go stale.
  // biome-ignore lint/correctness/useExhaustiveDependencies: currentItem/currSeasonSuffix/seasons are derived from normalizedPathname or items each render — depending on them too would refire this every render.
  useEffect( () => {
    if ( currentItem && currentItem.href !== currSeasonSuffix?.href ) {
      setSeasonYear( currentItem.season );
      setCurrSeasonSuffix(
        seasons[currentItem.season]?.find(
          ( { href } ) => href === currentItem.href,
        ),
      );
    }
  }, [normalizedPathname] );

  const seasonSuffixes = seasons[seasonYear] ?? [];

  // Navigation is a side effect of the year/suffix selection, not something
  // the click handlers do directly — keeps the two rows and the route in
  // sync no matter which one changed. Skip the first run so mounting on an
  // already-matching route doesn't trigger a redundant push.
  useEffect( () => {
    if ( isFirstRender.current ) {
      isFirstRender.current = false;
      return;
    }
    if ( currSeasonSuffix?.href && currSeasonSuffix.href !== normalizedPathname ) {
      router.push( currSeasonSuffix.href );
    }
  }, [currSeasonSuffix, router, normalizedPathname] );

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname isn't read here, it's the trigger to re-scroll the selected item into view after navigation.
  useEffect( () => {
    selectedRef.current?.scrollIntoView( {
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    } );
  }, [pathname] );

  function handleSeasonYearChange( year: string ) {
    setSeasonYear( year );
    // Keep the current suffix selection (e.g. "Playoffs") if the new year
    // has one by that name; otherwise fall back to its first option.
    const matches = seasons[year] ?? [];
    const preserved =
      matches.find( ( { suffix } ) => suffix === currSeasonSuffix?.suffix ) ??
      matches[0];
    setCurrSeasonSuffix( preserved );
  }

  function handleSeasonSuffixChange( info: SeasonInfo ) {
    setCurrSeasonSuffix( info );
  }

  return (
    <nav className={`${styles.seasonRowNav}`}>
      <ul className={styles.upperSeasonNav}>
        {Object.keys( seasons ).map( ( year ) => (
          <li key={year}>
            <SeasonButton
              label={`${year} Season`}
              selected={year === seasonYear}
              onClick={() => handleSeasonYearChange( year )}
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
              selected={info.href === currSeasonSuffix?.href}
              onClick={() => handleSeasonSuffixChange( info )}
            />
          </li>
        ) )}
      </ul>
    </nav>
  );
}
