"use client";

import Avatar from "@repo/ui/Avatar";
import Text from "@repo/ui/Text";
import styles from "./HeaderUserInfo.module.css";
import useUserStore from "@/store/useUserStore";

export default function HeaderUserInfo(): React.ReactElement | null {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <div className={styles.userInfo}>
      <Avatar size="sm" src={user?.imageSrc} />
      <Text maxWidth="70px" align="right" truncate>
        {user?.name}
      </Text>
    </div>
  );
}
