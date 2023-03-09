import useSwr from "swr";
import { Course } from "../types";
import useClient from "./use-client";

const useCourse = (id?: string) => {
  const client = useClient();

  return useSwr(
    `/courses/${id}`,
    async (path) => (await client.get<Course>(path)).data
  );
};

export default useCourse;
