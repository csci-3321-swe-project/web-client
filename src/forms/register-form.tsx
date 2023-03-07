import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import useClient from "../hooks/use-client";
import useOptions from "../hooks/use-options";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
});

type Values = z.infer<typeof schema>;

const RegisterForm: FunctionComponent = () => {
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
      const res = await client.post("/users", data);
      toast({ status: "success", title: "User Created" });
      await router.push("/login");
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
        <FormControl isInvalid={errors.email !== undefined} isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" {...register("email")} />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <HStack>
          <FormControl isInvalid={errors.firstName !== undefined} isRequired>
            <FormLabel>First Name</FormLabel>
            <Input type="text" {...register("firstName")} />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.lastName !== undefined} isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" {...register("lastName")} />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
        <FormControl isInvalid={errors.role !== undefined} isRequired>
          <FormLabel>Role</FormLabel>
          <Select disabled={options.isLoading} {...register("role")}>
            {options.data?.roles.map(({ name, value }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
        </FormControl>
        <Button
          isLoading={isSubmitting}
          alignSelf="end"
          colorScheme="blue"
          type="submit"
        >
          Register
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterForm;
