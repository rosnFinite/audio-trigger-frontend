import { Accordion, Blockquote, Center } from "@mantine/core";
import { TbAdjustments, TbInfoCircle } from "react-icons/tb";
import JsonDropzone from "../Input/JsonDropzone";

export default function CalibrationSettingsPanel() {
  return (
    <Accordion.Item value="Calibration">
      <Accordion.Control icon={<TbAdjustments />}>
        Kalibrierung
      </Accordion.Control>
      <Accordion.Panel>
        <Blockquote
          iconSize={20}
          icon={<TbInfoCircle size="20px" />}
          mt="xs"
          pt={10}
          pb={10}
        >
          Soll das Mikrofon zusätzlich als Dezibelmessgerät verwendet werden,
          muss zur Gewährleistung einer möglichst hohen Messgenauigkeit eine
          zugehörige Kalibrierungdatei beigefügt werden.
        </Blockquote>
        <Center mt={15}>
          <JsonDropzone />
        </Center>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
