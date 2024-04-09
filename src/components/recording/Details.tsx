import { Modal, ModalProps, Image, Text, Accordion } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

interface CustomModalProps extends Omit<ModalProps, "opened" | "onClose"> {
  opened: boolean;
  onClose: () => void;
  path: string;
  recordingData: RecordingStats;
}

export default function Details({
  title,
  opened,
  onClose,
  path,
  recordingData,
  ...rest
}: CustomModalProps) {
  const [parselStats, setParselStats] = useState<string>("");

  useEffect(() => {
    console.log("path", path);
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
    <Modal {...rest} opened={opened} onClose={onClose} title={title} size="70%">
      <Accordion>
        <Accordion.Item id="overview" value="Overview">
          <Accordion.Control>Überblick</Accordion.Control>
          <Accordion.Panel>
            <Text>
              <strong>Speicherort:</strong> {path}
            </Text>
            <Text>
              <strong>Zeitstempel:</strong> {title}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="praat-objects" value="PRAAT-Objects">
          <Accordion.Control>PRAAT-Objects</Accordion.Control>
          <Accordion.Panel>
            <Text style={{ whiteSpace: "pre-wrap" }}>{parselStats}</Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="spectrogram" value="Spectrogram">
          <Accordion.Control>Spectrogram</Accordion.Control>
          <Accordion.Panel>
            <Image src={`${path}\\spectrogram_intensity.png`} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="waveform" value="Waveform">
          <Accordion.Control>Waveform</Accordion.Control>
          <Accordion.Panel>
            <Image src={`${path}\\waveform.png`} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
}
