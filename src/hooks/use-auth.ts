import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import useToken from "./use-token";

const useAuth = () => {
  const router = useRouter();
  const toast = useToast();
  const [token, setToken] = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (token: string) => {
    setIsLoading(true);
    setToken(token);
    await router.push("/");
    toast({ status: "success", title: "Login Success" });
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    mutate(() => true, undefined, { revalidate: false });
    setToken(null);
    await router.push("/login");
    toast({ status: "success", title: "Logout Success" });
    setIsLoading(false);
  };

  return { isLoading, login, logout, isAuthenticated: token !== null };
};

export default useAuth;
