import styles from "./SeasonNavButton.module.scss";

type SeasonNavButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function SeasonNavButton({
  label,
  selected = false,
  onClick,
}: SeasonNavButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.sectionSelector} ${selected ? styles.sectionIsSelected : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
