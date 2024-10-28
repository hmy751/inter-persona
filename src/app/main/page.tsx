"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Input,
  keyframes,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { fetchLogin } from "@/apis/user";

const neonGlow = keyframes`
  0% { box-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 20px #00FF00; }
  50% { box-shadow: 0 0 10px #00FF00, 0 0 20px #00FF00, 0 0 40px #00FF00; }
  100% { box-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 20px #00FF00; }
`;

const Mainpage = () => {
  const [nickname, setNickname] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const router = useRouter();

  const { setUser } = useUserStore();

  const handleNicknameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNickname(e.target.value);
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategory(e.target.value);
  };

  const login = async () => {
    const data = await fetchLogin({
      name: nickname,
      developmentCategory: category,
    });
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (!data) return;
      setUser({ id: data?.id, name: data?.name, imageSrc: data?.imageSrc });
      router.push("/interviewer");
    },
  });

  const handleSubmit = () => {
    mutate();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="gray.900"
      bgGradient="linear(to-br, #1a1a2e, #16213e)"
    >
      <Box
        width={{ base: "90%", sm: "400px", md: "500px" }}
        p={8}
        borderRadius="md"
        bg="#0f0f0f"
        boxShadow="0px 0px 15px rgba(0, 255, 0, 0.7)"
        animation={`${neonGlow} 1.5s ease-in-out infinite alternate`}
      >
        <VStack spacing={6}>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="#00FF00"
            textShadow="0 0 10px #00FF00"
          >
            Enter Your Nickname
          </Text>
          <FormControl>
            <FormLabel color="gray.300" fontSize="lg">
              Nickname
            </FormLabel>
            <Input
              value={nickname}
              onChange={handleNicknameInputChange}
              placeholder="Enter your nickname"
              size="lg"
              focusBorderColor="#00FF00"
              bg="gray.800"
              borderColor="gray.600"
              color="white"
              _hover={{
                borderColor: "#00FF00",
              }}
              _focus={{
                boxShadow: "0px 0px 10px #00FF00",
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="lg">
              Category
            </FormLabel>
            <Input
              value={category}
              onChange={handleCategoryInputChange}
              placeholder="Enter your category"
              size="lg"
              focusBorderColor="#00FF00"
              bg="gray.800"
              borderColor="gray.600"
              color="white"
              _hover={{
                borderColor: "#00FF00",
              }}
              _focus={{
                boxShadow: "0px 0px 10px #00FF00",
              }}
            />
          </FormControl>
          <Button
            onClick={handleSubmit}
            colorScheme="green"
            width="100%"
            size="lg"
            bg="#00FF00"
            color="black"
            _hover={{
              bg: "#00cc00",
              boxShadow: "0px 0px 10px #00FF00",
            }}
            _active={{
              bg: "#009900",
            }}
            transition="0.2s"
          >
            Start Game
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Mainpage;
