import { AddIcon, ArrowBackIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Stack,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import Case from "case";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import CourseSection from "../../../components/course-section";
import Show from "../../../components/show";
import useClient from "../../../hooks/use-client";
import useCurrentCourse from "../../../hooks/use-current-course";
import { Role } from "../../../types";

const CoursePage: NextPage = () => {
  const course = useCurrentCourse();
  const client = useClient();
  const router = useRouter();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCourse = async () => {
    try {
      setIsDeleting(true);
      await client.delete(`/courses/${course.data?.id}`);
      await course.mutate(undefined);
      await router.push("/");
      toast({ status: "success", title: "Course Deleted" });
    } catch (err) {
      toast({ status: "error", title: "Error Deleting Course" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (course.error !== undefined) {
    return (
      <Container>
        <Center paddingY={10}>
          <Alert status="error">{course.error.message}</Alert>
        </Center>
      </Container>
    );
  }

  if (course.isLoading || !course.data) {
    return (
      <Center paddingY={10}>
        <Stack align="center" spacing={5}>
          <Text variant="secondary">Loading course...</Text>
          <Spinner />
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <Container paddingY={10} maxWidth="container.lg">
        <Stack spacing={5}>
          <NextLink href="/" legacyBehavior passHref>
            <Button
              as="a"
              alignSelf="start"
              variant="link"
              leftIcon={<ArrowBackIcon />}
            >
              Search Courses
            </Button>
          </NextLink>
          <Wrap spacing={5} align="center">
            <Stack>
              <HStack>
                <Badge>{Case.title(course.data.department)}</Badge>
                <Badge>{course.data.code}</Badge>
                <Badge>{Case.title(course.data.term)}</Badge>
              </HStack>
              <Heading>{`${course.data.name}`} </Heading>
            </Stack>
            <Spacer />
            <Show roles={[Role.ADMINISTRATOR]}>
              <NextLink
                href={`/courses/${course.data.id}/edit`}
                passHref
                legacyBehavior
              >
                <Button as="a" colorScheme="teal" leftIcon={<EditIcon />}>
                  Edit
                </Button>
              </NextLink>
              <Button
                isLoading={isDeleting}
                onClick={() => deleteCourse()}
                colorScheme="red"
                leftIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Show>
          </Wrap>
        </Stack>
      </Container>
      <Container maxWidth="container.sm" paddingY={10}>
        <Stack spacing={5}>
          <Heading fontSize="3xl">Description</Heading>
          <Text>{course.data.description}</Text>
          <Heading fontSize="3xl">Sections</Heading>
          {course.data.courseSections.length ? (
            <Stack spacing={5}>
              {course.data.courseSections.map((courseSection) => (
                <CourseSection
                  key={courseSection.id}
                  courseSection={courseSection}
                />
              ))}
              <Show roles={[Role.ADMINISTRATOR]}>
                <Center>
                  <NextLink
                    href={`/courses/${course.data.id}/sections/create`}
                    passHref
                    legacyBehavior
                  >
                    <Button
                      variant="outline"
                      as="a"
                      leftIcon={<AddIcon />}
                      colorScheme="teal"
                    >
                      Add
                    </Button>
                  </NextLink>
                </Center>
              </Show>
            </Stack>
          ) : (
            <Card paddingY={10} variant="outline">
              <CardBody>
                <Stack align="center" spacing={5}>
                  <Text variant="secondary">
                    There are no sections for this course.
                  </Text>
                  <Show roles={[Role.ADMINISTRATOR]}>
                    <NextLink
                      href={`/courses/${course.data.id}/sections/create`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="outline"
                        as="a"
                        leftIcon={<AddIcon />}
                        colorScheme="teal"
                      >
                        Add
                      </Button>
                    </NextLink>
                  </Show>
                </Stack>
              </CardBody>
            </Card>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default CoursePage;
