import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GamePageTitle from "./GamePageTitle";

const meta = {
  title: "Per Game Components/Game Title",
  component: GamePageTitle,
  tags: ["autodocs"],
  args: {
    awayTeam: "Detroit",
    awayScore: 115,
    awayTricode: "DET",
    homeTeam: "Cleveland",
    homeScore: 94,
    homeTricode: "CLE",
  },
} satisfies Meta<typeof GamePageTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TeamNamesAndScores: Story = {};
