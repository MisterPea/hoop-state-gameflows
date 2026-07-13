"use client";

import type { ScoreMarginPoint } from "@/lib/nba-data";
import styles from "./ScoreMarginChart.module.scss";

type ScoreMarginChartProps = {
  points: ScoreMarginPoint[];
  overtimes: number;
  maxHomeLead: number;
  maxAwayLead: number;
  homeColor: string;
  awayColor: string;
  homeTeam: string;
  awayTeam: string;
  homeTricode: string;
  awayTricode: string;
  homeScore: number;
  awayScore: number;
};

type ChartPoint = { x: number; y: number; };
type Zone = { left: number; right: number; data: ScoreMarginPoint; };

const REGULAR_PERIODS = [1, 2, 3, 4];

function periodDuration( period: number ) {
  return period <= 4 ? 720 : 300;
}

function toChartPoints( sortedPoints: ScoreMarginPoint[], dur: number, maxAbs: number ): ChartPoint[] {
  return sortedPoints.map( p => ( {
    x: ( ( dur - p.clockSeconds ) / dur ) * 100,
    y: 50 + ( p.margin / maxAbs ) * 50,
  } ) );
}

function formatClock( seconds: number ): string {
  const m = Math.floor( seconds / 60 );
  const s = Math.floor( seconds % 60 );
  return `${m}:${s.toString().padStart( 2, "0" )}`;
}

function periodLabel( period: number ): string {
  return period <= 4 ? `Q${period}` : `OT${period - 4}`;
}

// Binary search over zones sorted ascending by x. Assumes zones fully tile [0, 100).
function findZoneAt( zones: Zone[], pct: number ): Zone | null {
  if ( zones.length === 0 ) return null;
  const clamped = Math.min( Math.max( pct, 0 ), 100 - Number.EPSILON );
  let lo = 0;
  let hi = zones.length - 1;
  while ( lo <= hi ) {
    const mid = ( lo + hi ) >> 1;
    const zone = zones[mid];
    if ( clamped < zone.left ) hi = mid - 1;
    else if ( clamped >= zone.right ) lo = mid + 1;
    else return zone;
  }
  return null;
}

// Builds a step-after polyline: hold the previous value until the next change, then jump.
function stepPathPoints( chartPoints: ChartPoint[] ): string {
  const parts = [`${chartPoints[0].x},${chartPoints[0].y}`];
  for ( let i = 1; i < chartPoints.length; i++ ) {
    const prev = chartPoints[i - 1];
    const curr = chartPoints[i];
    parts.push( `${curr.x},${prev.y}` );
    parts.push( `${curr.x},${curr.y}` );
  }
  return parts.join( " " );
}

export default function ScoreMarginChart( props: ScoreMarginChartProps ) {
  const { points, overtimes, maxHomeLead, maxAwayLead, homeColor, awayColor, homeTeam, awayTeam, homeTricode, awayTricode, homeScore, awayScore } = props;

  // Shared scale for both directions keeps the centerline fixed and the chart symmetrical,
  // instead of each side stretching independently to its own max lead.
  const maxAbs = Math.max( maxHomeLead, maxAwayLead, 1 );

  const overtimePeriods = Array.from( { length: overtimes }, ( _, i ) => i + 5 );

  function renderPeriod( period: number ) {
    const dur = periodDuration( period );
    const periodPoints = points.filter( p => p.period === period );
    const className = period <= 4 ? styles.regularPeriod : styles.overtimePeriod;

    if ( periodPoints.length === 0 ) {
      return <div key={period} className={className} />;
    }

    const sortedPoints = periodPoints.slice().sort( ( a, b ) => b.clockSeconds - a.clockSeconds );
    const chartPoints = toChartPoints( sortedPoints, dur, maxAbs );
    const step = stepPathPoints( chartPoints );
    const awayClip = `score-margin-away-${period}`;
    const homeClip = `score-margin-home-${period}`;

    // Each slice holds the score from its point until the next one changes it, matching the step line.
    const zones: Zone[] = chartPoints
      .map( ( chartPoint, i ) => {
        const left = chartPoint.x;
        const right = i + 1 < chartPoints.length ? chartPoints[i + 1].x : 100;
        return { left, right, data: sortedPoints[i] };
      } )
      .filter( zone => zone.right > zone.left );

    // No hover-zone nodes per point: one mousemove listener resolves the zone via
    // binary search, then mutates a single reused tooltip node directly (skips React re-render).
    let tooltipEl: HTMLDivElement | null = null;
    let timeEl: HTMLDivElement | null = null;
    let awayEl: HTMLSpanElement | null = null;
    let homeEl: HTMLSpanElement | null = null;

    function handleMouseMove( e: React.MouseEvent<HTMLDivElement> ) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = ( ( e.clientX - rect.left ) / rect.width ) * 100;
      const zone = findZoneAt( zones, pct );
      if ( !zone || !tooltipEl ) return;

      tooltipEl.style.left = `${( zone.left + zone.right ) / 2}%`;
      tooltipEl.classList.add( styles.tooltipActive );
      if ( timeEl ) timeEl.textContent = `${periodLabel( period )} · ${formatClock( zone.data.clockSeconds )}`;
      if ( awayEl ) awayEl.textContent = `${awayTricode} ${zone.data.awayScore}`;
      if ( homeEl ) homeEl.textContent = `${homeTricode} ${zone.data.homeScore}`;
    }

    function handleMouseLeave() {
      tooltipEl?.classList.remove( styles.tooltipActive );
    }

    return (
      <div
        key={period}
        className={className}
        onMouseMove={zones.length > 0 ? handleMouseMove : undefined}
        onMouseLeave={zones.length > 0 ? handleMouseLeave : undefined}
      >
        <svg className={styles.chartSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <clipPath id={awayClip} clipPathUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100" height="50" />
            </clipPath>
            <clipPath id={homeClip} clipPathUnits="userSpaceOnUse">
              <rect x="0" y="50" width="100" height="50" />
            </clipPath>
          </defs>
          <line x1="0" y1="50" x2="100" y2="50" className={styles.centerline} vectorEffect="non-scaling-stroke" />
          <polyline
            points={step}
            fill="none"
            stroke={awayColor}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            clipPath={`url(#${awayClip})`}
            className={styles.scoreLine}
          />
          <polyline
            points={step}
            fill="none"
            stroke={homeColor}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            clipPath={`url(#${homeClip})`}
            className={styles.scoreLine}
          />
        </svg>
        <div ref={el => { tooltipEl = el; }} className={styles.tooltip}>
          <div ref={el => { timeEl = el; }} className={styles.tooltipTime} />
          <div className={styles.tooltipScore}>
            <span ref={el => { awayEl = el; }} style={{ color: awayColor }} />
            <span ref={el => { homeEl = el; }} style={{ color: homeColor }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scoreMarginChart}>
      <div className={styles.teamNamesSpace}></div>
      <div className={styles.chartPeriods}>
        <div className={styles.teamChartOverlay}>
          <h5>{awayTeam}</h5>
          <h5>{homeTeam}</h5>
        </div>
        {REGULAR_PERIODS.map( renderPeriod )}
        {overtimePeriods.map( renderPeriod )}
      </div>
      <div className={styles.maxLeadsAndScores} >
        <div className={`${styles.awayLeadScore} ${styles.leadScoreGroup}`}>
          <p className={styles.maxLead}>{`${maxAwayLead > 0 ? "Max Lead +" + maxAwayLead : "Never Led "}`}</p>
          <span className={styles.score}><h5>{awayTricode}</h5><h5>{awayScore}</h5></span>
        </div>
        <div className={`${styles.homeLeadScores} ${styles.leadScoreGroup}`}>
          <span className={styles.score}><h5>{homeTricode}</h5><h5>{homeScore}</h5></span>
          <p className={styles.maxLead}>{`${maxHomeLead > 0 ? "Max Lead +" + maxHomeLead : "Never Led"}`}</p>
        </div>
      </div>
    </div>
  );
}
