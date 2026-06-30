import Link from 'next/link';
import styles from './SeasonNavButton.module.scss';

type SeasonNavButtonProps = {
  href: string;
  seasonTitle: string;
  selected: boolean;
};

export default function SeasonNavButton( { href, seasonTitle, selected = false }: SeasonNavButtonProps ) {
  return (
    <Link
      className={`${styles.sectionSelector} ${selected ? styles.sectionIsSelected : ''}`}
      href={href}
    >{seasonTitle}
    </Link>
  );
}
