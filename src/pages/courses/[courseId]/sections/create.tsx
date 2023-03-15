import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import useCurrentCourse from "../../../../hooks/use-current-course";

const CreateCourseSectionPage: NextPage = () => {
  const course = useCurrentCourse();

  return (
    <Container marginTop={10}>
      <Card>
        <CardHeader>
          <Stack spacing={5}>
            <NextLink
              href={`/courses/${course.data?.id}`}
              legacyBehavior
              passHref
            >
              <Button
                as="a"
                alignSelf="start"
                variant="link"
                leftIcon={<ArrowBackIcon />}
              >
                Course Details
              </Button>
            </NextLink>
            <Heading>Create Course Section</Heading>
          </Stack>
        </CardHeader>
        <CardBody>{/* Insert course section form here */}</CardBody>
      </Card>
    </Container>
  );
};

export default CreateCourseSectionPage;
