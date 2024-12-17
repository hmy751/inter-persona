"use client";
import Avatar from "@repo/ui/Avatar";
import useUserStore from "@/store/useUserStore";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {user && (
          <div className={styles.userInfo}>
            <Avatar src={user?.imageSrc} />
            <p className={styles.userName}>{user?.name}</p>
          </div>
        )}
      </header>
      <section className={styles.content}>{children}</section>
    </div>
  );
}
