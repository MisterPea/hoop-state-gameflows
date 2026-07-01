import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import LineupBar from "./LineupBar";

const meta = {
  title: "Components/LineupBar",
  component: LineupBar,
  tags: ["autodocs"],
  args: {
    overtimes: 0,
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 400, plusMinus: 8 },
      { period: 1, entrySeconds: 400, exitSeconds: 0, plusMinus: -3 },
      { period: 2, entrySeconds: 720, exitSeconds: 480, plusMinus: 5 },
      { period: 2, entrySeconds: 480, exitSeconds: 240, plusMinus: -7 },
      { period: 2, entrySeconds: 240, exitSeconds: 0, plusMinus: 2 },
      { period: 3, entrySeconds: 720, exitSeconds: 360, plusMinus: -10 },
      { period: 3, entrySeconds: 360, exitSeconds: 0, plusMinus: 4 },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: 6 },
    ],
  },
} satisfies Meta<typeof LineupBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dominant: Story = {
  args: {
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 0, plusMinus: 12 },
      { period: 2, entrySeconds: 720, exitSeconds: 400, plusMinus: 8 },
      { period: 2, entrySeconds: 400, exitSeconds: 0, plusMinus: 6 },
      { period: 3, entrySeconds: 720, exitSeconds: 0, plusMinus: 10 },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: 9 },
    ],
  },
};

export const Struggling: Story = {
  args: {
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 0, plusMinus: -8 },
      { period: 2, entrySeconds: 720, exitSeconds: 300, plusMinus: -12 },
      { period: 2, entrySeconds: 300, exitSeconds: 0, plusMinus: -4 },
      { period: 3, entrySeconds: 720, exitSeconds: 0, plusMinus: -9 },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: -6 },
    ],
  },
};

export const WithOvertime: Story = {
  args: {
    overtimes: 1,
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 0, plusMinus: 4 },
      { period: 2, entrySeconds: 720, exitSeconds: 0, plusMinus: -3 },
      { period: 3, entrySeconds: 720, exitSeconds: 0, plusMinus: 6 },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: -4 },
      { period: 5, entrySeconds: 300, exitSeconds: 150, plusMinus: 2 },
      { period: 5, entrySeconds: 150, exitSeconds: 0, plusMinus: -1 },
    ],
  },
};
