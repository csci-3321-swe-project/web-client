import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Alert,
  Button,
  Center,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useClient from "../hooks/use-client";
import useCurrentCourse from "../hooks/use-current-course";
import useCurrentCourseSection from "../hooks/use-current-course-section";
import { CourseSection, DayOfWeek, User } from "../types";
import MeetingsForm from "./meetings-form";
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

const EditCourseSectionForm: FunctionComponent = () => {
  const course = useCurrentCourse();
  const courseSection = useCurrentCourseSection();
  const client = useClient();
  const router = useRouter();
  const toast = useToast();
  const [instructorUsers, setInstructorUsers] = useState<User[]>([]);
  const methods = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => courseSection.data, [courseSection.data]),
  });
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const submitHandler: SubmitHandler<Values> = async (data) => {
    if (!course.data || !courseSection.data) {
      return;
    }

    try {
      const updatedCourseSection = await client.put<CourseSection>(
        `/courses/${course.data.id}/sections/${courseSection.data.id}`,
        data
      );
      await course.mutate({
        ...course.data,
        courseSections: [
          ...course.data.courseSections.filter(
            (cs) => cs.id !== updatedCourseSection.data.id
          ),
          updatedCourseSection.data,
        ],
      });
      await router.push(`/courses/${course.data?.id}`);
      toast({ status: "success", title: "Course Section Updated" });
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

  useEffect(() => {
    if (!courseSection.data) {
      return;
    }

    reset(courseSection.data);
    setInstructorUsers(courseSection.data.instructors);
  }, [courseSection.data, reset]);

  if (
    course.isLoading ||
    !course.data ||
    courseSection.isLoading ||
    !courseSection.data
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
    <FormProvider {...methods}>
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
            <MeetingsForm fieldName="meetings" />
            <Button
              isLoading={isSubmitting}
              alignSelf="end"
              colorScheme="teal"
              type="submit"
              rightIcon={<ArrowForwardIcon />}
            >
              Update
            </Button>
          </Stack>
        </form>
      </Stack>
    </FormProvider>
  );
};

export default EditCourseSectionForm;
