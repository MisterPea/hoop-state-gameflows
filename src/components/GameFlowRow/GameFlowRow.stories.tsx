import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GameFlowRow from "./GameFlowRow";

const meta = {
  title: "Components/Game/GameFlowRow",
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
    teamColorAccent: "#E8BB66",
    segments: [
      {
        period: 1, entrySeconds: 720, exitSeconds: 360,
        stats: { twoPointMade: 2, twoPointAttempted: 3, threePointMade: 1, threePointAttempted: 2, freeThrowsMade: 2, freeThrowsAttempted: 2, personalFouls: 0 },
      },
      {
        period: 2, entrySeconds: 720, exitSeconds: 0,
        stats: { twoPointMade: 1, twoPointAttempted: 4, threePointMade: 0, threePointAttempted: 1, freeThrowsMade: 0, freeThrowsAttempted: 0, personalFouls: 1 },
      },
      {
        period: 3, entrySeconds: 720, exitSeconds: 240,
        stats: { twoPointMade: 0, twoPointAttempted: 0, threePointMade: 0, threePointAttempted: 0, freeThrowsMade: 0, freeThrowsAttempted: 0, personalFouls: 0 },
      },
      {
        period: 4, entrySeconds: 600, exitSeconds: 0,
        stats: { twoPointMade: 3, twoPointAttempted: 5, threePointMade: 2, threePointAttempted: 3, freeThrowsMade: 4, freeThrowsAttempted: 4, personalFouls: 2 },
      },
    ],
  },
  decorators: [
    ( Story ) => (
      <div style={{ padding: "100px 20px 20px" }}>
        <Story />
      </div>
    )
  ]
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
      {
        period: 1, entrySeconds: 360, exitSeconds: 0,
        stats: { twoPointMade: 1, twoPointAttempted: 2, threePointMade: 0, threePointAttempted: 0, freeThrowsMade: 0, freeThrowsAttempted: 0, personalFouls: 1 },
      },
      {
        period: 3, entrySeconds: 480, exitSeconds: 120,
        stats: { twoPointMade: 2, twoPointAttempted: 2, threePointMade: 1, threePointAttempted: 1, freeThrowsMade: 0, freeThrowsAttempted: 0, personalFouls: 0 },
      },
      {
        period: 4, entrySeconds: 360, exitSeconds: 120,
        stats: { twoPointMade: 0, twoPointAttempted: 1, threePointMade: 0, threePointAttempted: 2, freeThrowsMade: 0, freeThrowsAttempted: 0, personalFouls: 1 },
      },
    ],
  },
};

export const WithOvertime: Story = {
  args: {
    overtimes: 1,
    segments: [
      {
        period: 1, entrySeconds: 720, exitSeconds: 0,
        stats: { twoPointMade: 3, twoPointAttempted: 6, threePointMade: 1, threePointAttempted: 3, freeThrowsMade: 2, freeThrowsAttempted: 2, personalFouls: 1 },
      },
      {
        period: 2, entrySeconds: 720, exitSeconds: 360,
        stats: { twoPointMade: 1, twoPointAttempted: 1, threePointMade: 0, threePointAttempted: 0, freeThrowsMade: 0, freeThrowsAttempted: 0, personalFouls: 0 },
      },
      {
        period: 3, entrySeconds: 720, exitSeconds: 0,
        stats: { twoPointMade: 2, twoPointAttempted: 4, threePointMade: 1, threePointAttempted: 2, freeThrowsMade: 1, freeThrowsAttempted: 2, personalFouls: 2 },
      },
      {
        period: 4, entrySeconds: 720, exitSeconds: 0,
        stats: { twoPointMade: 2, twoPointAttempted: 3, threePointMade: 0, threePointAttempted: 1, freeThrowsMade: 0, freeThrowsAttempted: 0, personalFouls: 1 },
      },
      {
        period: 5, entrySeconds: 300, exitSeconds: 0,
        stats: { twoPointMade: 1, twoPointAttempted: 2, threePointMade: 1, threePointAttempted: 1, freeThrowsMade: 3, freeThrowsAttempted: 4, personalFouls: 1 },
      },
    ],
  },
};
