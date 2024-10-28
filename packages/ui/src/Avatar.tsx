import {
  Avatar as CAvatar,
  AvatarProps as CAvatarProps,
} from "@chakra-ui/react";

interface AvatarProps extends CAvatarProps {
  src: string;
  size?: string;
}

export default function Avatar({ src, size, ...restProps }: AvatarProps) {
  return <CAvatar src={src} size={size} {...restProps} />;
}
