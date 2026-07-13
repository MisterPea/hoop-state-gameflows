"use client";

import { useState } from "react";
import type { ShotChartPoint, ShotZone } from "@/lib/nba-data";
import styles from "./ShotChart.module.scss";

type ShotChartProps = {
  teamName: string;
  shots: ShotChartPoint[];
};

const COURT_WIDTH = 205;
const COURT_HEIGHT = 193;
const MARKER_RADIUS = 2.4;

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
      <g stroke="#000">
        <path d="M205 0H0v193h205z"></path>
        <path d="M135.3 0H69.7v78.021h65.6z"></path>
        <path d="M102.5 102.66c13.586 0 24.6-11.031 24.6-24.639s-11.014-24.638-24.6-24.638-24.6 11.031-24.6 24.638 11.014 24.639 24.6 24.639ZM90.2 16.426h24.6m-12.3 8.212a3.08 3.08 0 0 0 3.075-3.08c0-1.7-1.377-3.08-3.075-3.08a3.08 3.08 0 0 0-3.075 3.08 3.08 3.08 0 0 0 3.075 3.08Z"></path>
        <path d="M86.1 21.559c0 4.356 1.728 8.534 4.804 11.614a16.4 16.4 0 0 0 11.596 4.811c4.35 0 8.521-1.73 11.597-4.81a16.44 16.44 0 0 0 4.803-11.615M12.3 0v58.31M192.7 0v58.31m-180.4 0a97.5 97.5 0 0 0 35.842 44.174 97.27 97.27 0 0 0 54.358 16.61 97.27 97.27 0 0 0 54.358-16.61A97.5 97.5 0 0 0 192.7 58.311M77.9 193a24.66 24.66 0 0 1 7.205-17.422 24.58 24.58 0 0 1 17.395-7.216 24.6 24.6 0 0 1 17.395 7.216A24.66 24.66 0 0 1 127.1 193"></path>
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

export default function ShotChart( { teamName, shots }: ShotChartProps ) {
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
      <h3 className={styles.teamName}>{teamName}</h3>
      <p ref={el => { shotInfoEl = el; }} className={styles.shotInfo}>Hover a shot for details</p>
      <div className={styles.court}>
        <CourtSvg shots={visibleShots} onHoverShot={handleHoverShot} onLeaveShot={handleLeaveShot} />
      </div>
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
    </div>
  );
}
