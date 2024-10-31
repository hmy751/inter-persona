import Avatar from "@repo/ui/Avatar";
import { Box, Flex } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const { user, isLoggedIn, setUser, clearUser } = useUserStore();

  return (
    <Flex flexDirection={"column"} minHeight={"100vh"}>
      <Box
        as="section"
        width="100%"
        display="flex"
        flex={1}
        justifyContent={"center"}
        marginBottom="40px"
      >
        {children}
      </Box>
    </Flex>
  );
}
