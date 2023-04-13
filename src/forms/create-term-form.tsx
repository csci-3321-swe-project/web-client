import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";
import useClient from "../hooks/use-client";
import useOptions from "../hooks/use-options";
import { Season, Term } from "../types";
import { placeholders } from "../utilities/constants";

const schema = z.object({
  season: z.nativeEnum(Season),
  year: z.coerce.number(),
  startTime: z.string(),
  endTime: z.string(),
});

type Values = z.infer<typeof schema>;

const CreateTermForm: FunctionComponent = () => {
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
      const newTerm = await client.post<Term>("/terms", data);
      await mutate(`/terms/${newTerm.data.id}`, newTerm);
      await router.push("/terms");
      toast({ status: "success", title: "Term Created" });
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

  if (options.isLoading || !options.data) {
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
        <Stack spacing={5} direction={["column", "row"]}>
          <FormControl isInvalid={errors.season !== undefined} isRequired>
            <FormLabel>Season</FormLabel>
            <Select
              placeholder="Select Season"
              disabled={options.isLoading}
              {...register("season")}
            >
              {options.data.seasons.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.season?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.year !== undefined} isRequired>
            <FormLabel>Year</FormLabel>
            <Input
              placeholder={placeholders.code}
              type="number"
              {...register("year")}
            />
            <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
        <Stack spacing={5} direction={["column", "row"]}>
          <FormControl isInvalid={errors.startTime !== undefined} isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input type="date" {...register("startTime")} />
            <FormErrorMessage>{errors.season?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.endTime !== undefined} isRequired>
            <FormLabel>End Time</FormLabel>
            <Input type="date" {...register("endTime")} />
            <FormErrorMessage>{errors.endTime?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
        <Button
          isLoading={isSubmitting}
          alignSelf="end"
          colorScheme="teal"
          type="submit"
          rightIcon={<ArrowForwardIcon />}
        >
          Create Term
        </Button>
      </Stack>
    </form>
  );
};

export default CreateTermForm;
