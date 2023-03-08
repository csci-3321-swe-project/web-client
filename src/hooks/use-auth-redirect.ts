import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuth from "./use-auth";

const useAuthRedirect = (path: string) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(path);
    }
  }, [isAuthenticated, path, router]);
};

export default useAuthRedirect;
