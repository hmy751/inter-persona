import styles from "./Header.module.css";
import Text from "@repo/ui/Text";
import HeaderUserInfo from "./HeaderUserInfo";

interface HeaderProps {}

export default function Header({}: HeaderProps): React.ReactElement {
  return (
    <header className={styles.header}>
      <Text as="h1">Inter Persona</Text>
      <HeaderUserInfo />
    </header>
  );
}
