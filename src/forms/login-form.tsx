import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
import useToken from "../hooks/use-token";

const schema = z.object({
  email: z.string().email(),
});

type Values = z.infer<typeof schema>;

const LoginForm: FunctionComponent = () => {
  const client = useClient();
  const router = useRouter();
  const toast = useToast();
  const [, setToken] = useToken();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const submitHandler: SubmitHandler<Values> = async (data) => {
    try {
      const res = await client.post("/tokens", data);
      setToken(res.data);
      await router.push("/");
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
        <Button
          isLoading={isSubmitting}
          alignSelf="end"
          colorScheme="blue"
          type="submit"
        >
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
