import {
  AddIcon,
  ArrowBackIcon,
  DeleteIcon,
  EditIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  ListItem,
  OrderedList,
  Spacer,
  Spinner,
  Stack,
  Tag,
  TagLeftIcon,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import Case from "case";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useClient from "../../../hooks/use-client";
import useCurrentCourse from "../../../hooks/use-current-course";

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
          <Flex gap={5} align="center">
            <Stack>
              <HStack>
                <Badge>{Case.title(course.data.department)}</Badge>
                <Badge>{course.data.code}</Badge>
                <Badge>{Case.title(course.data.term)}</Badge>
              </HStack>
              <Heading>{`${course.data.name}`} </Heading>
            </Stack>
            <Spacer />
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
          </Flex>
        </Stack>
      </Container>
      <Container maxWidth="container.sm" paddingY={10}>
        <Stack spacing={5}>
          <Heading fontSize="3xl">Description</Heading>
          <Text>{course.data.description}</Text>
          <Heading fontSize="3xl">Sections</Heading>
          {course.data.courseSections.length ? (
            <Stack spacing={5}>
              {course.data.courseSections.map(
                ({ id, instructors, meetings }) => (
                  <Card key={id}>
                    <CardBody>
                      <Stack spacing={5}>
                        <Wrap justify="end">
                          <Button
                            size="sm"
                            colorScheme="teal"
                            variant="outline"
                            leftIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            isLoading={isDeleting}
                            leftIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                        </Wrap>
                        <Wrap>
                          <Stack>
                            <Heading fontSize="md">Instructors</Heading>
                            <Text flex={1} textAlign="left">
                              {instructors
                                .map(
                                  (instructor) =>
                                    `${instructor.firstName} ${instructor.lastName}`
                                )
                                .join(", ")}
                            </Text>
                          </Stack>
                          <Spacer />
                          <Stack>
                            <Heading textAlign="right" fontSize="md">
                              Meetings
                            </Heading>
                            {meetings.map((meeting, i) => (
                              <Tag key={i}>
                                <TagLeftIcon as={TimeIcon} />
                                {`${meeting.startTime}-${
                                  meeting.endTime
                                } ${meeting.daysOfWeek
                                  .map((day) => Case.title(day).substring(0, 3))
                                  .join(" ")}, ${meeting.location}`}
                              </Tag>
                            ))}
                          </Stack>
                        </Wrap>
                        <OrderedList listStylePosition="inside" spacing={2}>
                          <ListItem>
                            Alice Worthington &nbsp;
                            <Tag size="sm" colorScheme="green">
                              Registered
                            </Tag>
                          </ListItem>
                          <ListItem>
                            Bob Sue &nbsp;
                            <Tag size="sm" colorScheme="green">
                              Registered
                            </Tag>
                          </ListItem>
                          <ListItem>
                            John Doe &nbsp;
                            <Tag size="sm" colorScheme="yellow">
                              Waitlisted
                            </Tag>
                          </ListItem>
                        </OrderedList>
                      </Stack>
                    </CardBody>
                  </Card>
                )
              )}
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
            </Stack>
          ) : (
            <Card paddingY={10} variant="outline">
              <CardBody>
                <Stack align="center" spacing={5}>
                  <Text variant="secondary">
                    There are no sections for this course.
                  </Text>
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
