import { ArrowBackIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Card,
  CardBody,
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
import useCurrentCourse from "../../../hooks/use-current-course";

const CoursePage: NextPage = () => {
  const course = useCurrentCourse();

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
              <NextLink
                href={`/courses/${course.data.id}/edit`}
                passHref
                legacyBehavior
              >
                <Button as="a" colorScheme="blue" leftIcon={<EditIcon />}>
                  Edit
                </Button>
              </NextLink>
            </Flex>
          </Stack>
        )}
      </Container>
      <Container paddingY={10}>
        {course.isLoading || !course.data ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Stack spacing={5}>
            <Heading fontSize="3xl">Description</Heading>
            <Text>{course.data.description}</Text>
            <Heading fontSize="3xl">Sections</Heading>
            {course.data.courseSections.length ? (
              <Stack spacing={5}>
                {course.data.courseSections.map(({ id }) => (
                  <Text key={id}>{id}</Text>
                ))}
                <Center>
                  <NextLink
                    href={`/courses/${course.data.id}/sections/create`}
                    passHref
                    legacyBehavior
                  >
                    <Button
                      variant="outline"
                      as="a"
                      leftIcon={<PlusSquareIcon />}
                    >
                      Create
                    </Button>
                  </NextLink>
                </Center>
              </Stack>
            ) : (
              <Card paddingY={10} variant="outline">
                <CardBody>
                  <Stack align="center" spacing={5}>
                    <Text variant="secondary">
                      There are no sections for this course.
                    </Text>
                    <NextLink
                      href={`/courses/${course.data.id}/sections/create`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="outline"
                        as="a"
                        leftIcon={<PlusSquareIcon />}
                      >
                        Create
                      </Button>
                    </NextLink>
                  </Stack>
                </CardBody>
              </Card>
            )}
          </Stack>
        )}
      </Container>
    </>
  );
};

export default CoursePage;
