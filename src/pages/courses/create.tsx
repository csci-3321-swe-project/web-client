import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import CreateCourseForm from "../../forms/create-course-form";

const CreateCoursePage: NextPage = () => {
  return (
    <Container marginTop={10}>
      <Card>
        <CardHeader>
          <Heading>Create Course</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={5}>
            <Text>
              Create a course below. Course sections can be created afterwards.
            </Text>
            <Divider />
            <CreateCourseForm />
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CreateCoursePage;
