'use client';

import Avatar from '@repo/ui/Avatar';
import Text from '@repo/ui/Text';
import styles from './HeaderUserInfo.module.css';
import { useGetUser } from '@/_data/user';
import clsx from 'clsx';

interface HeaderUserInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function HeaderUserInfo({ ...restProps }: HeaderUserInfoProps): React.ReactElement | null {
  const { data: user } = useGetUser();

  if (!user) {
    return null;
  }

  return (
    <div className={clsx(styles.userInfo)} {...restProps}>
      <Avatar size="sm" src={user?.profileImageUrl} />
      <Text maxWidth="70px" align="right" truncate className={styles.text}>
        {user?.name}
      </Text>
    </div>
  );
}
