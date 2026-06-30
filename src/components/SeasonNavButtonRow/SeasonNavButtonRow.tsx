"use client";

import { usePathname } from "next/navigation";
import SeasonButton from "../SeasonNavButton/SeasonNavButton";
import styles from "./SeasonNavButtonRow.module.scss";

export type SeasonNavItem = {
  href: string;
  label: string;
  segment: string;
};

type SeasonsNavButtonRowProps = {
  items: SeasonNavItem[];
};

export default function SeasonNavButtonRow({
  items,
}: SeasonsNavButtonRowProps) {
  const pathname = usePathname();

  return (
    <nav className={`${styles.seasonRowNav}`}>
      <ul className={`${styles.seasonListWrapper}`}>
        {items.map(({ href, label }) => (
          <li key={href}>
            <SeasonButton
              href={href}
              seasonTitle={label}
              selected={pathname === href}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
