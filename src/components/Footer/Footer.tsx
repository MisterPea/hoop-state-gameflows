import styles from "./Footer.module.scss";

const REPO_URL = "https://github.com/MisterPea/hoop-state-gameflows";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.bottomRow}>
        <p>&copy; {year} Hoop State Gameflows</p>
        <span aria-hidden="true">—</span>
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
          GitHub
        </a>
      </div>
      <p className={styles.disclaimer}>Not affiliated with the NBA. Data for personal/educational use.</p>
    </footer>
  );
}
