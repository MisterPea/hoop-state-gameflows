import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SeasonNavButtonRow from "./SeasonNavButtonRow";

const meta = {
  title: "Per Season Components/Season Nav Button Row",
  component: SeasonNavButtonRow,
  tags: ["autodocs"],
  args: {
    items: [
      {
        href: "/seasons/2025-26-playoffs",
        label: "2025-26 Playoffs",
        segment: "2025-26-playoffs",
        season: "2025-26",
        categories: ["playoffs", "finals"],
      },
      {
        href: "/seasons/2025-26-nba-cup",
        label: "2025-26 NBA Cup",
        segment: "2025-26-nba-cup",
        season: "2025-26",
        categories: ["nba_cup", "nba_cup_final"],
      },
      {
        href: "/seasons/2025-26-play-in",
        label: "2025-26 Play-In",
        segment: "2025-26-play-in",
        season: "2025-26",
        categories: ["play_in"],
      },
      {
        href: "/seasons/2025-26-regular-season",
        label: "2025-26 Regular Season",
        segment: "2025-26-regular-season",
        season: "2025-26",
        categories: ["regular_season"],
      },
      {
        href: "/seasons/2024-25-playoffs",
        label: "2024-25 Playoffs",
        segment: "2024-25-playoffs",
        season: "2024-25",
        categories: ["playoffs", "finals"],
      },
      {
        href: "/seasons/2024-25-regular-season",
        label: "2024-25 Regular Season",
        segment: "2024-25-regular-season",
        season: "2024-25",
        categories: ["regular_season"],
      },
    ],
  },
} satisfies Meta<typeof SeasonNavButtonRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
