import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ScoreMarginChart from "./ScoreMarginChart";
import type { ScoreMarginPoint } from "@/lib/nba-data";

type RawPoint = { period: number; clockSeconds: number; margin: number; };

// Synthesizes plausible running scores from a margin sequence: away score climbs steadily,
// home score follows the margin off of it.
function withScores( raw: RawPoint[] ): ScoreMarginPoint[] {
  return raw.map( ( p, i ) => {
    const awayScore = i * 2;
    return { ...p, awayScore, homeScore: awayScore + p.margin };
  } );
}

const closeGamePoints = withScores( [
  { period: 1, clockSeconds: 720, margin: 0 },
  { period: 1, clockSeconds: 500, margin: 4 },
  { period: 1, clockSeconds: 300, margin: -2 },
  { period: 1, clockSeconds: 0, margin: 1 },
  { period: 2, clockSeconds: 720, margin: 1 },
  { period: 2, clockSeconds: 400, margin: 8 },
  { period: 2, clockSeconds: 100, margin: 3 },
  { period: 2, clockSeconds: 0, margin: 5 },
  { period: 3, clockSeconds: 720, margin: 5 },
  { period: 3, clockSeconds: 350, margin: -6 },
  { period: 3, clockSeconds: 0, margin: -9 },
  { period: 4, clockSeconds: 720, margin: -9 },
  { period: 4, clockSeconds: 200, margin: 2 },
  { period: 4, clockSeconds: 0, margin: 3 },
] );

function maxHomeLead( points: ScoreMarginPoint[] ) {
  return points.reduce( ( max, p ) => Math.max( max, p.margin ), 0 );
}

function maxAwayLead( points: ScoreMarginPoint[] ) {
  return points.reduce( ( max, p ) => Math.max( max, -p.margin ), 0 );
}

const meta = {
  title: "Components/Game/ScoreMarginChart",
  component: ScoreMarginChart,
  tags: ["autodocs"],
  args: {
    overtimes: 0,
    points: closeGamePoints,
    maxHomeLead: maxHomeLead( closeGamePoints ),
    maxAwayLead: maxAwayLead( closeGamePoints ),
    homeColor: "#1F9952",
    awayColor: "#C8102E",
    homeTeam: "Boston Celtics",
    awayTeam: "Atlanta Hawks",
    homeTricode: "BOS",
    awayTricode: "ATL",
    homeScore: closeGamePoints[closeGamePoints.length - 1].homeScore,
    awayScore: closeGamePoints[closeGamePoints.length - 1].awayScore,
  },
  decorators: [
    ( Story ) => (
      <div style={{ padding: "50px 20px 20px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreMarginChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HomeBlowout: Story = {
  args: ( () => {
    const blowoutPoints = withScores( [
      { period: 1, clockSeconds: 720, margin: 0 },
      { period: 1, clockSeconds: 0, margin: 10 },
      { period: 2, clockSeconds: 720, margin: 10 },
      { period: 2, clockSeconds: 0, margin: 22 },
      { period: 3, clockSeconds: 720, margin: 22 },
      { period: 3, clockSeconds: 0, margin: 28 },
      { period: 4, clockSeconds: 720, margin: 28 },
      { period: 4, clockSeconds: 0, margin: 24 },
    ] );
    return {
      points: blowoutPoints,
      maxHomeLead: maxHomeLead( blowoutPoints ),
      maxAwayLead: maxAwayLead( blowoutPoints ),
      homeScore: blowoutPoints[blowoutPoints.length - 1].homeScore,
      awayScore: blowoutPoints[blowoutPoints.length - 1].awayScore,
    };
  } )(),
};

export const WithOvertime: Story = {
  args: ( () => {
    const otPoints = withScores( [
      { period: 1, clockSeconds: 720, margin: 0 },
      { period: 1, clockSeconds: 0, margin: -5 },
      { period: 2, clockSeconds: 720, margin: -5 },
      { period: 2, clockSeconds: 0, margin: 3 },
      { period: 3, clockSeconds: 720, margin: 3 },
      { period: 3, clockSeconds: 0, margin: -6 },
      { period: 4, clockSeconds: 720, margin: -6 },
      { period: 4, clockSeconds: 0, margin: 0 },
      { period: 5, clockSeconds: 300, margin: 0 },
      { period: 5, clockSeconds: 0, margin: 2 },
    ] );
    return {
      overtimes: 1,
      points: otPoints,
      maxHomeLead: maxHomeLead( otPoints ),
      maxAwayLead: maxAwayLead( otPoints ),
      homeScore: otPoints[otPoints.length - 1].homeScore,
      awayScore: otPoints[otPoints.length - 1].awayScore,
    };
  } )(),
};
