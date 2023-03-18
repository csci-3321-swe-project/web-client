import { ArrowForwardIcon } from "@chakra-ui/icons";
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

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const { logout, isAuthenticated, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Stack>
      <Flex direction="row" align="center" padding={5} width="100%" shadow="md">
        <NextLink href="/" passHref legacyBehavior>
          <Link color="red.800" fontWeight="bold" fontSize="xl">
            Trinity Register
          </Link>
        </NextLink>
        <Spacer />
        {isAuthenticated ? (
          <Button
            colorScheme="teal"
            rightIcon={<ArrowForwardIcon />}
            isLoading={isLoading}
            onClick={handleLogout}
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
