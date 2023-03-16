import { ArrowForwardIcon } from "@chakra-ui/icons";
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
import useCurrentCourse from "../hooks/use-current-course";
import useOptions from "../hooks/use-options";
import { Course } from "../types";
import { placeholders } from "../utilities/constants";

const schema = z.object({
  name: z.string(),
  term: z.string(),
  department: z.string(),
  code: z.coerce.number(),
  description: z.string(),
});

type Values = z.infer<typeof schema>;

const EditCourseForm: FunctionComponent = () => {
  const course = useCurrentCourse();
  const router = useRouter();
  const client = useClient();
  const toast = useToast();
  const options = useOptions();
  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => course.data, [course.data]),
  });

  const submitHandler: SubmitHandler<Values> = async (data) => {
    if (!course.data) {
      return;
    }

    try {
      await client.put<Course>(`/courses/${course.data.id}`, data);
      await router.push(`/courses/${course.data.id}`);
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
      <Stack spacing={5}>
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
            <Input
              placeholder={placeholders.code}
              type="number"
              {...register("code")}
            />
            <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
        <FormControl
          isDisabled={course.isLoading}
          isInvalid={errors.name !== undefined}
          isRequired
        >
          <FormLabel>Name</FormLabel>
          <Input
            placeholder={placeholders.courseName}
            type="text"
            {...register("name")}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={course.isLoading}
          isInvalid={errors.description !== undefined}
          isRequired
        >
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder={placeholders.description}
            {...register("description")}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <Button
          isDisabled={course.isLoading}
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
  );
};

export default EditCourseForm;
