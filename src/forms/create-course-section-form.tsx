import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Center,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Case from "case";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import useClient from "../hooks/use-client";
import useCurrentCourse from "../hooks/use-current-course";
import { CourseSection, DayOfWeek, User } from "../types";
import PeoplePickerForm from "./people-picker-form";

const schema = z.object({
  instructorIds: z.array(z.string()).min(1),
  meetings: z
    .array(
      z.object({
        daysOfWeek: z.array(z.nativeEnum(DayOfWeek)).min(1),
        startTime: z.string(),
        endTime: z.string(),
        location: z.string(),
      })
    )
    .min(1),
});

type Values = z.infer<typeof schema>;

const CreateCourseSectionForm: FunctionComponent = () => {
  const course = useCurrentCourse();
  const client = useClient();
  const router = useRouter();
  const toast = useToast();
  const [instructorUsers, setInstructorUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  const meetings = useFieldArray({ name: "meetings", control });
  const defaultMeeting = {
    daysOfWeek: [],
    endTime: "",
    startTime: "",
    location: "",
  };

  const submitHandler: SubmitHandler<Values> = async (data) => {
    try {
      await client.post<CourseSection>(
        `/courses/${course.data?.id}/sections`,
        data
      );
      await router.push(`/courses/${course.data?.id}`);
      toast({ status: "success", title: "Course Section Created" });
    } catch (e) {
      if (e instanceof AxiosError) {
        toast({
          status: "error",
          title: "Submission Error",
          description: e.message,
        });
      } else {
        throw e;
      }
    }
  };

  useEffect(() => {
    const newInstructorIds = instructorUsers.map((x) => x.id);

    if (!newInstructorIds.length) {
      return;
    }

    setValue("instructorIds", newInstructorIds);
  }, [instructorUsers, setValue]);

  return (
    <Stack spacing={5}>
      <Stack spacing={5}>
        <Heading fontSize="2xl">Instructors</Heading>
        {errors.instructorIds !== undefined &&
          !Array.isArray(errors.instructorIds) && (
            <Alert status="error">{errors.instructorIds.message}</Alert>
          )}
        <PeoplePickerForm
          min={1}
          users={instructorUsers}
          setUsers={setInstructorUsers}
        />
      </Stack>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack spacing={5}>
          <Heading fontSize="2xl">Meetings</Heading>
          {errors.meetings !== undefined && !Array.isArray(errors.meetings) && (
            <Alert status="error">{errors.meetings.message}</Alert>
          )}
          {meetings.fields.map((meeting, i) => (
            <Card key={meeting.id} variant="outline">
              <CardBody>
                <Stack spacing={5}>
                  <IconButton
                    alignSelf="end"
                    variant="outline"
                    aria-label="delete"
                    onClick={() => meetings.remove(i)}
                    icon={<DeleteIcon />}
                  />
                  <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input
                      type="text"
                      {...register(`meetings.${i}.location`)}
                    />
                    <FormErrorMessage>
                      {errors.meetings?.[i]?.location?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Stack direction={["column", "row"]}>
                    <FormControl isRequired>
                      <FormLabel>Start Time</FormLabel>
                      <Input
                        type="time"
                        {...register(`meetings.${i}.startTime`)}
                      />
                      <FormErrorMessage>
                        {errors.meetings?.[i]?.startTime?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>End Time</FormLabel>
                      <Input
                        type="time"
                        {...register(`meetings.${i}.endTime`)}
                      />
                      <FormErrorMessage>
                        {errors.meetings?.[i]?.endTime?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Wrap justify="center" spacing={5}>
                    {Object.keys(DayOfWeek).map((day) => (
                      <Controller
                        control={control}
                        name={`meetings.${i}.daysOfWeek`}
                        key={day}
                        render={({ field: { onChange, value, ref } }) => {
                          return (
                            <Checkbox
                              key={day}
                              value={value.some((v) => v === day).toString()}
                              ref={ref}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setValue(`meetings.${i}.daysOfWeek`, [
                                    day as DayOfWeek,
                                    ...value,
                                  ]);
                                }
                              }}
                            >
                              {Case.title(day).substring(0, 3)}
                            </Checkbox>
                          );
                        }}
                      />
                    ))}
                  </Wrap>
                </Stack>
              </CardBody>
            </Card>
          ))}
          {meetings.fields.length ? (
            <Center>
              <IconButton
                variant="outline"
                aria-label="add-meeting"
                onClick={() => meetings.append(defaultMeeting)}
                icon={<PlusSquareIcon />}
              />
            </Center>
          ) : (
            <Card paddingY={10} variant="outline">
              <CardBody>
                <Stack align="center" spacing={5}>
                  <Text variant="secondary">
                    There are no sections for this course.
                  </Text>
                  <Button
                    onClick={() => meetings.append(defaultMeeting)}
                    variant="outline"
                    leftIcon={<PlusSquareIcon />}
                  >
                    Create
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          )}

          <Button
            isLoading={isSubmitting}
            alignSelf="end"
            colorScheme="blue"
            type="submit"
          >
            Create
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default CreateCourseSectionForm;
