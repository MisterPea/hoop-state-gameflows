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
          gameDate: "2026-05-15",
          gameId: "0042500236",
          homePoints: 109,
          homeTeam: "Minnesota",
          gameLabel: null,
          gameSubLabel: null,
        },
        {
          awayPoints: 115,
          awayTeam: "Detroit",
          gameDate: "2026-05-15",
          gameId: "0042500206",
          homePoints: 94,
          homeTeam: "Cleveland",
          gameLabel: null,
          gameSubLabel: null,
        },
      ],
      "2026-05-13": [
        {
          awayPoints: 117,
          awayTeam: "Cleveland",
          gameDate: "2026-05-13",
          gameId: "0042500205",
          homePoints: 113,
          homeTeam: "Detroit",
          gameLabel: null,
          gameSubLabel: null,
        },
      ],
      "2026-05-12": [
        {
          awayPoints: 97,
          awayTeam: "Minnesota",
          gameDate: "2026-05-12",
          gameId: "0042500235",
          homePoints: 126,
          homeTeam: "San Antonio",
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
          gameDate: "2026-05-05",
          gameId: "0042500221",
          homePoints: 108,
          homeTeam: "Oklahoma City",
          gameLabel: "West Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
        {
          awayPoints: 101,
          awayTeam: "Cleveland",
          gameDate: "2026-05-05",
          gameId: "0042500201",
          homePoints: 111,
          homeTeam: "Detroit",
          gameLabel: "East Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
      ],
      "2026-05-04": [
        {
          awayPoints: 104,
          awayTeam: "Minnesota",
          gameDate: "2026-05-04",
          gameId: "0042500231",
          homePoints: 102,
          homeTeam: "San Antonio",
          gameLabel: "West Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
        {
          awayPoints: 98,
          awayTeam: "Philadelphia",
          gameDate: "2026-05-04",
          gameId: "0042500211",
          homePoints: 137,
          homeTeam: "New York",
          gameLabel: "East Conf. Semifinals",
          gameSubLabel: "Game 1",
        },
      ],
      '2026-05-01': [
        {
          awayPoints: 98,
          awayTeam: 'LA Lakers',
          gameDate: '2026-05-01',
          gameId: '0042500176',
          homePoints: 78,
          homeTeam: 'Houston',
          gameLabel: 'West First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 110,
          awayTeam: 'Cleveland',
          gameDate: '2026-05-01',
          gameId: '0042500136',
          homePoints: 112,
          homeTeam: 'Toronto',
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 93,
          awayTeam: 'Detroit',
          gameDate: '2026-05-01',
          gameId: '0042500106',
          homePoints: 79,
          homeTeam: 'Orlando',
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        }
      ],
      '2026-04-30': [
        {
          awayPoints: 98,
          awayTeam: 'Denver',
          gameDate: '2026-04-30',
          gameId: '0042500166',
          homePoints: 110,
          homeTeam: 'Minnesota',
          gameLabel: 'West First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 140,
          awayTeam: 'New York',
          gameDate: '2026-04-30',
          gameId: '0042500126',
          homePoints: 89,
          homeTeam: 'Atlanta',
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        },
        {
          awayPoints: 93,
          awayTeam: 'Boston',
          gameDate: '2026-04-30',
          gameId: '0042500116',
          homePoints: 106,
          homeTeam: 'Philadelphia',
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 6'
        }
      ],
      '2026-04-29': [
        {
          awayPoints: 99,
          awayTeam: 'Houston',
          gameDate: '2026-04-29',
          gameId: '0042500175',
          homePoints: 93,
          homeTeam: 'LA Lakers',
          gameLabel: 'West First Round',
          gameSubLabel: 'Game 5'
        },
        {
          awayPoints: 120,
          awayTeam: 'Toronto',
          gameDate: '2026-04-29',
          gameId: '0042500135',
          homePoints: 125,
          homeTeam: 'Cleveland',
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 5'
        },
        {
          awayPoints: 109,
          awayTeam: 'Orlando',
          gameDate: '2026-04-29',
          gameId: '0042500105',
          homePoints: 116,
          homeTeam: 'Detroit',
          gameLabel: 'East First Round',
          gameSubLabel: 'Game 5'
        }
      ],
    },
  },
};
