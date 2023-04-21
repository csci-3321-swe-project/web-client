import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import Term from "../../components/term";
import useCurrentTerm from "../../hooks/use-current-term";
import useTerms from "../../hooks/use-terms";

const TermsPage: NextPage = () => {
  const currentTerm = useCurrentTerm();
  const terms = useTerms();

  if (terms.isLoading || !terms.data) {
    return (
      <Center paddingY={10}>
        <Stack align="center" spacing={5}>
          <Text variant="secondary">Loading...</Text>
          <Spinner />
        </Stack>
      </Center>
    );
  }

  return (
    <Container marginY={10}>
      <Card>
        <CardHeader>
          <Stack spacing={5}>
            <NextLink href="/settings" legacyBehavior passHref>
              <Button
                as="a"
                alignSelf="start"
                variant="link"
                leftIcon={<ArrowBackIcon />}
              >
                Settings
              </Button>
            </NextLink>
            <Heading>Terms</Heading>
          </Stack>
        </CardHeader>
        <CardBody>
          <Stack spacing={5}>
            <NextLink href="/terms/create" passHref legacyBehavior>
              <Button
                alignSelf="start"
                leftIcon={<AddIcon />}
                colorScheme="teal"
              >
                Add Term
              </Button>
            </NextLink>
            {terms.data.map((term) => (
              <Term
                key={term.id}
                id={term.id}
                isCurrent={term.id === currentTerm.data?.id}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default TermsPage;
