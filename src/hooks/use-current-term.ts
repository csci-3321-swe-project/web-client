import useSwr from "swr";
import { Term } from "../types";
import useClient from "./use-client";

const useCurrentTerm = () => {
  const client = useClient();

  return useSwr(
    "/terms/current",
    async (path) => (await client.get<Term>(path)).data
  );
};

export default useCurrentTerm;
