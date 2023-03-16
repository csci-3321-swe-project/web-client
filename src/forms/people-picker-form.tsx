import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useClient from "../hooks/use-client";
import { User } from "../types";
import { placeholders } from "../utilities/constants";

const schema = z.object({
  emailAddress: z.string().email(),
});

type Values = z.infer<typeof schema>;

export interface PeoplePickerFormProps {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  min: number;
}

const PeoplePickerForm: FunctionComponent<PeoplePickerFormProps> = ({
  users,
  setUsers,
  min,
}) => {
  const client = useClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const submitHandler: SubmitHandler<Values> = async (data) => {
    try {
      const res = await client.get<User[]>(`/users?email=${data.emailAddress}`);

      // Ensure user exists
      if (!res.data.length) {
        toast({ status: "error", title: "User Not Found" });
        return;
      }

      const user = res.data[0];

      // Ensure user is not already included
      if (users.some((x) => x.id === user.id)) {
        toast({ status: "warning", title: "User already included" });
        return;
      }

      setUsers((prevUsers) => [...prevUsers, res.data[0]]);
      reset();
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

  const removeUser = (id: string) => {
    if (users.length - 1 < min) {
      toast({ status: "error", title: "Cannot Remove" });
      return;
    }

    setUsers((prevUsers) => prevUsers.filter((x) => x.id !== id));
  };

  return (
    <Stack>
      <Stack spacing={5}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <FormControl isInvalid={errors.emailAddress !== undefined} isRequired>
            <FormLabel>Email Address</FormLabel>
            <HStack>
              <Input
                placeholder={placeholders.emailAddress}
                {...register("emailAddress")}
                type="email"
              />
              <Button
                variant="outline"
                isLoading={isSubmitting}
                leftIcon={<AddIcon />}
                colorScheme="teal"
                type="submit"
              >
                Add
              </Button>
            </HStack>
            <FormErrorMessage>{errors.emailAddress?.message}</FormErrorMessage>
          </FormControl>
        </form>
        <HStack spacing={4}>
          {users.map(({ id, firstName, lastName }) => (
            <Tag key={id}>
              <TagLabel>{`${firstName} ${lastName}`}</TagLabel>
              <TagCloseButton onClick={() => removeUser(id)} />
            </Tag>
          ))}
        </HStack>
      </Stack>
    </Stack>
  );
};

export default PeoplePickerForm;
