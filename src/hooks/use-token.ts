import useLocalStorageState from "use-local-storage-state";

const useToken = () => {
  return useLocalStorageState("token", undefined);
};

export default useToken;
