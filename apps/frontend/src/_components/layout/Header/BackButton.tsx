'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './BackButton.module.css';

interface BackButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export default function BackButton({ ...restProps }: BackButtonProps): React.ReactElement {
  const router = useRouter();

  return (
    <button className={styles.wrapper} onClick={() => router.back()} {...restProps}>
      <Image src="/assets/images/back-arrow-icon.svg" alt="Back" fill />
    </button>
  );
}
