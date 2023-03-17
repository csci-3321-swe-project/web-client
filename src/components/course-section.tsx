import { DeleteIcon, EditIcon, TimeIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Heading,
  ListItem,
  OrderedList,
  Spacer,
  Stack,
  Tag,
  TagLeftIcon,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import Case from "case";
import { FunctionComponent, useState } from "react";
import useClient from "../hooks/use-client";
import useCurrentCourse from "../hooks/use-current-course";
import { CourseSection } from "../types";

export interface CourseSectionProps {
  courseSection: CourseSection;
}

const CourseSection: FunctionComponent<CourseSectionProps> = ({
  courseSection,
}) => {
  const toast = useToast();
  const client = useClient();
  const course = useCurrentCourse();
  const [isDeleting, setIsDeleting] = useState(false);

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
  return (
    <Card key={courseSection.id}>
      <CardBody>
        <Stack spacing={5}>
          <Wrap justify="end">
            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              isDisabled={isDeleting}
              leftIcon={<EditIcon />}
            >
              Edit
            </Button>
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
  );
};

export default CourseSection;
