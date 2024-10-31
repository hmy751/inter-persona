import { Box, Flex } from "@chakra-ui/react";
import Avatar from "@repo/ui/Avatar";

export default function InterviewerProfile({
  src,
  name,
  description,
}: {
  src?: string;
  name?: string;
  description?: string;
}) {
  return (
    <Box display={"flex"} gap="20px" width="100%" height="160px">
      <Avatar
        src={src || "/assets/images/elon_musk.png"}
        width={"160px"}
        height={"160px"}
      />
      <Flex flexDirection={"column"} gap={"12px"} justifyContent={"center"}>
        <Box>{name}</Box>
        <Box color="font.gray">{description}</Box>
      </Flex>
    </Box>
  );
}
