import { ArrowForwardIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FunctionComponent, PropsWithChildren } from "react";
import useAuth from "../hooks/use-auth";
import { Role } from "../types";
import Show from "./show";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const { logout, isAuthenticated, isLoading } = useAuth();

  return (
    <Stack>
      <Flex
        gap={5}
        direction="row"
        align="center"
        padding={5}
        width="100%"
        shadow="md"
      >
        <NextLink href="/" passHref legacyBehavior>
          <Link color="red.800" fontWeight="bold" fontSize="xl">
            Trinity Register
          </Link>
        </NextLink>
        <Spacer />
        <Show roles={[Role.ADMINISTRATOR]}>
          <NextLink href="/settings" passHref legacyBehavior>
            <Button leftIcon={<SettingsIcon />} colorScheme="teal" as="a">
              Settings
            </Button>
          </NextLink>
        </Show>
        {isAuthenticated ? (
          <Button
            rightIcon={<ArrowForwardIcon />}
            isLoading={isLoading}
            onClick={() => logout()}
            variant="link"
          >
            Logout
          </Button>
        ) : null}
      </Flex>
      <Box>{children}</Box>
      <Center padding={5}>
        <Text variant="secondary">&copy; Trinity University, 2023</Text>
      </Center>
    </Stack>
  );
};

export default Layout;
