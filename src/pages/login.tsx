import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import LoginForm from "../forms/login-form";

const LoginPage: NextPage = () => {
  return (
    <Container marginTop={10}>
      <Card>
        <CardHeader>
          <Heading>Mock Login</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={5}>
            <Text>
              This user authentication system should be used for demonstration
              purposes only. This login service will only authenticate users
              marked as mock users in the database.
            </Text>
            <Text>
              To register a mock user, follow the
              <NextLink href="/register" passHref legacyBehavior>
                <Link> registration flow.</Link>
              </NextLink>
            </Text>
            <Divider />
            <LoginForm />
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default LoginPage;
