import styles from "./chat.module.css";
import Avatar from "@repo/ui/Avatar";
import Text from "@repo/ui/Text";
interface InterviewerProfileSectionProps {
  src: string;
  name: string;
  description: string;
}

export default function InterviewerProfileSection({
  src,
  name,
  description,
}: InterviewerProfileSectionProps) {
  return (
    <div className={styles.profileContainer}>
      <Avatar src={src} size="md" />
      <div className={styles.profileInfo}>
        <Text as="p" size="md">
          {name}
        </Text>
        <Text as="p" size="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}
