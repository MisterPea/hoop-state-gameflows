import { ReactNode } from 'react';
import styles from './GameSectionWrapper.module.scss';

type GameSectionWrapperProps = {
  title: string;
  children: ReactNode;
};

export default function GameSectionWrapper( { title, children }: GameSectionWrapperProps ) {

  return (
    <section className={`${styles.gameSectionDivider}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
