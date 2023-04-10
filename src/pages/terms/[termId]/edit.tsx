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
import EditTermForm from "../../../forms/edit-term-form";

const EditTermPage: NextPage = () => {
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
            <Heading>Edit Term</Heading>
          </Stack>
        </CardHeader>
        <CardBody>
          <EditTermForm />
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditTermPage;
