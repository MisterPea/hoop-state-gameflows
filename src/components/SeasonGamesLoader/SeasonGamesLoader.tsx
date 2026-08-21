"use client";

import { useEffect, useState } from "react";
import type { ConsolidatedGameSummary } from "@/lib/nba-data";
import MainPageDateGameSection from "../MainPageDateGameSection/MainPageDateGameSection";
import styles from "./SeasonGamesLoader.module.scss";

type Props = {
  segment: string;
};

type GamesByDate = Record<string, ConsolidatedGameSummary[]>;

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; games: GamesByDate };

// Fetches the pre-generated per-segment JSON (see generate-season-json.ts)
// at runtime rather than embedding the full season's games in the page's
// static payload. MainPageDateGameSection stays a pure, props-only
// component; this is the one boundary that talks to the network.
export default function SeasonGamesLoader({ segment }: Props) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetch(`/data/season-games/${segment}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<GamesByDate>;
      })
      .then((games) => {
        if (!cancelled) setState({ status: "ready", games });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [segment]);

  if (state.status === "loading") {
    return <p className={styles.status}>Loading games…</p>;
  }

  if (state.status === "error") {
    return (
      <p className={styles.status}>
        Couldn&apos;t load games for this segment.
      </p>
    );
  }

  const numGames = Object.values(state.games).flat().length;

  return (
    <>
      <header className={styles.numGamesHeader}>
        <p>{numGames} games</p>
      </header>
      <MainPageDateGameSection gamesData={state.games} />
    </>
  );
}
