import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import EditCourseForm from "../../../forms/edit-course-form";

const EditCoursePage: NextPage = () => {
  const router = useRouter();
  const courseId = router.query.courseId?.toString();

  return (
    <Container marginTop={10}>
      <Card>
        <CardHeader>
          <Stack spacing={5}>
            <NextLink href={`/courses/${courseId}`} legacyBehavior passHref>
              <Button
                as="a"
                alignSelf="start"
                variant="link"
                leftIcon={<ArrowBackIcon />}
              >
                Course Details
              </Button>
            </NextLink>
            <Heading>Edit Course</Heading>
          </Stack>
        </CardHeader>
        <CardBody>
          <EditCourseForm />
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditCoursePage;
