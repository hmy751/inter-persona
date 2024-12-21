import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function Spinner({
  size = "md",
  color = "var(--color-primary)",
  className,
}: SpinnerProps) {
  return (
    <div
      className={`
        ${styles.spinner}
        ${styles[size]}
        ${className || ""}
      `}
      style={{ borderTopColor: color }}
      role="status"
      aria-label="loading"
    />
  );
}
