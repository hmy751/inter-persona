"use client";

import Avatar from "@repo/ui/Avatar";
import Text from "@repo/ui/Text";
import styles from "./HeaderUserInfo.module.css";
import useUserStore from "@/_store/useUserStore";

interface HeaderUserInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function HeaderUserInfo({}: HeaderUserInfoProps): React.ReactElement | null {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <div className={styles.userInfo}>
      <Avatar size="sm" src={user?.imageSrc} />
      <Text maxWidth="70px" align="right" truncate className={styles.text}>
        {user?.name}
      </Text>
    </div>
  );
}
