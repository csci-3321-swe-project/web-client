import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useToken from "./use-token";

const useAuth = () => {
  const router = useRouter();
  const toast = useToast();
  const [token, setToken] = useToken();

  const login = async (token: string) => {
    setToken(token);
    await router.push("/");
    toast({ status: "success", title: "Login Success" });
  };

  const logout = async () => {
    await router.push("/login");
    setToken(null);
    toast({ status: "success", title: "Logout Success" });
  };

  return { login, logout, isAuthenticated: token !== null };
};

export default useAuth;
