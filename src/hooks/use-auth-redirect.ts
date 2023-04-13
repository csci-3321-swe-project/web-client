import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuth from "./use-auth";

/**
 * Redirects the user to a specified path if they are not authenticated.
 * @param path The path to redirect to if the user is not authenticated.
 */
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
