import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GamePageTitle from "./GamePageTitle";

const meta = {
  title: "Components/Game/GamePageTitle",
  component: GamePageTitle,
  tags: ["autodocs"],
  args: {
    awayTeam: "Detroit",
    awayScore: 115,
    homeTeam: "Cleveland",
    homeScore: 94,
  },
} satisfies Meta<typeof GamePageTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TeamNamesAndScores: Story = {};
