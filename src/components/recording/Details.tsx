import { Modal, ModalProps, Image } from "@mantine/core";
import { useEffect } from "react";

interface CustomModalProps extends Omit<ModalProps, "opened" | "onClose"> {
  opened: boolean;
  onClose: () => void;
  imagesPath: string;
}

export default function Details({
  title,
  opened,
  onClose,
  imagesPath,
  ...rest
}: CustomModalProps) {
  useEffect(() => {
    console.log("Details component mounted");
  }, []);

  return (
    <Modal
      {...rest}
      opened={opened}
      onClose={onClose}
      title={title}
      size="auto"
    >
      <Image src={`${imagesPath}\\waveform.png`} />
      <Image src={`${imagesPath}\\spectrogram_intensity.png`} />
    </Modal>
  );
}
