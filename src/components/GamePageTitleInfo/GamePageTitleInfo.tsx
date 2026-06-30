import styles from './GamePageTitleInfo.module.scss';

type GamePageTitleProps = {
  title: string;
  data?: string;

  referee1?: string;
  referee2?: string;
  referee3?: string;
  refereeAlt?: string;
};

export default function GamePageTitleInfo( props: GamePageTitleProps ) {
  let { title, data, referee1, referee2, referee3, refereeAlt } = props;
  if(refereeAlt) refereeAlt += ' - Alt.'
  const referees = [referee1, referee2, referee3, refereeAlt].filter( Boolean );
  return (
    <div className={`${styles.infoTitle}`}>
      <h3>{title}</h3>
      {referees.length > 0 ? (
        <ul>
          {referees.map( ( name ) => (
            <li key={name}>{name}</li>
          ) )}
        </ul>
      ) : data ? (
        <p>{data}</p>
      ) : null}
    </div>
  );
}
