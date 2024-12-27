"use client";

import Image from "next/image";
import styles from "./InterviewerCard.module.css";
import Text from "@repo/ui/Text";
import Button from "@repo/ui/Button";
import { useInterviewerStore } from "@/store/useInterviewerStore";
import { useRouter } from "next/navigation";
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
  const setInterviewer = useInterviewerStore((state) => state.setInterviewer);
  const router = useRouter();
  const handleClick = () => {
    setInterviewer({
      id,
      name,
      imgUrl,
      mbti,
      description,
    });
    router.push(`/chat/31`);
  };

  console.log(id, name, imgUrl, mbti, description);

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
          <Button variant="outline" size="md" onClick={handleClick}>
            Start interview
          </Button>
        </div>
      </div>
    </div>
  );
}
