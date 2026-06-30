import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SeasonNavButtonRow from "./SeasonNavButtonRow";

const meta = {
  title: "Components/SeasonNavButtonRow",
  component: SeasonNavButtonRow,
  tags: ["autodocs"],
  args: {
    items: [
      { href: "/seasons/2025-26-playoffs", label: "2025-26 Playoffs", segment: "2025-26-playoffs" },
      { href: "/seasons/2025-26-nba-cup", label: "2025-26 NBA Cup", segment: "2025-26-nba-cup" },
      { href: "/seasons/2025-26-play-in", label: "2025-26 Play-In", segment: "2025-26-play-in" },
      { href: "/seasons/2025-26-regular-season", label: "2025-26 Regular Season", segment: "2025-26-regular-season" },
    ],
  },
} satisfies Meta<typeof SeasonNavButtonRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
