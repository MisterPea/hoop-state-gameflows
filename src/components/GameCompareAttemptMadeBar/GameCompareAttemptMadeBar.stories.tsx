import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GameCompareAttemptMadeBar from "./GameCompareAttemptMadeBar";

const meta = {
  title: "Components/GameCompareAttemptMadeBar",
  component: GameCompareAttemptMadeBar,
  tags: ["autodocs"],
  argTypes: {
    includePctBadge: { control: "boolean" },
  },
  args: {
    awayTricode: "NYK",
    awayAttempts: 91,
    awayMade: 38,
    homeTricode: "BOS",
    homeAttempts: 88,
    homeMade: 42,
    chartLabel: undefined,
    includePctBadge: false,
    homeTeamColor: undefined,
    awayTeamColor: undefined,
  },
} satisfies Meta<typeof GameCompareAttemptMadeBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HomeFavored: Story = {
  args: {
    homeAttempts: 90,
    homeMade: 48,
    awayAttempts: 85,
    awayMade: 34,
  },
};

export const AwayFavored: Story = {
  args: {
    homeAttempts: 82,
    homeMade: 31,
    awayAttempts: 89,
    awayMade: 45,
  },
};

export const EvenSplit: Story = {
  args: {
    homeAttempts: 86,
    homeMade: 40,
    awayAttempts: 86,
    awayMade: 40,
  },
};

export const WithLabels: Story = {
  args: {
    chartLabel: "Field Goals",
    includePctBadge: true,
  },
};

export const WithTeamColors: Story = {
  args: {
    homeTeamColor: "#1F9952",
    awayTeamColor: "#C8102E",
  },
};
