import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FunctionComponent, PropsWithChildren } from "react";
import useAuth from "../hooks/use-auth";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Stack>
      <Flex direction="row" align="center" padding={5} width="100%" shadow="md">
        <Heading fontSize="xl">TigerPaws</Heading>
        <Spacer />
        {isAuthenticated ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : null}
      </Flex>
      <Box>{children}</Box>
      <Center padding={5}>
        <Text as="small" color="blackAlpha.500">
          &copy; Trinity University, 2023
        </Text>
      </Center>
    </Stack>
  );
};

export default Layout;
