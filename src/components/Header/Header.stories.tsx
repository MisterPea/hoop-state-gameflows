import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Header from "./Header";

const meta = {
  title: "Components/Main/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isGamePage: true,
  },
  argTypes: {
    isGamePage: {
      control: "boolean",
      description: "Toggles between the game page and main page header variants.",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GamePage: Story = {};

export const MainPage: Story = {
  args: {
    isGamePage: false,
  },
};
