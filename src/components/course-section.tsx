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
  Heading,
  Skeleton,
  Spacer,
  Stack,
  Tag,
  TagLeftIcon,
  Text,
  Wrap,
} from "@chakra-ui/react";
import Case from "case";
import NextLink from "next/link";
import { FunctionComponent } from "react";
import useAccount from "../hooks/use-account";
import useCourseSection from "../hooks/use-course-section";
import useCurrentCourse from "../hooks/use-current-course";
import useRoster from "../hooks/use-roster";
import { Role } from "../types";
import AuditData from "./audit-data";
import Registration from "./registration";
import Show from "./show";

export interface CourseSectionProps {
  id: string;
}

const CourseSection: FunctionComponent<CourseSectionProps> = ({ id }) => {
  const account = useAccount();
  const course = useCurrentCourse();
  const roster = useRoster(course.data?.id, id);
  const courseSection = useCourseSection(course.data?.id, id);
  const registrations = roster.data
    ? [...roster.data.students, ...roster.data.waitlist]
    : [];
  const isRegistered = registrations.some((r) => r.userId === account.data?.id);

  if (
    course.isLoading ||
    !course.data ||
    roster.isLoading ||
    !roster.data ||
    account.isLoading ||
    !account.data ||
    courseSection.isLoading ||
    !courseSection.data
  ) {
    return <Skeleton height={200} />;
  }

  return (
    <Card>
      <CardBody>
        <Stack spacing={5}>
          <Wrap justify="end">
            <Show roles={[Role.ADMINISTRATOR]}>
              <NextLink
                href={`/courses/${course.data.id}/sections/${courseSection.data.id}/edit`}
                passHref
                legacyBehavior
              >
                <Button
                  as="a"
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
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
                isLoading={courseSection.isRemoving}
                onClick={() => courseSection.remove()}
              >
                Delete
              </Button>

              <AuditData data={courseSection.data} />
            </Show>
            {isRegistered ? (
              <Button
                size="sm"
                colorScheme="red"
                leftIcon={<SmallCloseIcon />}
                isLoading={courseSection.isUnregistering}
                onClick={() => courseSection.unregister()}
              >
                Unregister
              </Button>
            ) : (
              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<SmallAddIcon />}
                isLoading={courseSection.isRegistering}
                onClick={() => courseSection.register()}
              >
                Register
              </Button>
            )}
          </Wrap>
          <Wrap>
            <Stack>
              <Heading fontSize="md">Instructors</Heading>
              <Text flex={1} textAlign="left">
                {courseSection.data.instructors
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
              {courseSection.data.meetings.map((meeting, i) => (
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
