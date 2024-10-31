import {
  Avatar as CAvatar,
  AvatarProps as CAvatarProps,
} from "@chakra-ui/react";

interface AvatarProps extends CAvatarProps {
  src: string;
  size?: string;
}

export default function Avatar({ src, size, ...restProps }: AvatarProps) {
  // 해당 부분은 Expression produces a union type that is too complex to represent.에러
  // 라이브러리 교체 가능성이 있음
  // @ts-ignore
  return <CAvatar src={src} size={size} {...restProps} />;
}
