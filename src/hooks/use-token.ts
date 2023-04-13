import useLocalStorageState from "use-local-storage-state";

/**
 * Gets the user's token.
 * @returns The token.
 * @example const [token, setToken] = useToken();
 */
const useToken = () => {
  return useLocalStorageState("token");
};

export default useToken;
