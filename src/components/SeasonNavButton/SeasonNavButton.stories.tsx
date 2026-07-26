import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SeasonNavButton from "./SeasonNavButton";

const meta = {
  title: "Per Season Components/Season Nav Button",
  component: SeasonNavButton,
  tags: ["autodocs"],
  args: {
    label: "2025-26 Playoffs",
    selected: false,
    onClick: () => {},
    href: "/seasons/2025-26-playoffs",
  },
} satisfies Meta<typeof SeasonNavButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
  },
};
