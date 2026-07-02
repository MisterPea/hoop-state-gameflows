import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import LineupBar from "./LineupBar";

const starters = [
  { personId: 1, playerName: "J. Brunson" },
  { personId: 2, playerName: "O. Anunoby" },
  { personId: 3, playerName: "K. Towns" },
  { personId: 4, playerName: "M. Bridges" },
  { personId: 5, playerName: "J. Hart" },
];

const bench = [
  { personId: 6, playerName: "D. DiVincenzo" },
  { personId: 7, playerName: "P. Achiuwa" },
  { personId: 8, playerName: "M. Robinson" },
  { personId: 9, playerName: "M. McBride" },
  { personId: 10, playerName: "C. Payne" },
];

const meta = {
  title: "Components/LineupBar",
  component: LineupBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: "100px 20px 20px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    overtimes: 0,
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 400, plusMinus: 8, lineup: starters },
      { period: 1, entrySeconds: 400, exitSeconds: 0, plusMinus: -3, lineup: bench },
      { period: 2, entrySeconds: 720, exitSeconds: 480, plusMinus: 5, lineup: starters },
      { period: 2, entrySeconds: 480, exitSeconds: 240, plusMinus: -7, lineup: bench },
      { period: 2, entrySeconds: 240, exitSeconds: 0, plusMinus: 2, lineup: starters },
      { period: 3, entrySeconds: 720, exitSeconds: 360, plusMinus: -10, lineup: bench },
      { period: 3, entrySeconds: 360, exitSeconds: 0, plusMinus: 4, lineup: starters },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: 6, lineup: starters },
    ],
  },
} satisfies Meta<typeof LineupBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dominant: Story = {
  args: {
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 0, plusMinus: 12, lineup: starters },
      { period: 2, entrySeconds: 720, exitSeconds: 400, plusMinus: 8, lineup: starters },
      { period: 2, entrySeconds: 400, exitSeconds: 0, plusMinus: 6, lineup: bench },
      { period: 3, entrySeconds: 720, exitSeconds: 0, plusMinus: 10, lineup: starters },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: 9, lineup: starters },
    ],
  },
};

export const Struggling: Story = {
  args: {
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 0, plusMinus: -8, lineup: starters },
      { period: 2, entrySeconds: 720, exitSeconds: 300, plusMinus: -12, lineup: bench },
      { period: 2, entrySeconds: 300, exitSeconds: 0, plusMinus: -4, lineup: starters },
      { period: 3, entrySeconds: 720, exitSeconds: 0, plusMinus: -9, lineup: bench },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: -6, lineup: starters },
    ],
  },
};

export const WithOvertime: Story = {
  args: {
    overtimes: 1,
    intervals: [
      { period: 1, entrySeconds: 720, exitSeconds: 0, plusMinus: 4, lineup: starters },
      { period: 2, entrySeconds: 720, exitSeconds: 0, plusMinus: -3, lineup: bench },
      { period: 3, entrySeconds: 720, exitSeconds: 0, plusMinus: 6, lineup: starters },
      { period: 4, entrySeconds: 720, exitSeconds: 0, plusMinus: -4, lineup: bench },
      { period: 5, entrySeconds: 300, exitSeconds: 150, plusMinus: 2, lineup: starters },
      { period: 5, entrySeconds: 150, exitSeconds: 0, plusMinus: -1, lineup: bench },
    ],
  },
};
