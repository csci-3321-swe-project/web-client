import { AxiosError } from "axios";
import useSwr from "swr";
import { Course } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

/**
 * Fetches a course by id.
 * @param id - The course id.
 * @returns The course.
 * @example const { data: course, error } = useCourse(id);
 */
const useCourse = (id?: string) => {
  const client = useClient();
  const { isAuthenticated } = useAuth();

  return useSwr<Course, AxiosError>(
    isAuthenticated && id ? `/courses/${id}` : null,
    async (path) => (await client.get<Course>(path)).data
  );
};

export default useCourse;
