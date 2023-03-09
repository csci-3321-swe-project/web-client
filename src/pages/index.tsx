import {
  Badge,
  Box,
  Button,
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
          <Spinner />
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
              <Button isDisabled colorScheme="blue">
                New Course
              </Button>
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
