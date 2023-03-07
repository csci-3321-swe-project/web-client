import { Button, Flex, Heading, Spacer, Stack } from "@chakra-ui/react";
import { FunctionComponent, PropsWithChildren } from "react";
import useToken from "../hooks/use-token";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [, setToken] = useToken();

  const handleLogout = () => setToken(undefined);

  return (
    <Stack>
      <Flex direction="row" align="center" padding={5} width="100%" shadow="md">
        <Heading fontSize="xl">TigerPaws</Heading>
        <Spacer />
        <Button onClick={handleLogout} colorScheme="blue">
          Logout
        </Button>
      </Flex>
    </Stack>
  );
};

export default Layout;
