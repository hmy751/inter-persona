import styles from "./Header.module.css";
import Text from "@repo/ui/Text";
import HeaderUserInfo from "./HeaderUserInfo";
import BackButton from "./BackButton";

interface HeaderProps {}

export default function Header({}: HeaderProps): React.ReactElement {
  return (
    <header className={styles.header}>
      <BackButton className={styles.first} />
      <Text className={styles.second} as="h1">
        Inter Persona
      </Text>
      <HeaderUserInfo className={styles.third} />
    </header>
  );
}
