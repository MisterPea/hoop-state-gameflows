import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SeasonNavButton from "./SeasonNavButton";

const meta = {
  title: "Components/Seasons/SeasonNavButton",
  component: SeasonNavButton,
  tags: ["autodocs"],
  args: {
    label: "2025-26 Playoffs",
    selected: false,
    onClick: () => {},
  },
} satisfies Meta<typeof SeasonNavButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
