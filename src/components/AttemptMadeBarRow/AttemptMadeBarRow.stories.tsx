import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import AttemptMadeBarRow from "./AttemptMadeBarRow";

const meta = {
  title: "Components/AttemptMadeBarRow",
  component: AttemptMadeBarRow,
  tags: ["autodocs"],
  argTypes: {
    pctCalloutPosition: { control: "radio", options: ["top", "bottom"] },
    includePctBadge: { control: "boolean" },
    includeMissedAmt: { control: "boolean" },
    includeTotal: { control: "boolean" },
  },
  args: {
    label: "NYK",
    attempts: 91,
    made: 38,
    scale: 1,
    pctCalloutPosition: "top",
    includePctBadge: false,
    includeMissedAmt: false,
    includeTotal: true,
    teamColor: undefined,
  },
} satisfies Meta<typeof AttemptMadeBarRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoLabel: Story = {
  args: {
    label: undefined,
  },
};

export const ScaledDown: Story = {
  args: {
    scale: 0.7,
  },
};

export const WithPctBadgeBottom: Story = {
  args: {
    includePctBadge: true,
    pctCalloutPosition: "bottom",
  },
};

export const WithMissedAmount: Story = {
  args: {
    includeMissedAmt: true,
  },
};

export const WithTeamColor: Story = {
  args: {
    teamColor: "#C8102E",
  },
};
