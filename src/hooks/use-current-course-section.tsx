import { useRouter } from "next/router";
import useCourseSection from "./use-course-section";

/**
 * Fetches the current course section
 * @returns - The current course section
 * @example - const { data: courseSection, error } = useCurrentCourseSection();
 */
const useCurrentCourseSection = () => {
  const router = useRouter();
  const courseId = router.query.courseId?.toString();
  const sectionId = router.query.sectionId?.toString();
  const courseSection = useCourseSection(courseId, sectionId);

  return courseSection;
};

export default useCurrentCourseSection;
