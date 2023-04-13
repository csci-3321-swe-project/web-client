import { useRouter } from "next/router";
import useCourse from "./use-course";

/**
 *  Gets the current course.
 * @returns The current course.
 * @example const { data: currentCourse, error } = useCurrentCourse();
 */
const useCurrentCourse = () => {
  const router = useRouter();
  const courseId = router.query.courseId?.toString();
  const course = useCourse(courseId);

  return course;
};

export default useCurrentCourse;
