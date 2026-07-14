import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <h1>404</h1>
      <p>This game — or page — doesn&apos;t exist.</p>
      <Link className={styles.homeLink} href="/">Back to Hoop State Gameflows</Link>
    </main>
  );
}
