import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import useSwr from "swr";
import { CourseSection, Registration } from "../types";
import useAccount from "./use-account";
import useAuth from "./use-auth";
import useClient from "./use-client";
import useCourse from "./use-course";
import useRoster from "./use-roster";

/**
 * Fetches a course section by id
 * @param courseId - The course id
 * @param sectionId - The section id
 * @returns - The course section
 */
const useCourseSection = (courseId?: string, sectionId?: string) => {
  const { isAuthenticated } = useAuth();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const client = useClient();
  const course = useCourse(courseId);
  const roster = useRoster(courseId, sectionId);
  const account = useAccount();
  const toast = useToast();
  const courseSection = useSwr<CourseSection, AxiosError>(
    isAuthenticated && courseId && sectionId
      ? `/courses/${courseId}/sections/${sectionId}`
      : null,
    async (path) => (await client.get<CourseSection>(path)).data
  );

  const remove = async () => {
    if (!course.data || !courseSection.data) {
      return;
    }

    try {
      setIsRemoving(true);

      await client.delete(`/courses/${courseId}/sections/${sectionId}`);
      await courseSection.mutate(undefined);
      await course.mutate({
        ...course.data,
        courseSections: course.data.courseSections.filter(
          (cs) => cs.id !== sectionId
        ),
      });

      toast({ status: "success", title: "Course Section Deleted" });
    } catch (err) {
      toast({ status: "error", title: "Error Deleting Course Section" });
    } finally {
      setIsRemoving(false);
    }
  };

  const register = async () => {
    if (!course.data || !courseSection.data) {
      return;
    }

    try {
      setIsRegistering(true);
      const newRegistration = await client.post<Registration>(
        `/courses/${course.data?.id}/sections/${courseSection.data.id}/registrations`
      );
      await roster.mutate();
      toast({ status: "success", title: "Registered for Course Section" });
    } catch (err) {
      toast({ status: "error", title: "Error Registering for Course Section" });
    } finally {
      setIsRegistering(false);
    }
  };

  const unregister = async () => {
    try {
      setIsUnregistering(true);
      await client.delete(
        `/courses/${courseId}/sections/${sectionId}/registrations`
      );
      await roster.mutate();
      toast({ status: "success", title: "Unregistered for Course Section" });
    } catch (err) {
      toast({
        status: "error",
        title: "Error Unregistering for Course Section",
      });
    } finally {
      setIsUnregistering(false);
    }
  };

  return {
    remove,
    isRemoving,
    register,
    isRegistering,
    unregister,
    isUnregistering,
    ...courseSection,
  };
};

export default useCourseSection;
