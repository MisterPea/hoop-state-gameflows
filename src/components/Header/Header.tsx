import styles from "./Header.module.scss";

type HeaderProps = {
  isGamePage?: boolean;
};

export default function Header( { isGamePage = true }: HeaderProps ) {
  return (
    <header className={`${styles.header} ${isGamePage ? styles.gamePage : styles.mainPage}`}>
      <button type="button">
        <h1>Hoop State</h1>
        <h2>Gameflows</h2>
      </button>
    </header>
  );
}
