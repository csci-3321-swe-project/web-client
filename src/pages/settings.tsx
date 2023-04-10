import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { default as NextLink } from "next/link";

const SettingsPage: NextPage = () => {
  return (
    <Container marginTop={10}>
      <Card>
        <CardHeader>
          <Heading>Settings</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={5}>
            <Text>These global settings apply to the entire application.</Text>
            <Divider />
            <NextLink href="/terms" passHref legacyBehavior>
              <Button
                leftIcon={<EditIcon />}
                as="a"
                colorScheme="teal"
                variant="outline"
              >
                Edit Terms
              </Button>
            </NextLink>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default SettingsPage;
