import useSwr from "swr";
import { User } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

/**
 * Fetches the current user's account information.
 * @returns The current user's account information.
 * @example const { data: account, error } = useAccount();
 */
const useAccount = () => {
  const { isAuthenticated } = useAuth();
  const client = useClient();

  return useSwr(
    isAuthenticated ? "/account" : null,
    async (path) => (await client.get<User>(path)).data
  );
};

export default useAccount;
