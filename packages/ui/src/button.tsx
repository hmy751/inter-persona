import Spinner from "@repo/ui/Spinner";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[`size-${size}`]}
        ${fullWidth ? styles.fullWidth : ""}
        ${isLoading ? styles.loading : ""}
        ${className || ""}
        ${props.disabled ? styles.disabled : ""}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner size={size} />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
