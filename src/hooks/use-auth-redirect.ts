import { useRouter } from "next/router";
import { useEffect } from "react";
import useToken from "./use-token";

const useAuthRedirect = (path: string) => {
  const router = useRouter();
  const [token] = useToken();

  useEffect(() => {
    if (!token) {
      router.push(path);
    }
  }, [token, path, router]);
};

export default useAuthRedirect;
