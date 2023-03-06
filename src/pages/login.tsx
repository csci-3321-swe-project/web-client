import { Card, CardBody, CardHeader, Center, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import LoginForm from "../forms/login-form";

const LoginPage: NextPage = () => {
  return (
    <Center marginTop={10}>
      <Card>
        <CardHeader>
          <Heading>Login</Heading>
        </CardHeader>
        <CardBody>
          <LoginForm />
        </CardBody>
      </Card>
    </Center>
  );
};

export default LoginPage;
