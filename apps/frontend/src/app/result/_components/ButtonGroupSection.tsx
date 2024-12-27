import Button from "@repo/ui/Button";
import styles from "./ButtonGroupSection.module.css";

interface ButtonGroupSectionProps {}

export default function ButtonGroupSection({}: ButtonGroupSectionProps): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <Button variant="outline" fullWidth>
        문제 다시 풀기
      </Button>
      <Button variant="primary" fullWidth>
        면접관 선택 하기
      </Button>
    </div>
  );
}
