"use client";

import { useState } from "react";
import type { ShotChartPoint, ShotZone } from "@/lib/nba-data";
import styles from "./ShotChart.module.scss";
import AttemptMadeBarRow from "../AttemptMadeBarRow/AttemptMadeBarRow";
import { Logo, type TeamLogoCode } from "@/lib/team-logos";

type ShotChartProps = {
  teamName: string;
  tricode: TeamLogoCode;
  shots: ShotChartPoint[];
};

const COURT_WIDTH = 377.36;
const COURT_HEIGHT = 352.19;
const MARKER_RADIUS = 4;

const ZONE_FILTERS: { label: string; zone: ShotZone | "all"; }[] = [
  { label: "All", zone: "all" },
  { label: "Rim", zone: "rim" },
  { label: "Paint", zone: "paint" },
  { label: "Mid", zone: "mid" },
  { label: "3PT", zone: "three" },
];

function formatClock( seconds: number ): string {
  const m = Math.floor( seconds / 60 );
  const s = Math.floor( seconds % 60 );
  return `${m}:${s.toString().padStart( 2, "0" )}`;
}

function periodLabel( period: number ): string {
  return period <= 4 ? `Q${period}` : `OT${period - 4}`;
}

// x is 0-50 (baseline to half-court), y is 0-100 (sideline to sideline).
function toSvgPoint( shot: ShotChartPoint ) {
  return {
    cx: ( shot.y / 100 ) * COURT_WIDTH,
    cy: ( Math.min( shot.x, 50 ) / 50 ) * COURT_HEIGHT,
  };
}

type CourtSvgProps = {
  shots: ShotChartPoint[];
  onHoverShot: ( shot: ShotChartPoint ) => void;
  onLeaveShot: () => void;
};

function CourtSvg( { shots, onHoverShot, onLeaveShot }: CourtSvgProps ) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={COURT_WIDTH}
      height={COURT_HEIGHT}
      fill="none"
      viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
    >
      <g className={styles.courtFrame}>
        <rect x="116.3" y="13.48" width="144.76" height="119.05" transform="translate(261.68 -115.67) rotate(90)"></rect>
        <circle cx="188.68" cy="41.04" r="5.99"></circle>
        <path d="M233.82,145.39h-90.29c0,25.07,20.21,45.4,45.15,45.4s45.15-20.33,45.15-45.4Z"></path>
        <path d="M143.7,141.39c-.11,1.32-.17,2.65-.17,4h4"></path>
        <line x1="155.01" y1="145.39" x2="226.08" y2="145.39" strokeDasharray="7.48 7.48"></line>
        <path d="M229.82,145.39h4c0-1.35-.06-2.68-.17-4"></path>
        <path d="M232.29,133.62c-5.16-19.37-22.73-33.63-43.61-33.63-22.25,0-40.74,16.18-44.46,37.48" strokeDasharray="7.89 7.89"></path>
        <path d="M169.55,353.42c0-10.62,8.57-19.24,19.13-19.24s19.13,8.61,19.13,19.24c0,.05,0,.1,0,.15h26.02c0-25.07-20.21-45.4-45.15-45.4s-45.15,20.33-45.15,45.4h26.02s0-.1,0-.15Z"></path>
        <path d="M188.68,334.18c-10.57,0-19.13,8.61-19.13,19.24,0,.05,0,.1,0,.15h38.25s0-.1,0-.15c0-10.62-8.57-19.24-19.13-19.24Z"></path>
        <line x1="377.26" y1="214.52" x2="355.53" y2="214.52"></line>
        <line x1="22.88" y1="214.52" x2="0" y2="214.52"></line>
        <line x1="253.88" y1="84.09" x2="248.73" y2="84.09"></line>
        <line x1="253.88" y1="107.15" x2="248.73" y2="107.15"></line>
        <line x1="253.88" y1="61.03" x2="248.73" y2="61.03"></line>
        <line x1="253.88" y1="55.62" x2="248.73" y2="55.62"></line>
        <line x1="129.68" y1="84.09" x2="124.54" y2="84.09"></line>
        <line x1="129.68" y1="107.15" x2="124.54" y2="107.15"></line>
        <line x1="129.68" y1="61.03" x2="124.54" y2="61.03"></line>
        <line x1="129.68" y1="55.62" x2="124.54" y2="55.62"></line>
        <path d="M23.65,109.2c27.1,65.05,90.39,110.78,165.26,110.78s137.71-45.73,164.81-110.78"></path>
        <path d="M353.71,109.2c.06-.15.12-.31.19-.46V.62H23.46v108.12c.06.15.12.31.19.46"></path>
        <path d="M157.29,32.71v17.89c9.34,28.65,53.27,29.71,62.78,0v-17.89"></path>
        <line x1="211.33" y1="30.67" x2="166.03" y2="30.67"></line>
      </g>
      <g>
        {shots.map( shot => {
          const { cx, cy } = toSvgPoint( shot );
          const handlers = {
            onMouseEnter: () => onHoverShot( shot ),
            onMouseLeave: onLeaveShot,
          };
          return shot.made ? (
            <circle
              key={shot.actionNumber}
              cx={cx}
              cy={cy}
              r={MARKER_RADIUS}
              className={styles.shotMade}
              {...handlers}
            />
          ) : (
            <g key={shot.actionNumber} className={styles.shotMissed} {...handlers}>
              <line x1={cx - MARKER_RADIUS} y1={cy - MARKER_RADIUS} x2={cx + MARKER_RADIUS} y2={cy + MARKER_RADIUS} />
              <line x1={cx - MARKER_RADIUS} y1={cy + MARKER_RADIUS} x2={cx + MARKER_RADIUS} y2={cy - MARKER_RADIUS} />
            </g>
          );
        } )}
      </g>
    </svg>
  );
}

export default function ShotChart( { teamName, tricode, shots }: ShotChartProps ) {
  const [zone, setZone] = useState<ShotZone | "all">( "all" );

  let shotInfoEl: HTMLParagraphElement | null = null;

  function handleHoverShot( shot: ShotChartPoint ) {
    if ( !shotInfoEl ) return;
    shotInfoEl.textContent = `${periodLabel( shot.period )}, ${formatClock( shot.clockSeconds )}: ${shot.description}`;
  }

  function handleLeaveShot() {
    if ( !shotInfoEl ) return;
    shotInfoEl.textContent = "Hover a shot for details";
  }

  const visibleShots = zone === "all" ? shots : shots.filter( shot => shot.zone === zone );

  return (
    <div className={styles.shotChart}>
      <header className={styles.shotChartHeader}>
        <h3 className={styles.teamName}>
          <Logo tricode={tricode} className={styles.teamLogo} />
          {teamName}
        </h3>
        <AttemptMadeBarRow
          className={styles.attemptBarFill}
          attempts={visibleShots.length}
          made={visibleShots.filter( ( el ) => el.made ).length}
          scale={1}
          includePctBadge
        />
      </header>
      <p ref={el => { shotInfoEl = el; }} className={styles.shotInfo}>Hover a shot for details</p>
      <div className={styles.shotDistanceSelector}>
        {ZONE_FILTERS.map( filter => (
          <button
            key={filter.zone}
            type="button"
            className={zone === filter.zone ? styles.zoneActive : undefined}
            onClick={() => setZone( filter.zone )}
          >
            {filter.label}
          </button>
        ) )}
      </div>
      <div className={styles.court}>
        <CourtSvg shots={visibleShots} onHoverShot={handleHoverShot} onLeaveShot={handleLeaveShot} />
      </div>


    </div>
  );
}
