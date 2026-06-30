import { redirect } from "next/navigation";
import SeasonNavButtonRow from "@/components/SeasonNavButtonRow/SeasonNavButtonRow";
import { getSeasonSegments } from "@/lib/nba-data";

export const runtime = "nodejs";

export default async function Home() {
  const items = await getSeasonSegments();

  if (items[0]?.href) {
    redirect(items[0].href);
  }

  return (
    <main>
      <section>
        <SeasonNavButtonRow items={items} />
      </section>
    </main>
  );
}
