import { ArrowForwardIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  LinkBox,
  LinkOverlay,
  Select,
  Spacer,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Case from "case";
import Link from "next/link";
import { FunctionComponent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import useClient from "../hooks/use-client";
import useOptions from "../hooks/use-options";
import useTerms from "../hooks/use-terms";
import { Course } from "../types";

const schema = z.object({
  search: z.string(),
  termId: z.string().optional(),
  department: z.string().optional(),
});

type Values = z.infer<typeof schema>;

const SearchForm: FunctionComponent = () => {
  const [courses, setCourses] = useState<Course[] | undefined>(undefined);
  const options = useOptions();
  const client = useClient();
  const toast = useToast();
  const terms = useTerms();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const submitHandler: SubmitHandler<Values> = async (data) => {
    try {
      const searchParams = new URLSearchParams();
      data.search.split(" ").forEach((word) => searchParams.append("q", word));
      if (data.termId) searchParams.set("termId", data.termId);
      if (data.department) searchParams.set("dept", data.department);

      const res = await client.get<Course[]>(
        `/courses?${searchParams.toString()}`
      );

      setCourses(res.data);
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
    <Stack spacing={5}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Card>
          <CardBody>
            <Stack spacing={5}>
              <Stack direction={["column", "row"]} spacing={5}>
                <FormControl isInvalid={errors.search !== undefined} isRequired>
                  <FormLabel>Search</FormLabel>
                  <Input {...register("search")} />
                  <FormErrorMessage>{errors.search?.message}</FormErrorMessage>
                </FormControl>
                <Button
                  isLoading={isSubmitting}
                  alignSelf="end"
                  colorScheme="teal"
                  type="submit"
                  rightIcon={<SearchIcon />}
                >
                  Search
                </Button>
              </Stack>

              <Stack direction={["column", "row"]}>
                <FormControl
                  isDisabled={options.isLoading}
                  isInvalid={errors.termId !== undefined}
                >
                  <FormLabel>Term</FormLabel>
                  <Select
                    size="sm"
                    placeholder="Select Term"
                    {...register("termId")}
                  >
                    {terms.data.map(({ id, season, year }) => (
                      <option key={id} value={id}>
                        {`${Case.title(season)} ${year}`}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.department?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isDisabled={options.isLoading}
                  isInvalid={errors.department !== undefined}
                >
                  <FormLabel>Department</FormLabel>
                  <Select
                    size="sm"
                    placeholder="Select Department"
                    {...register("department")}
                  >
                    {options.data.departments.map(({ name, value }) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.department?.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </form>
      {courses === undefined ? null : courses.length ? (
        <Stack spacing={5}>
          {courses.map((course) => (
            <LinkBox key={course.id}>
              <Card>
                <CardBody>
                  <Flex align="center">
                    <Text>
                      <Link
                        href={`/courses/${course.id}`}
                        passHref
                        legacyBehavior
                      >
                        <LinkOverlay>{course.name}</LinkOverlay>
                      </Link>
                    </Text>
                    <Spacer />
                    <ArrowForwardIcon />
                  </Flex>
                </CardBody>
              </Card>
            </LinkBox>
          ))}
        </Stack>
      ) : (
        <Center paddingY={10}>
          <Text variant="secondary">No courses found.</Text>
        </Center>
      )}
    </Stack>
  );
};

export default SearchForm;
