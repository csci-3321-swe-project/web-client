import useSwr from "swr";
import useClient from "./use-client";

export interface Option {
  name: string;
  value: string;
}

export interface Response {
  roles: Option[];
  departments: Option[];
  daysOfWeek: Option[];
  terms: Option[];
}

/**
 * Fetches the options for the application.
 * @returns The options for the application.
 * @example const { data: options, error } = useOptions();
 */
const useOptions = () => {
  const client = useClient();

  return useSwr(
    "/options",
    async (path) => (await client.get<Response>(path)).data
  );
};

export default useOptions;
