import { ReactNode } from 'react';
import styles from './GameSectionWrapper.module.scss';

type GameSectionWrapperProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function GameSectionWrapper( { title, children, className }: GameSectionWrapperProps ) {

  return (
    <section className={[styles.gameSectionDivider, className].filter( Boolean ).join( " " )}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
