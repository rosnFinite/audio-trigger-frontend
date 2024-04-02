import { Modal, ModalProps, Image, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

interface CustomModalProps extends Omit<ModalProps, "opened" | "onClose"> {
  opened: boolean;
  onClose: () => void;
  path: string;
}

export default function Details({
  title,
  opened,
  onClose,
  path,
  ...rest
}: CustomModalProps) {
  const [parselStats, setParselStats] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${path}\\parsel`)
      .then((res) => {
        setParselStats(res.data.text_content);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Modal
      {...rest}
      opened={opened}
      onClose={onClose}
      title={title}
      size="auto"
    >
      <Text style={{ whiteSpace: "pre-wrap" }}>{parselStats}</Text>
      <Image src={`${path}\\waveform.png`} />
      <Image src={`${path}\\spectrogram_intensity.png`} />
    </Modal>
  );
}
