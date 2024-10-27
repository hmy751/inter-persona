import {
  Button as CButton,
  ButtonProps as CButtonProps,
  Image,
} from "@chakra-ui/react";

interface ButtonProps extends CButtonProps {}

export default function Button({ children, ...restProps }: ButtonProps) {
  return <CButton {...restProps}>{children}</CButton>;
}
