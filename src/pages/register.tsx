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
import RegisterForm from "../forms/register-form";

const RegisterPage: NextPage = () => {
  return (
    <Container marginTop={10}>
      <Card>
        <CardHeader>
          <Heading>Mock Register</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={5}>
            <Text>
              This user authentication system should be used for demonstration
              purposes only. Users created through this system are marked as
              mock users.
            </Text>
            <Text>
              To log in as a mock user, follow the
              <NextLink href="/login" passHref legacyBehavior>
                <Link> login flow.</Link>
              </NextLink>
            </Text>
            <Divider />
            <RegisterForm />
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RegisterPage;
