import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ShotChartPoint } from "@/lib/nba-data";

import ShotChart from "./ShotChart";

const shots: ShotChartPoint[] = [
  // Rim
  {
    actionNumber: 1,
    x: 4,
    y: 48,
    made: true,
    zone: "rim",
    period: 1,
    clockSeconds: 615,
    description: "J. Tatum makes driving layup",
  },
  {
    actionNumber: 2,
    x: 5,
    y: 52,
    made: false,
    zone: "rim",
    period: 1,
    clockSeconds: 480,
    description: "J. Tatum misses layup",
  },
  {
    actionNumber: 3,
    x: 3,
    y: 50,
    made: true,
    zone: "rim",
    period: 2,
    clockSeconds: 690,
    description: "J. Tatum makes dunk",
  },
  {
    actionNumber: 4,
    x: 6,
    y: 58,
    made: true,
    zone: "rim",
    period: 3,
    clockSeconds: 300,
    description: "J. Tatum makes cutting layup",
  },
  // Paint
  {
    actionNumber: 5,
    x: 10,
    y: 40,
    made: true,
    zone: "paint",
    period: 1,
    clockSeconds: 210,
    description: "J. Tatum makes floating jump shot",
  },
  {
    actionNumber: 6,
    x: 12,
    y: 60,
    made: false,
    zone: "paint",
    period: 2,
    clockSeconds: 555,
    description: "J. Tatum misses turnaround jump shot",
  },
  {
    actionNumber: 7,
    x: 9,
    y: 55,
    made: true,
    zone: "paint",
    period: 4,
    clockSeconds: 640,
    description: "J. Tatum makes hook shot",
  },
  // Mid-range
  {
    actionNumber: 8,
    x: 20,
    y: 30,
    made: false,
    zone: "mid",
    period: 1,
    clockSeconds: 90,
    description: "J. Tatum misses pullup jump shot",
  },
  {
    actionNumber: 9,
    x: 22,
    y: 70,
    made: true,
    zone: "mid",
    period: 3,
    clockSeconds: 450,
    description: "J. Tatum makes step back jump shot",
  },
  {
    actionNumber: 10,
    x: 19,
    y: 50,
    made: false,
    zone: "mid",
    period: 4,
    clockSeconds: 120,
    description: "J. Tatum misses fadeaway jump shot",
  },
  // Three
  {
    actionNumber: 11,
    x: 28,
    y: 15,
    made: true,
    zone: "three",
    period: 1,
    clockSeconds: 335,
    description: "J. Tatum makes corner 3-pt jump shot",
  },
  {
    actionNumber: 12,
    x: 30,
    y: 85,
    made: false,
    zone: "three",
    period: 2,
    clockSeconds: 60,
    description: "J. Tatum misses corner 3-pt jump shot",
  },
  {
    actionNumber: 13,
    x: 35,
    y: 50,
    made: true,
    zone: "three",
    period: 3,
    clockSeconds: 705,
    description: "J. Tatum makes 3-pt jump shot",
  },
  {
    actionNumber: 14,
    x: 33,
    y: 40,
    made: false,
    zone: "three",
    period: 4,
    clockSeconds: 400,
    description: "J. Tatum misses step back 3-pt jump shot",
  },
  {
    actionNumber: 15,
    x: 38,
    y: 60,
    made: true,
    zone: "three",
    period: 5,
    clockSeconds: 180,
    description: "J. Tatum makes 3-pt jump shot",
  },
];

const meta = {
  title: "Per Game Components/Shot Chart",
  component: ShotChart,
  tags: ["autodocs"],
  decorators: [
    ( Story ) => (
      <div>
        <Story />
      </div>
    )
  ],
  args: {
    teamName: "Boston Celtics",
    tricode: "BOS",
    shots,
  },
} satisfies Meta<typeof ShotChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HotShooting: Story = {
  args: {
    shots: shots.map( ( shot ) => ( { ...shot, made: true } ) ),
  },
};

export const ColdShooting: Story = {
  args: {
    shots: shots.map( ( shot ) => ( { ...shot, made: false } ) ),
  },
};
