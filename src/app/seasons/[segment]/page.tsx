import { notFound } from "next/navigation";
import styles from "./seasons.module.scss";

import {
  ConsolidatedGameSummary,
  getGamesForSeasonSegment,
  getSeasonSegment,
  getSeasonSegments,
} from "@/lib/nba-data";
import MainPageDateGameSection from "@/components/MainPageDateGameSection/MainPageDateGameSection";

export const runtime = "nodejs";
export const dynamicParams = false;

export async function generateStaticParams() {
  const items = await getSeasonSegments();

  return items.map( ( item ) => ( {
    segment: item.segment,
  } ) );
}

export default async function SeasonSegmentPage(
  props: PageProps<"/seasons/[segment]">,
) {
  const { segment } = await props.params;
  const seasonSegment = await getSeasonSegment( segment );

  if ( !seasonSegment ) {
    notFound();
  }

  const games: Record<string, ConsolidatedGameSummary[]> = await getGamesForSeasonSegment( segment );
  const numGames = Object.values( games ).flat().length;
  return (
    <div className={`${styles.gamesWrapper}`}>
      <header className={`${styles.numGamesHeader}`}>
        <p>{`${numGames} games`}</p>
      </header>
      <MainPageDateGameSection gamesData={games} />
    </div>
  );
}
