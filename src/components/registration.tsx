import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Fade,
  Skeleton,
  Spacer,
  Tag,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import useClient from "../hooks/use-client";
import useCurrentCourse from "../hooks/use-current-course";
import useRoster from "../hooks/use-roster";
import { Registration as RegistrationType, Role } from "../types";
import Show from "./show";

export interface RegistrationProps {
  registration: RegistrationType;
  status: "student" | "waitlist";
}

const Registration: FunctionComponent<RegistrationProps> = ({
  registration,
  status,
}) => {
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const client = useClient();
  const toast = useToast();
  const course = useCurrentCourse();
  const roster = useRoster(course.data?.id, registration.courseSectionId);
  const fullName = `${registration.user.firstName} ${registration.user.lastName}`;

  const updatePriority = async (priority: boolean) => {
    try {
      setIsUpdatingPriority(true);
      await client.put(
        `/courses/${course.data?.id}/sections/${registration.courseSectionId}/registrations/${registration.id}`,
        { priority: priority }
      );
      await roster.mutate();
      toast({ status: "success", title: "Registration Updated" });
    } catch (err) {
      toast({ status: "error", title: "Error Prioritizing Registration" });
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  if (roster.isLoading || !roster.data) {
    return <Skeleton height={10} />;
  }

  return (
    <Fade in>
      <Wrap spacing={2} align="center">
        <Avatar name={fullName} size="xs" />
        <Text>{fullName}</Text>
        {status === "student" ? (
          <Tag size="sm" colorScheme="green">
            Registered
          </Tag>
        ) : (
          <Tag size="sm" colorScheme="yellow">
            Waitlisted
          </Tag>
        )}
        {registration.priority && (
          <Tag size="sm" colorScheme="purple">
            Priority
          </Tag>
        )}
        <Spacer />
        <Show roles={[Role.ADMINISTRATOR, Role.PROFESSOR]}>
          {registration.priority ? (
            <Button
              size="xs"
              colorScheme="orange"
              leftIcon={<ArrowDownIcon />}
              onClick={() => updatePriority(false)}
              isLoading={isUpdatingPriority}
            >
              Deprioritize
            </Button>
          ) : (
            <Button
              size="xs"
              colorScheme="teal"
              leftIcon={<ArrowUpIcon />}
              onClick={() => updatePriority(true)}
              isLoading={isUpdatingPriority}
            >
              Prioritize
            </Button>
          )}
        </Show>
      </Wrap>
    </Fade>
  );
};

export default Registration;
