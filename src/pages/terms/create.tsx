import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import CreateTermForm from "../../forms/create-term-form";

const CreateTermPage: NextPage = () => {
  return (
    <Container marginY={10}>
      <Card>
        <CardHeader>
          <Stack spacing={5}>
            <NextLink href="/terms" legacyBehavior passHref>
              <Button
                as="a"
                alignSelf="start"
                variant="link"
                leftIcon={<ArrowBackIcon />}
              >
                Terms
              </Button>
            </NextLink>
            <Heading>Create Term</Heading>
          </Stack>
        </CardHeader>
        <CardBody>
          <CreateTermForm />
        </CardBody>
      </Card>
    </Container>
  );
};

export default CreateTermPage;
