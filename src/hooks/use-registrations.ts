import { AxiosError } from "axios";
import useSwr from "swr";
import { Registration } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

const useRegistrations = (courseId?: string, sectionId?: string) => {
  const client = useClient();
  const { isAuthenticated } = useAuth();

  return useSwr<Registration[], AxiosError>(
    isAuthenticated && courseId && sectionId
      ? `/courses/${courseId}/sections/${sectionId}/registrations`
      : null,
    async (path) => (await client.get<Registration[]>(path)).data
  );
};

export default useRegistrations;
