import { AxiosError } from "axios";
import useSwr from "swr";
import { Registration } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

/**
 * Fetches the registrations for a section.
 * @param courseId - The course id.
 * @param sectionId - The section id.
 * @returns The registrations for a section.
 * @example const { data: registrations, error } = useRegistrations(courseId, sectionId);
 */
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
