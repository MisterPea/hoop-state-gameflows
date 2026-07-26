import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GamePageTitleInfo from "./GamePageTitleInfo";

const meta = {
  title: "Per Game Components/Game Info",
  component: GamePageTitleInfo,
  tags: ["autodocs"],
  args: {
    title: "Game Id:",
    data: "0022500094",
  },
} satisfies Meta<typeof GamePageTitleInfo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithData: Story = {};

export const WithReferees: Story = {
  args: {
    title: "Officials:",
    data: undefined,
    referee1: "John Goble",
    referee2: "Rodney Mott",
    referee3: "Kevin Scott",
  },
};

export const WithAltReferee: Story = {
  args: {
    title: "Officials:",
    data: undefined,
    referee1: "John Goble",
    referee2: "Rodney Mott",
    referee3: "Kevin Scott",
    refereeAlt: "Phenizee Ransom",
  },
};
