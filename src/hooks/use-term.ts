import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import useSwr, { mutate } from "swr";
import { Term } from "../types";
import useAuth from "./use-auth";
import useClient from "./use-client";

const useTerm = (termId?: string) => {
  const client = useClient();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [isRemoving, setIsRemoving] = useState(false);

  const remove = async () => {
    try {
      setIsRemoving(true);
      await client.delete(`/terms/${termId}`);
      await mutate(`/terms/${termId}`, null);
      await mutate("/terms");

      toast({ status: "success", title: "Course Section Deleted" });
    } catch (err) {
      toast({ status: "error", title: "Error Deleting Course Section" });
    } finally {
      setIsRemoving(false);
    }
  };

  const term = useSwr<Term, AxiosError>(
    isAuthenticated && termId ? `/terms/${termId}` : null,
    async (path) => (await client.get<Term>(path)).data
  );

  return {
    isRemoving,
    remove,
    ...term,
  };
};

export default useTerm;
