"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { formatGameDate } from "@/lib/format-date";
import type { ConsolidatedGameSummary } from "@/lib/nba-data";
import MainPageGameCard from "../MainPageGameCard/MainPageGameCard";
import styles from "./MainPageDateGameSection.module.scss";

type Props = {
  gamesData: Record<string, ConsolidatedGameSummary[]>;
};

// Rough per-date section height used only to size the scrollbar/virtual
// track before a section has actually been measured. measureElement
// corrects it against the real rendered height once mounted, so this only
// needs to be in the right ballpark to avoid a visible scroll-position jump.
const CARD_HEIGHT_ESTIMATE = 100;
const SECTION_CHROME_ESTIMATE = 70;

function columnCountClass(gameCount: number) {
  if (gameCount <= 1) return styles.countOne;
  if (gameCount === 2) return styles.countTwo;
  return styles.countThreePlus;
}

function estimateSectionHeight(gameCount: number) {
  const cols = gameCount <= 1 ? 1 : gameCount === 2 ? 2 : 3;
  const rows = Math.ceil(gameCount / cols);
  return SECTION_CHROME_ESTIMATE + rows * CARD_HEIGHT_ESTIMATE;
}

export default function MainPageDateGameSection({ gamesData }: Props) {
  // Opt out of React Compiler memoization for this component. It calls
  // virtualizer.getVirtualItems()/getTotalSize() on every render — reads of
  // a mutable external instance whose internal cache changes independent of
  // any prop/state the compiler can see. The compiler doesn't know those
  // calls are impure, so it can memoize the JSX referencing them keyed only
  // on the (referentially stable) `virtualizer`/`dateEntries` values and
  // freeze it at its first-render result, permanently pinning both the
  // scroll-track height and the rendered window to whatever they were on
  // mount.
  "use no memo";

  // TanStack Virtual's options-diffing needs these referentially stable
  // across renders — a fresh array/closure each render (from re-deriving
  // gamesData inline) desyncs its internal measurement cache from the
  // total-size calculation, so this isn't a perf nicety the compiler can
  // subsume, it's a correctness requirement of the library's API.
  const dateEntries = useMemo(() => Object.entries(gamesData), [gamesData]);
  const estimateSize = useCallback(
    (index: number) => estimateSectionHeight(dateEntries[index][1].length),
    [dateEntries],
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const [parentOffset, setParentOffset] = useState(0);

  useLayoutEffect(() => {
    setParentOffset(parentRef.current?.offsetTop ?? 0);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: dateEntries.length,
    estimateSize,
    overscan: 4,
    scrollMargin: parentOffset,
  });

  return (
    <div
      ref={parentRef}
      style={{ position: "relative", height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const [date, games] = dateEntries[virtualRow.index];
        return (
          <section
            key={date}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            className={styles.gameDateSection}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start - parentOffset}px)`,
            }}
          >
            <div className={styles.gameDateSectionCard}>
              <h3 className={`${styles.dateTitle}`}>{formatGameDate(date)}</h3>
              <ul
                className={`${styles.gameDateSectionUl} ${columnCountClass(games.length)}`}
              >
                {games.map((game) => (
                  <li
                    key={`${date}-${game.gameId}`}
                    className={styles.gameDateSectionLi}
                  >
                    <MainPageGameCard
                      homeTeam={game.homeTeam}
                      homeTricode={game.homeTricode}
                      homePoints={game.homePoints}
                      homeSeed={game.homeSeed}
                      homeWins={game.homeWins}
                      homeLosses={game.homeLosses}
                      awayTeam={game.awayTeam}
                      awayTricode={game.awayTricode}
                      awayPoints={game.awayPoints}
                      awaySeed={game.awaySeed}
                      awayWins={game.awayWins}
                      awayLosses={game.awayLosses}
                      gameId={game.gameId}
                      gameLabel={game.gameLabel}
                      gameSubLabel={game.gameSubLabel}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
