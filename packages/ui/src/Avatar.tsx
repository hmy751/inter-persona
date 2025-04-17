import React from "react";
import styles from "./Avatar.module.css";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
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
}: AvatarProps): JSX.Element {
  const containerClasses = [
    styles.container,
    styles[`size-${size}`],
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageSrc = src || "/assets/images/default-avatar.svg";

  return (
    <div className={containerClasses} {...props}>
      <img
        src={imageSrc}
        alt={alt}
        width={sizeMap[size]}
        height={sizeMap[size]}
        className={styles.image}
        loading="lazy"
      />
    </div>
  );
}
