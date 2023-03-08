import { FunctionComponent, PropsWithChildren } from "react";
import useAccount from "../hooks/use-account";
import { Role } from "../types";

export interface ShowProps extends PropsWithChildren {
  roles: Role[];
}

const Show: FunctionComponent<ShowProps> = ({ roles, children }) => {
  const account = useAccount();
  const hasRole = account.data && roles.includes(account.data.role);

  if (account.isLoading || !hasRole) {
    return null;
  }

  return <>{children}</>;
};

export default Show;
