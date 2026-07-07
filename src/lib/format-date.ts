const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Converts a "YYYY-MM-DD" date string to "DayOfWeek, Month Day, Year".
 * Builds the Date from local components to avoid UTC-parsing day-shift bugs.
 */
export function formatGameDate( date: string ): string {
  const [year, month, day] = date.split( "-" ).map( Number );
  const d = new Date( year, month - 1, day );

  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
