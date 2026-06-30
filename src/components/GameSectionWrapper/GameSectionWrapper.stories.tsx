import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import GameSectionWrapper from "./GameSectionWrapper";

const meta = {
  title: "Components/GameSectionWrapper",
  component: GameSectionWrapper,
  tags: ["autodocs"],
  args: {
    title: "Game Flow",
    children: <p>Section content goes here.</p>,
  },
} satisfies Meta<typeof GameSectionWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
