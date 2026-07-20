import styles from "./SeasonNavButton.module.scss";

type SeasonNavButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  href?: string;
};

export default function SeasonNavButton({
  label,
  selected = false,
  onClick,
  href,
}: SeasonNavButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.sectionSelector} ${selected ? styles.sectionIsSelected : ""}`}
      aria-pressed={selected}
      data-href={href}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
