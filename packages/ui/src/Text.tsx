import clsx from "clsx";
import styles from "./Text.module.css";

const ELEMENT_MAPPING = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  span: "span",
} as const;

type ComponentType = keyof typeof ELEMENT_MAPPING;

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "light" | "normal" | "medium" | "bold";
  as?: ComponentType;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  width?: "full" | "fit" | (string & {});
  truncate?: boolean;
  lines?: number;
  color?: "primary" | "secondary" | "disabled" | "error" | "success";
}

export default function Text({
  size = "md",
  weight = "normal",
  as = "p",
  children,
  align = "left",
  width = "fit",
  truncate = false,
  color = "primary",
  lines,
  ...restProps
}: TextProps): React.ReactElement {
  const Element = ELEMENT_MAPPING[as];

  return (
    <Element
      className={clsx(
        styles.text,
        styles[size],
        styles[weight],
        styles[as],
        truncate && styles.truncate,
        lines && styles.multiLineTruncate,
        styles[color],
        styles[align],
        width && styles[width as "full" | "fit"]
      )}
      style={width && !styles[width as "full" | "fit"] ? { width } : undefined}
      {...restProps}
    >
      {children}
    </Element>
  );
}
