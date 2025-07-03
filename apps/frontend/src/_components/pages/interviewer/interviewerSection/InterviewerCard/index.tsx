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

function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.imageWrapper} ${styles.skeleton}`} style={{ height: '150px' }} />
      <div className={styles.content}>
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '90%' }} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '40%' }} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60%' }} />
        <div className={styles.buttonWrapper}>
          <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
          <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
        </div>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Text as="p" size="lg" color="error">
          면접관 정보를 불러오는데 실패했습니다.
        </Text>
      </div>
    </div>
  );
}

InterviewerCard.Loading = Loading;
InterviewerCard.Error = Error;
