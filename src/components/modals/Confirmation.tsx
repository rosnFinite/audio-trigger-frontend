import {
  Alert,
  Button,
  ButtonVariant,
  Group,
  MantineColor,
  MantineSize,
  Modal,
} from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";

interface ConfirmationModalProps {
  size?: MantineSize | (string & {}) | number;
  title: string;
  descriptionTitle: string;
  descriptionText: string;
  opened: boolean;
  onAbort: () => void;
  onConfirm: () => void;
  confirmBtnText?: string;
  abortBtnText?: string;
  confirmBtnPosition?: "left" | "right";
  confirmBtnColor?: MantineColor;
  abortBtnColor?: MantineColor;
  btnVariant?: ButtonVariant;
}

export default function Confirmation({
  size = "md",
  confirmBtnText = "Bestätigen",
  abortBtnText = "Abbrechen",
  confirmBtnPosition = "left",
  confirmBtnColor = "green",
  abortBtnColor = "red",
  btnVariant = "filled",
  ...props
}: ConfirmationModalProps) {
  return (
    <Modal
      size={size}
      opened={props.opened}
      onClose={props.onAbort}
      centered
      title={props.title}
    >
      <Alert
        variant="light"
        color="red"
        title={props.descriptionTitle}
        icon={<TbInfoCircle size={25} />}
      >
        {props.descriptionText}
      </Alert>
      <Group mt={15} grow>
        {confirmBtnPosition === "left" ? (
          <>
            <Button
              variant={btnVariant}
              color={confirmBtnColor}
              onClick={props.onConfirm}
            >
              {confirmBtnText}
            </Button>
            <Button
              variant={btnVariant}
              color={abortBtnColor}
              onClick={props.onAbort}
            >
              {abortBtnText}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={btnVariant}
              color={abortBtnColor}
              onClick={props.onAbort}
            >
              {abortBtnText}
            </Button>
            <Button
              variant={btnVariant}
              color={confirmBtnColor}
              onClick={props.onConfirm}
            >
              {confirmBtnText}
            </Button>
          </>
        )}
      </Group>
    </Modal>
  );
}
