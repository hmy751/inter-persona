import styles from './Header.module.css';
import HeaderUserInfo from './HeaderUserInfo';
import BackButton from './BackButton';
import HeaderTitle from './HeaderTitle';

export default function Header(): React.ReactElement {
  return (
    <header className={styles.header}>
      <BackButton />
      <HeaderTitle className={styles.second} />
      <HeaderUserInfo className={styles.third} />
    </header>
  );
}
