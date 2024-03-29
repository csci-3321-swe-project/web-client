import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Case from "case";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";
import useClient from "../hooks/use-client";
import useOptions from "../hooks/use-options";
import useTerms from "../hooks/use-terms";
import { Course } from "../types";
import { placeholders } from "../utilities/constants";

const schema = z.object({
  name: z.string(),
  termId: z.string(),
  department: z.string(),
  code: z.coerce.number(),
  description: z.string(),
});

type Values = z.infer<typeof schema>;

const CreateCourseForm: FunctionComponent = () => {
  const client = useClient();
  const terms = useTerms();
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
      await mutate(`/courses/${newCourse.data.id}`, newCourse);
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

  if (options.isLoading || !options.data || terms.isLoading || !terms.data) {
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
    <form onSubmit={handleSubmit(submitHandler)}>
      <Stack spacing={5}>
        <FormControl isInvalid={errors.termId !== undefined} isRequired>
          <FormLabel>Term</FormLabel>
          <Select
            placeholder="Select Term"
            disabled={options.isLoading}
            {...register("termId")}
          >
            {terms.data.map(({ id, season, year }) => (
              <option key={id} value={id}>
                {`${Case.title(season)} ${year}`}
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
              {options.data.departments.map(({ name, value }) => (
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
