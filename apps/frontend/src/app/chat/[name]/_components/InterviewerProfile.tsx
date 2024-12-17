import styles from "./chat.module.css";
import Avatar from "@repo/ui/Avatar";

interface InterviewerProfileProps {
  src: string;
  name: string;
  description: string;
}

export default function InterviewerProfile({
  src,
  name,
  description,
}: InterviewerProfileProps) {
  return (
    <div className={styles.profileContainer}>
      <Avatar src={src} width="160px" height="160px" />
      <div className={styles.profileInfo}>
        <div className={styles.profileName}>{name}</div>
        <div className={styles.profileDescription}>{description}</div>
      </div>
    </div>
  );
}
