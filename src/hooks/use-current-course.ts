import { useRouter } from "next/router";
import useCourse from "./use-course";

const useCurrentCourse = () => {
  const router = useRouter();
  const courseId = router.query.courseId?.toString();
  const course = useCourse(courseId);

  return course;
};

export default useCurrentCourse;
