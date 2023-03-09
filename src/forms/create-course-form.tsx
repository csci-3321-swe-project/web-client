import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
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

const schema = z.object({
  name: z.string(),
  term: z.string(),
  department: z.string(),
  code: z.string().transform((v) => parseInt(v)),
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
            <NumberInput>
              <NumberInputField {...register("code")} />
            </NumberInput>
            <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
        <FormControl isInvalid={errors.name !== undefined} isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" {...register("name")} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description !== undefined} isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea {...register("description")} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <Button
          isLoading={isSubmitting}
          alignSelf="end"
          colorScheme="blue"
          type="submit"
        >
          Create Course
        </Button>
      </Stack>
    </form>
  );
};

export default CreateCourseForm;
