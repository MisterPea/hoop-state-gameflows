import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SeasonGamesLoader from "./SeasonGamesLoader";

const sampleGames = {
  "2026-05-15": [
    {
      awayPoints: 139,
      awayTeam: "San Antonio",
      awayTricode: "SAS",
      awaySeed: null,
      awayWins: null,
      awayLosses: null,
      gameDate: "2026-05-15",
      gameId: "0042500236",
      homePoints: 109,
      homeTeam: "Minnesota",
      homeTricode: "MIN",
      homeSeed: null,
      homeWins: null,
      homeLosses: null,
      gameLabel: null,
      gameSubLabel: null,
    },
  ],
};

// Storybook has no live JSON files to fetch, so each story stubs
// window.fetch directly rather than pulling in a mocking library.
function withFetch(response: () => Promise<Response>) {
  return (args: { segment: string }) => {
    // biome-ignore lint/suspicious/noExplicitAny: story-only fetch stub
    (globalThis as any).fetch = response;
    return <SeasonGamesLoader {...args} />;
  };
}

const meta = {
  title: "Per Season Components/Season Games Loader",
  component: SeasonGamesLoader,
  tags: ["autodocs"],
  args: {
    segment: "2026-playoffs",
  },
} satisfies Meta<typeof SeasonGamesLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  render: withFetch(() =>
    Promise.resolve(new Response(JSON.stringify(sampleGames), { status: 200 })),
  ),
};

export const Loading: Story = {
  render: withFetch(() => new Promise(() => {})),
};

export const LoadError: Story = {
  render: withFetch(() => Promise.resolve(new Response(null, { status: 404 }))),
};
