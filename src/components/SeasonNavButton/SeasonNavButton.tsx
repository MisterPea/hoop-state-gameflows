'use client';

import styles from "./SeasonNavButton.module.scss";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type SeasonNavButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  href: string; // for Prefetch route
};

export default function SeasonNavButton( {
  label,
  selected = false,
  onClick,
  href
}: SeasonNavButtonProps ) {

  const PREFETCH_TIMEOUT_MS = 150;

  const prefetchTimer = useRef<NodeJS.Timeout>( null );
  const router = useRouter();

  function handlePrefetchTimer() {
    prefetchTimer.current = setTimeout( () => {
      router.prefetch( href );
    }, PREFETCH_TIMEOUT_MS );
  }

  function removePrefetchTimer() {
    if ( prefetchTimer.current ) {
      clearTimeout( prefetchTimer.current );
      prefetchTimer.current = null;
    }
  }

  useEffect( () => removePrefetchTimer, [] );

  return (
    <button
      type="button"
      className={`${styles.sectionSelector} ${selected ? styles.sectionIsSelected : ""}`}
      aria-pressed={selected}
      onClick={onClick}
      onMouseEnter={handlePrefetchTimer}
      onMouseLeave={removePrefetchTimer}
      data-href={href}
    >
      {label}
    </button>
  );
}
