import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { BoxScorePlayer } from "@/lib/nba-data";

import BoxScoreTable from "./BoxScoreTable";

function player( overrides: Partial<BoxScorePlayer> & Pick<BoxScorePlayer, "personId" | "playerName"> ): BoxScorePlayer {
  return {
    jerseyNumber: null,
    position: null,
    starter: false,
    played: true,
    playingStatus: "ACTIVE",
    teamTricode: "BOS",
    homeAway: "home",
    minutesPlayed: 0,
    points: 0,
    trueShootingPct: null,
    usagePct: null,
    per: null,
    rebounds: 0,
    reboundsOffensive: 0,
    reboundsDefensive: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    personalFouls: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    freeThrowPct: 0,
    twoPointMade: 0,
    twoPointAttempted: 0,
    twoPointPct: 0,
    threePointMade: 0,
    threePointAttempted: 0,
    threePointPct: 0,
    plusMinus: 0,
    ...overrides,
  };
}

const meta = {
  title: "Components/Game/BoxScoreTable",
  component: BoxScoreTable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    teamName: "Boston Celtics",
    players: [
      player( {
        personId: 1, playerName: "J. Tatum", jerseyNumber: "0", position: "SF", starter: true,
        minutesPlayed: 38, points: 32, trueShootingPct: 0.612, usagePct: 31.4, per: 24.8,
        rebounds: 7, reboundsOffensive: 1, reboundsDefensive: 6, assists: 5, steals: 1, blocks: 0, turnovers: 3, personalFouls: 2,
        freeThrowsMade: 6, freeThrowsAttempted: 7, freeThrowPct: 0.857,
        twoPointMade: 8, twoPointAttempted: 14, twoPointPct: 0.571,
        threePointMade: 3, threePointAttempted: 8, threePointPct: 0.375,
        plusMinus: 12,
      } ),
      player( {
        personId: 2, playerName: "J. Brown", jerseyNumber: "7", position: "SG", starter: true,
        minutesPlayed: 36, points: 24, trueShootingPct: 0.548, usagePct: 27.1, per: 18.2,
        rebounds: 5, reboundsOffensive: 2, reboundsDefensive: 3, assists: 3, steals: 2, blocks: 1, turnovers: 2, personalFouls: 3,
        freeThrowsMade: 4, freeThrowsAttempted: 5, freeThrowPct: 0.8,
        twoPointMade: 7, twoPointAttempted: 15, twoPointPct: 0.467,
        threePointMade: 2, threePointAttempted: 6, threePointPct: 0.333,
        plusMinus: 9,
      } ),
      player( {
        personId: 3, playerName: "K. Porzingis", jerseyNumber: "8", position: "C", starter: true,
        minutesPlayed: 29, points: 18, trueShootingPct: 0.601, usagePct: 24.5, per: 20.1,
        rebounds: 8, reboundsOffensive: 3, reboundsDefensive: 5, assists: 1, steals: 0, blocks: 3, turnovers: 1, personalFouls: 4,
        freeThrowsMade: 2, freeThrowsAttempted: 2, freeThrowPct: 1,
        twoPointMade: 6, twoPointAttempted: 10, twoPointPct: 0.6,
        threePointMade: 2, threePointAttempted: 4, threePointPct: 0.5,
        plusMinus: 6,
      } ),
      player( {
        personId: 4, playerName: "D. White", jerseyNumber: "9", position: "PG", starter: true,
        minutesPlayed: 34, points: 14, trueShootingPct: 0.523, usagePct: 18.3, per: 15.4,
        rebounds: 4, reboundsOffensive: 0, reboundsDefensive: 4, assists: 7, steals: 1, blocks: 1, turnovers: 2, personalFouls: 1,
        freeThrowsMade: 2, freeThrowsAttempted: 2, freeThrowPct: 1,
        twoPointMade: 3, twoPointAttempted: 7, twoPointPct: 0.429,
        threePointMade: 2, threePointAttempted: 5, threePointPct: 0.4,
        plusMinus: 4,
      } ),
      player( {
        personId: 5, playerName: "A. Horford", jerseyNumber: "42", position: "PF", starter: true,
        minutesPlayed: 26, points: 9, trueShootingPct: 0.55, usagePct: 12.1, per: 12.6,
        rebounds: 6, reboundsOffensive: 1, reboundsDefensive: 5, assists: 2, steals: 1, blocks: 1, turnovers: 0, personalFouls: 2,
        freeThrowsMade: 1, freeThrowsAttempted: 1, freeThrowPct: 1,
        twoPointMade: 2, twoPointAttempted: 4, twoPointPct: 0.5,
        threePointMade: 1, threePointAttempted: 3, threePointPct: 0.333,
        plusMinus: 3,
      } ),
      player( {
        personId: 6, playerName: "P. Pritchard", jerseyNumber: "11", position: "PG",
        minutesPlayed: 18, points: 11, trueShootingPct: 0.605, usagePct: 19.8, per: 16.9,
        rebounds: 2, reboundsOffensive: 0, reboundsDefensive: 2, assists: 3, steals: 0, blocks: 0, turnovers: 1, personalFouls: 1,
        freeThrowsMade: 0, freeThrowsAttempted: 0, freeThrowPct: 0,
        twoPointMade: 2, twoPointAttempted: 3, twoPointPct: 0.667,
        threePointMade: 2, threePointAttempted: 4, threePointPct: 0.5,
        plusMinus: -2,
      } ),
      player( {
        personId: 7, playerName: "S. Pritchard", jerseyNumber: "12", position: "SG",
        played: false, playingStatus: "ACTIVE",
      } ),
      player( {
        personId: 8, playerName: "L. Kornet", jerseyNumber: "40", position: "C",
        played: false, playingStatus: "INACTIVE",
      } ),
    ],
  },
} satisfies Meta<typeof BoxScoreTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllDidNotPlay: Story = {
  args: {
    teamName: "Bench-Heavy Squad",
    players: [
      player( { personId: 1, playerName: "R. Bench", jerseyNumber: "3", played: false, playingStatus: "ACTIVE" } ),
      player( { personId: 2, playerName: "T. Injured", jerseyNumber: "4", played: false, playingStatus: "INACTIVE" } ),
      player( { personId: 3, playerName: "G. TwoWay", jerseyNumber: "5", played: false, playingStatus: "INACTIVE" } ),
    ],
  },
};
