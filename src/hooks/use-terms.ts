import useSwr from "swr";
import { Term } from "../types";
import useClient from "./use-client";

const useTerms = () => {
  const client = useClient();

  return useSwr(
    "/terms",
    async (path) => (await client.get<Term[]>(path)).data
  );
};

export default useTerms;
