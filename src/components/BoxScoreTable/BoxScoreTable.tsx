import type { BoxScorePlayer } from "@/lib/nba-data";
import styles from "./BoxScoreTable.module.scss";

type BoxScoreTableProps = {
  teamName: string;
  teamColor: string;
  players: BoxScorePlayer[];
};

const STAT_COLUMN_COUNT = 19;

function formatPct( value: number | null ) {
  return value == null ? "—" : `${( value * 100 ).toFixed( 1 )}%`;
}

function formatStat( value: number | null ) {
  return value == null ? "—" : value.toFixed( 1 );
}

export default function BoxScoreTable( { teamName, teamColor, players }: BoxScoreTableProps ) {
  return (
    <div className={styles.boxScoreTable}>
      <h3 className={styles.teamName} style={{ borderColor: teamColor }}>{teamName}</h3>
      <div className={styles.scrollWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.playerCol} scope="col">Player</th>
              <th scope="col" title="Minutes">MIN</th>
              <th scope="col" title="Points">PTS</th>
              <th className={styles.groupEnd} scope="col" title="True Shooting %">TS%</th>
              <th scope="col" title="Rebounds">REB</th>
              <th scope="col" title="Assists">AST</th>
              <th scope="col" title="Steals">STL</th>
              <th className={styles.groupEnd} scope="col" title="Blocks">BLK</th>
              <th scope="col" title="Turnovers">TOV</th>
              <th className={styles.groupEnd} scope="col" title="Personal Fouls">PF</th>
              <th scope="col" title="Offensive Rebounds">OREB</th>
              <th className={styles.groupEnd} scope="col" title="Defensive Rebounds">DREB</th>
              <th scope="col" title="Free Throws Made-Attempted">FT</th>
              <th className={styles.groupEnd} scope="col" title="Free Throw %">FT%</th>
              <th scope="col" title="Two Pointers Made-Attempted">2PT</th>
              <th className={styles.groupEnd} scope="col" title="Two Point %">2PT%</th>
              <th scope="col" title="Three Pointers Made-Attempted">3PT</th>
              <th className={styles.groupEnd} scope="col" title="Three Point %">3PT%</th>
              <th className={styles.groupEnd} scope="col" title="Player Efficiency Rating">PER</th>
              <th scope="col" title="Usage %">USG%</th>
            </tr>
          </thead>
          <tbody>
            {players.map( player => (
              <tr key={player.personId} className={player.starter ? styles.starterRow : undefined}>
                <th className={styles.playerCol} scope="row">
                  <span className={styles.playerName}>{player.playerName}</span>
                  <span className={styles.playerMeta}>
                    {player.jerseyNumber ? `#${player.jerseyNumber}` : ""}
                    {player.position ? ` · ${player.position}` : ""}
                  </span>
                </th>
                {!player.played ? (
                  <td className={styles.dnpCell} colSpan={STAT_COLUMN_COUNT}>
                    {player.playingStatus === "INACTIVE" ? "INACTIVE" : "DNP"}
                  </td>
                ) : (
                  <>
                    <td>{player.minutesPlayed}</td>
                    <td>{player.points}</td>
                    <td className={styles.groupEnd}>{formatPct( player.trueShootingPct )}</td>
                    <td>{player.rebounds}</td>
                    <td>{player.assists}</td>
                    <td>{player.steals}</td>
                    <td className={styles.groupEnd}>{player.blocks}</td>
                    <td>{player.turnovers}</td>
                    <td className={styles.groupEnd}>{player.personalFouls}</td>
                    <td>{player.reboundsOffensive}</td>
                    <td className={styles.groupEnd}>{player.reboundsDefensive}</td>
                    <td>{player.freeThrowsMade}-{player.freeThrowsAttempted}</td>
                    <td className={styles.groupEnd}>{formatPct( player.freeThrowPct )}</td>
                    <td>{player.twoPointMade}-{player.twoPointAttempted}</td>
                    <td className={styles.groupEnd}>{formatPct( player.twoPointPct )}</td>
                    <td>{player.threePointMade}-{player.threePointAttempted}</td>
                    <td className={styles.groupEnd}>{formatPct( player.threePointPct )}</td>
                    <td className={styles.groupEnd}>{formatStat( player.per )}</td>
                    <td>{formatStat( player.usagePct )}</td>
                  </>
                )}
              </tr>
            ) )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
