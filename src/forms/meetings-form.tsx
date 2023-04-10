import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Center,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import Case from "case";
import { FunctionComponent } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { DayOfWeek, Meeting } from "../types";

export type MeetingFields = Omit<Meeting, "id">;

export interface MeetingsFormProps {
  fieldName: string;
}

const MeetingsForm: FunctionComponent<MeetingsFormProps> = ({ fieldName }) => {
  interface Values {
    [fieldName: string]: MeetingFields[];
  }

  const {
    formState: { errors },
    control,
    register,
    setValue,
  } = useFormContext<Values>();
  const meetings = useFieldArray({ name: "meetings", control });
  const defaultMeeting: MeetingFields = {
    daysOfWeek: [],
    endTime: "",
    startTime: "",
    location: "",
  };

  return (
    <>
      {errors.meetings !== undefined && !Array.isArray(errors.meetings) && (
        <Alert status="error">{errors.meetings.message}</Alert>
      )}
      {meetings.fields.map((meeting, i) => (
        <Card key={meeting.id} variant="outline">
          <CardBody>
            <Stack spacing={5}>
              <Button
                leftIcon={<DeleteIcon />}
                alignSelf="end"
                variant="outline"
                colorScheme="red"
                onClick={() => meetings.remove(i)}
                size="sm"
              >
                Delete
              </Button>
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input type="text" {...register(`meetings.${i}.location`)} />
                <FormErrorMessage>
                  {errors.meetings?.[i]?.location?.message}
                </FormErrorMessage>
              </FormControl>
              <Stack direction={["column", "row"]}>
                <FormControl isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input type="time" {...register(`meetings.${i}.startTime`)} />
                  <FormErrorMessage>
                    {errors.meetings?.[i]?.startTime?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input type="time" {...register(`meetings.${i}.endTime`)} />
                  <FormErrorMessage>
                    {errors.meetings?.[i]?.endTime?.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
              {errors.meetings?.[i]?.daysOfWeek && (
                <Alert status="error">
                  {errors.meetings?.[i]?.daysOfWeek?.message}
                </Alert>
              )}
              <Wrap justify="center" spacing={5}>
                {Object.keys(DayOfWeek).map((day) => (
                  <Controller
                    control={control}
                    name={`meetings.${i}.daysOfWeek`}
                    key={day}
                    render={({ field: { onChange, value, ref } }) => {
                      return (
                        <Checkbox
                          key={day}
                          isChecked={value.some((v) => v === day)}
                          ref={ref}
                          onChange={(e) => {
                            setValue(
                              `meetings.${i}.daysOfWeek`,
                              e.target.checked
                                ? [day as DayOfWeek, ...value]
                                : value.filter((v) => v !== day)
                            );
                          }}
                        >
                          {Case.title(day).substring(0, 3)}
                        </Checkbox>
                      );
                    }}
                  />
                ))}
              </Wrap>
            </Stack>
          </CardBody>
        </Card>
      ))}
      {meetings.fields.length ? (
        <Center>
          <Button
            variant="outline"
            onClick={() => meetings.append(defaultMeeting)}
            leftIcon={<AddIcon />}
            size="sm"
            colorScheme="teal"
          >
            Add
          </Button>
        </Center>
      ) : (
        <Card paddingY={10} variant="outline">
          <CardBody>
            <Stack align="center" spacing={5}>
              <Text variant="secondary">
                There are no meetings for this section.
              </Text>
              <Button
                onClick={() => meetings.append(defaultMeeting)}
                variant="outline"
                leftIcon={<AddIcon />}
                colorScheme="teal"
              >
                Add
              </Button>
            </Stack>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default MeetingsForm;
