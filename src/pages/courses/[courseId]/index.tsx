import { NextPage } from "next";
import { useRouter } from "next/router";
import useCourse from "../../../hooks/use-course";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const course = useCourse(router.query.courseId?.toString());
  console.log(course.data);

  return <p>Course Page</p>;
};

export default CoursePage;
