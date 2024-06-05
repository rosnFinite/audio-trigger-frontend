import { Modal, ModalProps, Image, Text, Accordion } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

interface CustomModalProps extends Omit<ModalProps, "opened" | "onClose"> {
  opened: boolean;
  onClose: () => void;
  api_endpoint: string;
  recordingData: RecordingStats;
}

export default function Details({
  title,
  opened,
  onClose,
  api_endpoint,
  recordingData,
  ...rest
}: CustomModalProps) {
  const [parselStats, setParselStats] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${api_endpoint}\\parsel`)
      .then((res) => {
        setParselStats(res.data.text_content);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Modal {...rest} opened={opened} onClose={onClose} title={title} size="90%">
      <Accordion variant="separated">
        <Accordion.Item id="overview" value="Overview">
          <Accordion.Control>Überblick</Accordion.Control>
          <Accordion.Panel>
            <Text>
              <strong>MeanF:</strong> {recordingData.meanF?.toFixed(9)}
            </Text>
            <Text>
              <strong>StdevF:</strong> {recordingData.stdevF?.toFixed(9)}
            </Text>
            <Text>
              <strong>HNR:</strong> {recordingData.hnr?.toFixed(9)}
            </Text>
            <Text>
              <strong>local Jitter:</strong>{" "}
              {recordingData.localJitter?.toFixed(9)}
            </Text>
            <Text>
              <strong>local Absolute Jitter:</strong>{" "}
              {recordingData.localAbsoluteJitter?.toFixed(9)}
            </Text>
            <Text>
              <strong>Relative Average Perturbation:</strong>{" "}
              {recordingData.rapJitter?.toFixed(9)}
            </Text>
            <Text>
              <strong>Five-point Period Perturbation Quotient:</strong>{" "}
              {recordingData.ppq5Jitter?.toFixed(9)}
            </Text>
            <Text>
              <strong>Difference of Differences of Periods:</strong>{" "}
              {recordingData.ddpJitter?.toFixed(9)}
            </Text>
            <Text>
              <strong>local Shimmer:</strong>{" "}
              {recordingData.localShimmer?.toFixed(9)}
            </Text>
            <Text>
              <strong>local DB Shimmer:</strong>{" "}
              {recordingData.localdbShimmer?.toFixed(9)}
            </Text>
            <Text>
              <strong>Three-point Amplitude Perturbation Quotient:</strong>{" "}
              {recordingData.apq3Shimmer?.toFixed(9)}
            </Text>
            <Text>
              <strong>Five-point Amplitude Perturbation Quotient:</strong>{" "}
              {recordingData.aqpq5Shimmer?.toFixed(9)}
            </Text>
            <Text>
              <strong>11-point Amplitude Perturbation Quotient:</strong>{" "}
              {recordingData.apq11Shimmer?.toFixed(9)}
            </Text>
            <Text>
              <strong>DDA Shimmer:</strong>{" "}
              {recordingData.ddaShimmer?.toFixed(9)}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="praat-objects" value="PRAAT-Objects">
          <Accordion.Control>PRAAT-Objects</Accordion.Control>
          <Accordion.Panel>
            <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
              {parselStats}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="spectrogram" value="Spectrogram">
          <Accordion.Control>Spectrogram</Accordion.Control>
          <Accordion.Panel>
            <Image src={`${api_endpoint}\\spectrogram_intensity.png`} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="waveform" value="Waveform">
          <Accordion.Control>Waveform</Accordion.Control>
          <Accordion.Panel>
            <Image src={`${api_endpoint}\\waveform.png`} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
}
