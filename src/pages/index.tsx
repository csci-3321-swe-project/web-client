import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import Show from "../components/show";
import useAccount from "../hooks/use-account";
import useAuthRedirect from "../hooks/use-auth-redirect";

const Home: NextPage = () => {
  const account = useAccount();
  useAuthRedirect("/login");
  return (
    <>
      <Container paddingY={10} maxWidth="container.lg">
        {account.isLoading || !account.data ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Flex align="center">
            <Stack>
              <HStack>
                <Badge colorScheme="blue">{account.data.role}</Badge>
                {account.data.isMock && (
                  <Badge colorScheme="purple">Mock Account</Badge>
                )}
              </HStack>
              <Heading>{`${account.data.firstName} ${account.data.lastName}`}</Heading>
              <Text>{account.data.email}</Text>
            </Stack>
            <Spacer />
            <Show roles={["ADMINISTRATOR"]}>
              <NextLink href="/courses/create" passHref legacyBehavior>
                <Button as="a" colorScheme="blue">
                  New Course
                </Button>
              </NextLink>
            </Show>
          </Flex>
        )}
      </Container>
      <Container paddingY={10}>
        <Stack>
          <HStack>
            <Input isDisabled />
            <Button isDisabled>Search</Button>
          </HStack>
          <Box backgroundColor="gray.200" height={50} />
          <Box backgroundColor="gray.100" height={50} />
          <Box backgroundColor="gray.50" height={50} />
        </Stack>
      </Container>
    </>
  );
};

export default Home;
