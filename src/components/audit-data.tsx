import { QuestionIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

export interface AuditDataProps {
  data: object;
}

const AuditData: FunctionComponent<AuditDataProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <IconButton
        colorScheme="gray"
        variant="outline"
        alignSelf="start"
        icon={<QuestionIcon />}
        size="sm"
        onClick={() => toggle()}
        aria-label="Audit Details"
      />
      <Modal isOpen={isOpen} onClose={() => toggle()}>
        <ModalOverlay />
        <ModalContent width="max-content" maxWidth="container.lg">
          <ModalHeader>Audit Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <JSONPretty data={data} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuditData;
