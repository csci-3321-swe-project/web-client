import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useClient from "../hooks/use-client";
import useCourse from "../hooks/use-course";
import useOptions from "../hooks/use-options";
import { Course } from "../types";

const schema = z.object({
  name: z.string(),
  term: z.string(),
  department: z.string(),
  code: z.coerce.number(),
  description: z.string(),
});

type Values = z.infer<typeof schema>;

const EditCourseForm: FunctionComponent = () => {
  const router = useRouter();
  const courseId = router.query.courseId?.toString();
  const course = useCourse(courseId);
  const client = useClient();
  const toast = useToast();
  const options = useOptions();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => course.data, [course.data]),
  });

  const submitHandler: SubmitHandler<Values> = async (data) => {
    try {
      await client.put<Course>(`/courses/${courseId}`, data);
      await router.push(`/courses/${courseId}`);
      toast({ status: "success", title: "Course Updated" });
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
    reset(course.data);
  }, [course.data, reset]);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Stack>
        <FormControl
          isDisabled={options.isLoading || course.isLoading}
          isInvalid={errors.term !== undefined}
          isRequired
        >
          <FormLabel>Term</FormLabel>
          <Select placeholder="Select Term" {...register("term")}>
            {options.data?.terms.map(({ name, value }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.department?.message}</FormErrorMessage>
        </FormControl>
        <HStack>
          <FormControl
            isDisabled={options.isLoading || course.isLoading}
            isInvalid={errors.department !== undefined}
            isRequired
          >
            <FormLabel>Department</FormLabel>
            <Select placeholder="Select Department" {...register("department")}>
              {options.data?.departments.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.department?.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            isDisabled={course.isLoading}
            isInvalid={errors.code !== undefined}
            isRequired
          >
            <FormLabel>Code</FormLabel>
            <Input type="number" {...register("code")} />
            <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
        <FormControl
          isDisabled={course.isLoading}
          isInvalid={errors.name !== undefined}
          isRequired
        >
          <FormLabel>Name</FormLabel>
          <Input type="text" {...register("name")} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={course.isLoading}
          isInvalid={errors.description !== undefined}
          isRequired
        >
          <FormLabel>Description</FormLabel>
          <Textarea {...register("description")} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <Button
          isDisabled={course.isLoading}
          isLoading={isSubmitting}
          alignSelf="end"
          colorScheme="blue"
          type="submit"
        >
          Update Course
        </Button>
      </Stack>
    </form>
  );
};

export default EditCourseForm;
