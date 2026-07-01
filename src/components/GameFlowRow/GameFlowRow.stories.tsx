import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GameFlowRow from "./GameFlowRow";

const meta = {
  title: "Components/GameFlowRow",
  component: GameFlowRow,
  tags: ["autodocs"],
  args: {
    player: "J. Tatum",
    minutes: 38,
    points: 32,
    rebounds: 7,
    assists: 5,
    plusMinus: 12,
    overtimes: 0,
    teamColor: "#007A33",
    segments: [
      { period: 1, entrySeconds: 720, exitSeconds: 360 },
      { period: 2, entrySeconds: 720, exitSeconds: 0 },
      { period: 3, entrySeconds: 720, exitSeconds: 240 },
      { period: 4, entrySeconds: 600, exitSeconds: 0 },
    ],
  },
} satisfies Meta<typeof GameFlowRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BenchPlayer: Story = {
  args: {
    player: "P. Pritchard",
    minutes: 22,
    points: 14,
    rebounds: 2,
    assists: 3,
    plusMinus: -4,
    segments: [
      { period: 1, entrySeconds: 360, exitSeconds: 0 },
      { period: 3, entrySeconds: 480, exitSeconds: 120 },
      { period: 4, entrySeconds: 360, exitSeconds: 120 },
    ],
  },
};

export const WithOvertime: Story = {
  args: {
    overtimes: 1,
    segments: [
      { period: 1, entrySeconds: 720, exitSeconds: 0 },
      { period: 2, entrySeconds: 720, exitSeconds: 360 },
      { period: 3, entrySeconds: 720, exitSeconds: 0 },
      { period: 4, entrySeconds: 720, exitSeconds: 0 },
      { period: 5, entrySeconds: 300, exitSeconds: 0 },
    ],
  },
};
