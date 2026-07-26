import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MainPageGameCard from "./MainPageGameCard";

const meta = {
  title: "Per Season Components/Game Card",
  component: MainPageGameCard,
  tags: ["autodocs"],
  args: {
    awayPoints: 110,
    awayTeam: 'Atlanta',
    gameDate: '2025-10-29',
    gameId: '0022500130',
    homePoints: 112,
    homeTeam: 'Brooklyn',
    gameLabel: null,
    gameSubLabel: null
  },
} satisfies Meta<typeof MainPageGameCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HomeWin: Story = {};

export const AwayWin: Story = {
  args: {
    awayPoints: 122,
    awayTeam: 'Phoenix',
    gameDate: '2025-10-24',
    gameId: '0022500099',
    homePoints: 109,
    homeTeam: 'LA Clippers',
    gameLabel: null,
    gameSubLabel: null
  },
};

export const SingleLabel: Story = {
  args: {
    awayPoints: 122,
    awayTeam: 'Phoenix',
    gameDate: '2025-10-24',
    gameId: '0022500099',
    homePoints: 109,
    homeTeam: 'LA Clippers',
    gameLabel: 'AWS NBA Rivals Week',
    gameSubLabel: null
  },
};

export const RecordFallback: Story = {
  args: {
    awayPoints: 108,
    awayTeam: 'Houston',
    awayTricode: 'HOU',
    awayWins: 10,
    awayLosses: 12,
    gameDate: '2025-12-15',
    gameId: '0022500345',
    homePoints: 101,
    homeTeam: 'San Antonio',
    homeTricode: 'SAS',
    homeWins: 14,
    homeLosses: 9,
    gameLabel: null,
    gameSubLabel: null
  }
};

export const PlayIn: Story = {
  args: {
    awayPoints: 114,
    awayTeam: 'Portland',
    awaySeed: 8,
    gameDate: '2026-04-14',
    gameId: '0052500121',
    homePoints: 110,
    homeTeam: 'Phoenix',
    homeSeed: 7,
    gameLabel: 'SoFi Play-In Tournament',
    gameSubLabel: 'West'
  }
};
