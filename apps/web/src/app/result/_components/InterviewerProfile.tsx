import { Box, Flex } from "@chakra-ui/react";
import Avatar from "@/components/Avatar";

export default function InterviewerProfile() {
  return (
    <Box display={"flex"} gap="20px" width="100%" height="160px">
      <Avatar
        src="/assets/images/elon_musk.png"
        width={"160px"}
        height={"160px"}
      />
      <Flex flexDirection={"column"} gap={"12px"} justifyContent={"center"}>
        <Box>엘론 머스크</Box>
        <Box color="font.gray">
          뛰어난 실력자, 개발자, 뛰어난 실력자, 개발자 뛰어난 실력자, 개발자,
          뛰어난 실력자, 개발자 뛰어난 실력자, 개발자, 뛰어난 실력자, 개발자
        </Box>
      </Flex>
    </Box>
  );
}
