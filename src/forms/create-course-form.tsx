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
import { FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useClient from "../hooks/use-client";
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

const CreateCourseForm: FunctionComponent = () => {
  const client = useClient();
  const router = useRouter();
  const toast = useToast();
  const options = useOptions();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

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
      <Stack spacing={5}>
        <FormControl isInvalid={errors.term !== undefined} isRequired>
          <FormLabel>Term</FormLabel>
          <Select
            placeholder="Select Term"
            disabled={options.isLoading}
            {...register("term")}
          >
            {options.data?.terms.map(({ name, value }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.department?.message}</FormErrorMessage>
        </FormControl>
        <HStack>
          <FormControl isInvalid={errors.department !== undefined} isRequired>
            <FormLabel>Department</FormLabel>
            <Select
              placeholder="Select Department"
              disabled={options.isLoading}
              {...register("department")}
            >
              {options.data?.departments.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.department?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.code !== undefined} isRequired>
            <FormLabel>Code</FormLabel>
            <Input
              placeholder={placeholders.code}
              type="number"
              {...register("code")}
            />
            <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
        <FormControl isInvalid={errors.name !== undefined} isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder={placeholders.courseName}
            type="text"
            {...register("name")}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description !== undefined} isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder={placeholders.description}
            {...register("description")}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <Button
          isLoading={isSubmitting}
          alignSelf="end"
          colorScheme="teal"
          type="submit"
          rightIcon={<ArrowForwardIcon />}
        >
          Create Course
        </Button>
      </Stack>
    </form>
  );
};

export default CreateCourseForm;
