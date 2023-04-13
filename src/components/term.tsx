import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Flex,
  Skeleton,
  Spacer,
  Tag,
  Text,
} from "@chakra-ui/react";
import Case from "case";
import NextLink from "next/link";
import { FunctionComponent } from "react";
import useTerm from "../hooks/use-term";

export interface TermProps {
  id: string;
  isCurrent: boolean;
}

const Term: FunctionComponent<TermProps> = ({ isCurrent, id }) => {
  const term = useTerm(id);

  if (term.isLoading || !term.data) {
    return <Skeleton height={10} />;
  }

  return (
    <Card>
      <CardBody>
        <Flex gap={5} align="center">
          <Text fontWeight="bold">{`${Case.title(term.data.season)} ${
            term.data.year
          }`}</Text>
          {isCurrent ? <Tag colorScheme="green">Current</Tag> : null}
          <Spacer />
          <NextLink
            href={`/terms/${term.data.id}/edit`}
            passHref
            legacyBehavior
          >
            <Button size="sm" leftIcon={<EditIcon />} as="a" colorScheme="teal">
              Edit
            </Button>
          </NextLink>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            isLoading={term.isRemoving}
            onClick={() => term.remove()}
            size="sm"
          >
            Delete
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Term;
