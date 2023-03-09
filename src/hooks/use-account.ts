import useSwr from "swr";
import { User } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

const useAccount = () => {
  const { isAuthenticated } = useAuth();
  const client = useClient();

  return useSwr(
    isAuthenticated ? "/account" : null,
    async (path) => (await client.get<User>(path)).data
  );
};

export default useAccount;
