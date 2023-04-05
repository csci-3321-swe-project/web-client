import {
  DeleteIcon,
  EditIcon,
  SmallAddIcon,
  SmallCloseIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
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
import { mutate } from "swr";
import useAccount from "../hooks/use-account";
import useClient from "../hooks/use-client";
import useCurrentCourse from "../hooks/use-current-course";
import useRoster from "../hooks/use-roster";
import {
  CourseSection,
  Registration as RegistrationType,
  Role,
} from "../types";
import Registration from "./registration";
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
  const roster = useRoster(course.data?.id, courseSection.id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const registrations = roster.data
    ? [...roster.data.students, ...roster.data.waitlist]
    : [];
  const isRegistered = registrations.some((r) => r.userId === account.data?.id);

  const registerCourseSection = async () => {
    try {
      setIsRegistering(true);
      const newRegistration = await client.post<RegistrationType>(
        `/courses/${course.data?.id}/sections/${courseSection.id}/registrations`
      );
      await roster.mutate({
        students: [...(roster.data?.students || []), newRegistration.data],
        waitlist: roster.data?.waitlist || [],
      });
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
      await roster.mutate({
        students:
          roster.data?.students.filter((r) => r.userId !== account.data?.id) ||
          [],
        waitlist:
          roster.data?.waitlist.filter((r) => r.userId !== account.data?.id) ||
          [],
      }),
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
    if (!course.data) {
      return;
    }

    try {
      setIsDeleting(true);
      await client.delete(
        `/courses/${course.data.id}/sections/${courseSection.id}`
      );

      // Remove course section
      await mutate(
        `/courses/${course.data.id}/sections/${courseSection.id}`,
        undefined
      );

      // Remove course section from course
      await course.mutate({
        ...course.data,
        courseSections: course.data.courseSections.filter(
          (cs) => cs.id !== courseSection.id
        ),
      });

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
    roster.isLoading ||
    !roster.data ||
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
                passHref
                legacyBehavior
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
            {roster.data.students.map((registration) => (
              <Registration
                key={registration.id}
                registration={registration}
                status="student"
              />
            ))}
            {roster.data.waitlist.map((registration) => (
              <Registration
                key={registration.id}
                registration={registration}
                status="waitlist"
              />
            ))}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default CourseSection;
