import styles from "./Header.module.css";
import HeaderUserInfo from "./HeaderUserInfo";
import BackButton from "./BackButton";
import HeaderTitle from "./HeaderTitle";

interface HeaderProps {}

export default function Header({}: HeaderProps): React.ReactElement {
  return (
    <header className={styles.header}>
      <BackButton className={styles.first} />
      <HeaderTitle className={styles.second} />
      <HeaderUserInfo className={styles.third} />
    </header>
  );
}
