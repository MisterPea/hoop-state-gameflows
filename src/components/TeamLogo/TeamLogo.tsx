type TeamLogoProps = {
  tricode: string;
  teamName: string;
};
export default function TeamLogo( props: TeamLogoProps ) {
  const { tricode, teamName } = props;
  return (

      <img
        src={`/team-logos/${tricode}.svg`}
        alt={`${teamName} logo`}
        className="teamLogo"
      />
  );
}
