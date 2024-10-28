"use client";
import Avatar from "@/components/Avatar";
import { Box, Flex } from "@chakra-ui/react";
import useUserStore from "@/store/useUserStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();

  return (
    <Flex flexDirection={"column"} minHeight={"100vh"}>
      <Flex
        as="header"
        width="100%"
        height="80px"
        backgroundColor={"#F3F6F7"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {user && (
          <Flex width={"100%"} maxWidth={726} gap={"10px"}>
            <Avatar src={user?.imageSrc} />
            <Flex alignItems={"center"} as={"p"}>
              {user?.name}
            </Flex>
          </Flex>
        )}
      </Flex>
      <Box
        as="section"
        width="100%"
        display="flex"
        flex={1}
        justifyContent={"center"}
      >
        {children}
      </Box>
    </Flex>
  );
}
