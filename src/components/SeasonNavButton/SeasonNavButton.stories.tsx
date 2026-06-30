import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SeasonNavButton from "./SeasonNavButton";

const meta = {
  title: "Components/SeasonNavButton",
  component: SeasonNavButton,
  tags: ["autodocs"],
  args: {
    href: "/seasons/2025-26-playoffs",
    seasonTitle: "2025-26 Playoffs",
    selected: false,
  },
} satisfies Meta<typeof SeasonNavButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
