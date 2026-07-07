import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MainPageDateGameSection from "./MainPageDateGameSection";

const meta = {
  title: "Components/MainPageDateGameSection",
  component: MainPageDateGameSection,
  tags: ["autodocs"],
  args: {
    gamesData: {
      "2026-05-15": [
        {
          awayPoints: 139,
          awayTeam: "San Antonio",
          awaySeed: null,
          gameDate: "2026-05-15",
          gameId: "0042500236",
          homePoints: 109,
          homeTeam: "Minnesota",
          homeSeed: null,
          gameLabel: null,
          gameSubLabel: null,
        },
        {
          awayPoints: 115,
          awayTeam: "Detroit",
          awaySeed: null,
          gameDate: "2026-05-15",
          gameId: "0042500206",
          homePoints: 94,
          homeTeam: "Cleveland",
          homeSeed: null,
          gameLabel: null,
          gameSubLabel: null,
        },
      ],
      "2026-05-13": [
        {
          awayPoints: 117,
          awayTeam: "Cleveland",
          awaySeed: null,
          gameDate: "2026-05-13",
          gameId: "0042500205",
          homePoints: 113,
          homeTeam: "Detroit",
          homeSeed: null,
          gameLabel: null,
          gameSubLabel: null,
        },
      ],
      "2026-05-12": [
        {
          awayPoints: 97,
          awayTeam: "Minnesota",
          awaySeed: null,
          gameDate: "2026-05-12",
          gameId: "0042500235",
          homePoints: 126,
          homeTeam: "San Antonio",
          homeSeed: null,
          gameLabel: null,
          gameSubLabel: null,
        },
      ],
    },
  },
} satisfies Meta<typeof MainPageDateGameSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithGameLabels: Story = {
  args: {
    gamesData: {
      "2026-05-05": [
        {
          awayPoints: 90,
          awayTeam: "LA Lakers",
          awaySeed: 3,
          gameDate: "2026-05-05",
          gameId: "0042500221",
          homePoints: 108,
          homeTeam: "Oklahoma City",
          homeSeed: 1,
          gameLabel: "West Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
        {
          awayPoints: 101,
          awayTeam: "Cleveland",
          awaySeed: 2,
          gameDate: "2026-05-05",
          gameId: "0042500201",
          homePoints: 111,
          homeTeam: "Detroit",
          homeSeed: 1,
          gameLabel: "East Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
      ],
      "2026-05-04": [
        {
          awayPoints: 104,
          awayTeam: "Minnesota",
          awaySeed: 4,
          gameDate: "2026-05-04",
          gameId: "0042500231",
          homePoints: 102,
          homeTeam: "San Antonio",
          homeSeed: 2,
          gameLabel: "West Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
        {
          awayPoints: 98,
          awayTeam: "Philadelphia",
          awaySeed: 3,
          gameDate: "2026-05-04",
          gameId: "0042500211",
          homePoints: 137,
          homeTeam: "New York",
          homeSeed: 2,
          gameLabel: "East Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
      ],
      '2026-05-01': [
        {
          awayPoints: 98,
          awayTeam: 'LA Lakers',
          awaySeed: 3,
          gameDate: '2026-05-01',
          gameId: '0042500176',
          homePoints: 78,
          homeTeam: 'Houston',
          homeSeed: 6,
          gameLabel: 'West First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 110,
          awayTeam: 'Cleveland',
          awaySeed: 2,
          gameDate: '2026-05-01',
          gameId: '0042500136',
          homePoints: 112,
          homeTeam: 'Toronto',
          homeSeed: 7,
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 93,
          awayTeam: 'Detroit',
          awaySeed: 1,
          gameDate: '2026-05-01',
          gameId: '0042500106',
          homePoints: 79,
          homeTeam: 'Orlando',
          homeSeed: 8,
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        }
      ],
      '2026-04-30': [
        {
          awayPoints: 98,
          awayTeam: 'Denver',
          awaySeed: 4,
          gameDate: '2026-04-30',
          gameId: '0042500166',
          homePoints: 110,
          homeTeam: 'Minnesota',
          homeSeed: 5,
          gameLabel: 'West First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 140,
          awayTeam: 'New York',
          awaySeed: 2,
          gameDate: '2026-04-30',
          gameId: '0042500126',
          homePoints: 89,
          homeTeam: 'Atlanta',
          homeSeed: 7,
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 93,
          awayTeam: 'Boston',
          awaySeed: 3,
          gameDate: '2026-04-30',
          gameId: '0042500116',
          homePoints: 106,
          homeTeam: 'Philadelphia',
          homeSeed: 6,
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        }
      ],
      '2026-04-29': [
        {
          awayPoints: 99,
          awayTeam: 'Houston',
          awaySeed: 6,
          gameDate: '2026-04-29',
          gameId: '0042500175',
          homePoints: 93,
          homeTeam: 'LA Lakers',
          homeSeed: 3,
          gameLabel: 'West First Round',
          gameSubLabel: 'Game 5'
        },
        {
          awayPoints: 120,
          awayTeam: 'Toronto',
          awaySeed: 7,
          gameDate: '2026-04-29',
          gameId: '0042500135',
          homePoints: 125,
          homeTeam: 'Cleveland',
          homeSeed: 2,
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 5'
        },
        {
          awayPoints: 109,
          awayTeam: 'Orlando',
          awaySeed: 8,
          gameDate: '2026-04-29',
          gameId: '0042500105',
          homePoints: 116,
          homeTeam: 'Detroit',
          homeSeed: 1,
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 5'
        }
      ],
    },
  },
};
