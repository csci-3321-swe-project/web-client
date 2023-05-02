import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Link,
  Spacer,
  Spinner,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import Show from "../components/show";
import SearchForm from "../forms/search-form";
import useAccount from "../hooks/use-account";
import useAuthRedirect from "../hooks/use-auth-redirect";
import { Role } from "../types";

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
          <Stack spacing={5}>
            <Wrap spacing={5} align="center">
              <Stack>
                <HStack>
                  <Badge colorScheme="teal">{account.data.role}</Badge>
                  {account.data.isMock && (
                    <Badge colorScheme="purple">Mock Account</Badge>
                  )}
                </HStack>
                <Heading>{`${account.data.firstName} ${account.data.lastName}`}</Heading>
                <Text>{account.data.email}</Text>
              </Stack>
              <Spacer />
              <Show roles={[Role.ADMINISTRATOR]}>
                <NextLink href="/courses/create" passHref legacyBehavior>
                  <Button as="a" colorScheme="teal" leftIcon={<AddIcon />}>
                    New Course
                  </Button>
                </NextLink>
              </Show>
            </Wrap>
          </Stack>
        )}
      </Container>
      {account.data?.registrations.length ? (
        <Container>
          <Stack>
            <Heading>Registrations</Heading>
            <Stack>
              {account.data.registrations.map((registration) => (
                <NextLink
                  key={registration.id}
                  href={\`/courses/${registration.courseSection.course.id}\`}
                  passHref
                  legacyBehavior
                >
                  <Link>{`${registration.courseSection.course.name} (${registration.courseSection.course.term.season} ${registration.courseSection.course.term.year})`}</Link>
                </NextLink>
              ))}
            </Stack>
          </Stack>
        </Container>
      ) : null}
      <Container maxWidth="container.md" paddingY={10}>
        <SearchForm />
      </Container>
    </>
  );
};

export default Home;
