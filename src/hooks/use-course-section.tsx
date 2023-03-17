import { AxiosError } from "axios";
import useSwr from "swr";
import { CourseSection } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

const useCourseSection = (courseId?: string, sectionId?: string) => {
  const client = useClient();
  const { isAuthenticated } = useAuth();

  return useSwr<CourseSection, AxiosError>(
    isAuthenticated && courseId && sectionId
      ? `/courses/${courseId}/sections/${sectionId}`
      : null,
    async (path) => (await client.get<CourseSection>(path)).data
  );
};

export default useCourseSection;
