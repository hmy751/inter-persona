import styles from "./InterviewerProfile.module.css";
import Avatar from "@repo/ui/Avatar";

export default function InterviewerProfile({
  src,
  name,
  description,
}: {
  src?: string;
  name?: string;
  description?: string;
}) {
  return (
    <div className={styles.container}>
      <Avatar
        src={src || "/assets/images/elon_musk.png"}
        width={"160px"}
        height={"160px"}
      />
      <div className={styles.infoContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
