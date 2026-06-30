import SeasonNavButtonRow from "@/components/SeasonNavButtonRow/SeasonNavButtonRow";
import { getSeasonSegments } from "@/lib/nba-data";

export const runtime = "nodejs";

export default async function SeasonsLayout( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  const items = await getSeasonSegments();

  return (
    <main>
      <SeasonNavButtonRow items={items} />
      {children}
    </main>
  );
}
