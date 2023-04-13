import axios from "axios";
import useToken from "./use-token";

/**
 *  Creates an axios client with the user's token.
 * @returns The axios client.
 */
const useClient = () => {
  const [token] = useToken();

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  return client;
};

export default useClient;
