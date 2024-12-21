import Image from "next/image";
import styles from "./Avatar.module.css";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src: string;
  size?: AvatarSize;
  alt?: string;
  className?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 160,
};

export default function Avatar({
  src,
  size = "md",
  alt = "avatar",
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      className={`
        ${styles.container}
        ${styles[`size-${size}`]}
        ${className || ""}
      `}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        width={sizeMap[size]}
        height={sizeMap[size]}
        className={styles.image}
      />
    </div>
  );
}
