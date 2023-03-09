import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import Case from "case";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import useCourse from "../../../hooks/use-course";

const CoursePage: NextPage = () => {
  const router = useRouter();
  const course = useCourse(router.query.courseId?.toString());

  return (
    <>
      <Container paddingY={10} maxWidth="container.lg">
        {course.isLoading || !course.data ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Stack spacing={5}>
            <NextLink href="/" legacyBehavior passHref>
              <Button
                as="a"
                alignSelf="start"
                variant="link"
                leftIcon={<ArrowBackIcon />}
              >
                Search Courses
              </Button>
            </NextLink>
            <Flex align="center">
              <Stack>
                <HStack>
                  <Badge>{Case.title(course.data.department)}</Badge>
                  <Badge>{course.data.code}</Badge>
                  <Badge>{Case.title(course.data.term)}</Badge>
                </HStack>
                <Heading>{`${course.data.name}`} </Heading>
              </Stack>
              <Spacer />
              <Button colorScheme="blue" leftIcon={<EditIcon />}>
                Edit
              </Button>
            </Flex>
          </Stack>
        )}
      </Container>
      <Container paddingY={10}>
        <Stack spacing={5}>
          <Heading fontSize="3xl">Description</Heading>
          <Text>{course.data?.description}</Text>
          <Heading fontSize="3xl">Sections</Heading>
          <Stack>
            <Box backgroundColor="gray.200" height={50} />
            <Box backgroundColor="gray.100" height={50} />
            <Box backgroundColor="gray.50" height={50} />
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default CoursePage;
