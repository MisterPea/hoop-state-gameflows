function getEasternDateTime( date = new Date() ) {
  const parts = new Intl.DateTimeFormat( "en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  } ).formatToParts( date );

  const get = ( type: string ) =>
    parts.find( ( part ) => part.type === type )?.value ?? "";

  return `${get( "weekday" )} - ${get( "year" )}-${get( "month" )}-${get( "day" )} - ${get( "hour" )}:${get( "minute" )}:${get( "second" )} ${get( "dayPeriod" )}`;
}

export function BuildTime() {
  const html = `<!-- Latest Build: ${getEasternDateTime()} -->`;

  // A real element React owns end-to-end (mount/unmount stays a normal
  // removeChild on THIS node). Content is set via dangerouslySetInnerHTML
  // so it renders as an inert HTML comment, visible only via inspect/view-
  // source. Previous version swapped the node itself via a ref callback's
  // `instance.outerHTML = html` — that detaches React's own node from the
  // DOM behind its back, so the next unmount/reorder (e.g. this component
  // conditionally mounting on route change) calls removeChild/insertBefore
  // on a node that's no longer actually there and crashes the page.
  // biome-ignore lint/security/noDangerouslySetInnerHtml: emits an inert HTML comment, not user content
  return <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: html }} />;
}
