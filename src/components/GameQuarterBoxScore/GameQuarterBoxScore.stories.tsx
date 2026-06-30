import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GameQuarterBoxScore from "./GameQuarterBoxScore";

const meta = {
  title: "Components/GameQuarterBoxScore",
  component: GameQuarterBoxScore,
  tags: ["autodocs"],
  args: {
    boxScoreTitle: "Q1",
    points: 31,
    fieldGoalMade: 11,
    fieldGoalAttempt: 24,
    threePointMade: 4,
    threePointAttempt: 9,
    blocks: 3,
    offensiveRebound: 5,
    defensiveRebound: 14,
    assists: 8,
    turnovers: 4,
    steals: 2,
    personalFouls: 7,
    freeThrowMade: 5,
    freeThrowAttempt: 6,
    assistToTurnover: 2.0,
  },
} satisfies Meta<typeof GameQuarterBoxScore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoAssistToTurnover: Story = {
  args: {
    assistToTurnover: undefined,
  },
};
