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
    actions: [],
  },
} satisfies Meta<typeof GameFlowRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithOvertime: Story = {
  args: {
    overtimes: 1,
  },
};
