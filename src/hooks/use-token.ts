import useLocalStorage from "use-local-storage";

const useToken = () => {
  return useLocalStorage("token", "");
};

export default useToken;
