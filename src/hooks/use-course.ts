import useSwr from "swr";
import { Course } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

const useCourse = (id?: string) => {
  const client = useClient();
  const { isAuthenticated } = useAuth();

  return useSwr(
    isAuthenticated && id ? `/courses/${id}` : null,
    async (path) => (await client.get<Course>(path)).data
  );
};

export default useCourse;
