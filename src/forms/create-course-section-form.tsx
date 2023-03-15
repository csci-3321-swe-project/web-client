import { Button, Stack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useClient from "../hooks/use-client";
import { Course, DayOfWeek } from "../types";

const schema = z.object({
  instructorIds: z.array(z.string()),
  meetings: z.array(
    z.object({
      daysOfWeek: z.nativeEnum(DayOfWeek),
      startHour: z.coerce.number(),
      startMinute: z.coerce.number(),
      endHour: z.coerce.number(),
      endMinute: z.coerce.number(),
      location: z.string(),
    })
  ),
});

type Values = z.infer<typeof schema>;

const CreateCourseForm: FunctionComponent = () => {
  const client = useClient();
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  console.log(errors);

  const submitHandler: SubmitHandler<Values> = async (data) => {
    try {
      const newCourse = await client.post<Course>("/courses", data);
      await router.push(`/courses/${newCourse.data.id}`);
      toast({ status: "success", title: "Course Created" });
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

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Stack>
        <Button
          isLoading={isSubmitting}
          alignSelf="end"
          colorScheme="blue"
          type="submit"
        >
          Create Course Section
        </Button>
      </Stack>
    </form>
  );
};

export default CreateCourseForm;
