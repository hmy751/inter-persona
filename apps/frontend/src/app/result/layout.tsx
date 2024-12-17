import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <section className={styles.content}>{children}</section>
    </div>
  );
}
