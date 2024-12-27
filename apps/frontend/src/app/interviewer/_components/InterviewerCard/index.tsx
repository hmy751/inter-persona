import Image from "next/image";
import styles from "./InterviewerCard.module.css";
import Text from "@repo/ui/Text";
import StartInterviewButton from "./StartInterviewButton";

interface InterviewerCardProps {
  id: number;
  imgUrl: string;
  name: string;
  mbti: string;
  description: string;
}

export default function InterviewerCard({
  id,
  imgUrl,
  name,
  mbti,
  description,
}: InterviewerCardProps): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <Image src={imgUrl} alt={name} height={150} width={150} />
      <div className={styles.content}>
        <Text as="p" size="sm">
          {description}
        </Text>
        <Text as="h3" size="lg" weight="bold">
          {name}
        </Text>
        <Text as="p" size="sm">
          {mbti}
        </Text>
        <div className={styles.buttonWrapper}>
          <StartInterviewButton id={id} />
        </div>
      </div>
    </div>
  );
}