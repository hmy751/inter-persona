import React, { useState, useEffect } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  score: number;
  duration: number;
}

export default function ProgressBar({ score = 80, duration = 1500 }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const targetScore = score;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - (1 - progress) * (1 - progress);

      const currentScore = Math.min(Math.floor(targetScore * eased), targetScore);

      setProgress(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, duration]);

  return (
    <div className={styles.container}>
      <div className={styles.labelWrapper}>
        <span className={styles.label}>Score {progress}%</span>
        <span className={styles.label}>{score}%</span>
      </div>
      <div className={styles.progressBarBg}>
        <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
