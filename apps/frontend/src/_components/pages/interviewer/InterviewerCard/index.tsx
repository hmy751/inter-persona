'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './InterviewerCard.module.css';
import Text from '@repo/ui/Text';
import StartInterviewButton from './StartInterviewButton';
import Select from '@repo/ui/Select';

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
  const [category, setCategory] = useState<string>('Frontend');

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image
          src={imgUrl}
          alt={name}
          height={0}
          width={0}
          fill
          sizes="(max-width: 767px) 100vw, 150px"
          className={styles.image}
        />
      </div>
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
          <Select value={category} onValueChange={setCategory}>
            <Select.Option value="frontend">Frontend</Select.Option>
            <Select.Option value="backend">Backend</Select.Option>
          </Select>
          <StartInterviewButton id={id} category={category} />
        </div>
      </div>
    </div>
  );
}
