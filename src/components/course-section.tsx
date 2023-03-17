import {
  DeleteIcon,
  EditIcon,
  SmallAddIcon,
  SmallCloseIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Center,
  Heading,
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
import NextLink from "next/link";
import { FunctionComponent, useState } from "react";
import useAccount from "../hooks/use-account";
import useClient from "../hooks/use-client";
import useCurrentCourse from "../hooks/use-current-course";
import useRegistrations from "../hooks/use-registrations";
import { CourseSection, Role } from "../types";
import Show from "./show";

export interface CourseSectionProps {
  courseSection: CourseSection;
}

const CourseSection: FunctionComponent<CourseSectionProps> = ({
  courseSection,
}) => {
  const toast = useToast();
  const client = useClient();
  const account = useAccount();
  const course = useCurrentCourse();
  const registrations = useRegistrations(course.data?.id, courseSection.id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const isRegistered = registrations.data?.some(
    (r) => r.userId === account.data?.id
  );

  const registerCourseSection = async () => {
    try {
      setIsRegistering(true);
      await client.post(
        `/courses/${course.data?.id}/sections/${courseSection.id}/registrations`
      );
      await registrations.mutate();
      toast({ status: "success", title: "Registered for Course Section" });
    } catch (err) {
      toast({ status: "error", title: "Error Registering for Course Section" });
    } finally {
      setIsRegistering(false);
    }
  };

  const unregisterCourseSection = async () => {
    try {
      setIsRegistering(true);
      await client.delete(
        `/courses/${course.data?.id}/sections/${courseSection.id}/registrations`
      );
      await registrations.mutate();
      toast({ status: "success", title: "Unregistered for Course Section" });
    } catch (err) {
      toast({
        status: "error",
        title: "Error Unregistering for Course Section",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const deleteCourseSection = async () => {
    try {
      setIsDeleting(true);
      await client.delete(
        `/courses/${course.data?.id}/sections/${courseSection.id}`
      );
      await course.mutate();
      toast({ status: "success", title: "Course Section Deleted" });
    } catch (err) {
      toast({ status: "error", title: "Error Deleting Course Section" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (
    course.isLoading ||
    !course.data ||
    registrations.isLoading ||
    !registrations.data ||
    account.isLoading ||
    !account.data
  ) {
    return (
      <Center paddingY={10}>
        <Stack align="center" spacing={5}>
          <Text variant="secondary">Loading...</Text>
          <Spinner />
        </Stack>
      </Center>
    );
  }

  return (
    <Card key={courseSection.id}>
      <CardBody>
        <Stack spacing={5}>
          <Wrap justify="end">
            <Show roles={[Role.ADMINISTRATOR]}>
              <NextLink
                href={`/courses/${course.data?.id}/sections/${courseSection.id}/edit`}
              >
                <Button
                  as="a"
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  isDisabled={isDeleting}
                  leftIcon={<EditIcon />}
                >
                  Edit
                </Button>
              </NextLink>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                leftIcon={<DeleteIcon />}
                isLoading={isDeleting}
                onClick={() => deleteCourseSection()}
              >
                Delete
              </Button>
            </Show>
            {isRegistered ? (
              <Button
                size="sm"
                colorScheme="red"
                leftIcon={<SmallCloseIcon />}
                isLoading={isRegistering}
                onClick={() => unregisterCourseSection()}
              >
                Unregister
              </Button>
            ) : (
              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<SmallAddIcon />}
                isLoading={isRegistering}
                onClick={() => registerCourseSection()}
              >
                Register
              </Button>
            )}
          </Wrap>
          <Wrap>
            <Stack>
              <Heading fontSize="md">Instructors</Heading>
              <Text flex={1} textAlign="left">
                {courseSection.instructors
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
              {courseSection.meetings.map((meeting, i) => (
                <Tag key={i}>
                  <TagLeftIcon as={TimeIcon} />
                  {`${meeting.startTime}-${meeting.endTime} ${meeting.daysOfWeek
                    .map((day) => Case.title(day).substring(0, 3))
                    .join(" ")}, ${meeting.location}`}
                </Tag>
              ))}
            </Stack>
          </Wrap>
          <Stack>
            {registrations.data.map((registration) => {
              const fullName = `${registration.user.firstName} ${registration.user.lastName}`;
              return (
                <Wrap key={registration.id} spacing={2} align="center">
                  <Avatar name={fullName} size="xs" />
                  <Text>{fullName}</Text>
                  <Tag size="sm" colorScheme="green">
                    Registered
                  </Tag>
                </Wrap>
              );
            })}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default CourseSection;
