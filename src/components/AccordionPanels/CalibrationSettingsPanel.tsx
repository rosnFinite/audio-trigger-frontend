import {
  Accordion,
  Blockquote,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
} from "@mantine/core";
import { TbAdjustments, TbInfoCircle } from "react-icons/tb";
import JsonDropzone from "../Input/JsonDropzone";
import { useEffect, useRef, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

interface FileData {
  [key: string]: number[];
}

interface NivoData {
  id: string;
  data: { x: number; y: number }[];
}

const initialVisualizationData = [
  {
    id: "Mikrofon",
    data: [{ x: 0, y: 0 }],
  },
  {
    id: "Referenz",
    data: [{ x: 0, y: 0 }],
  },
  {
    id: "Korrekturwerte",
    data: [{ x: 0, y: 0 }],
  },
  {
    id: "Mikrofon(kalibriert)",
    data: [{ x: 0, y: 0 }],
  },
];

const transformInNivoFormat = (data: FileData): NivoData[] => {
  const micData: NivoData = {
    id: "Mikrofon",
    data: Object.entries(data).map(([key, values]) => ({
      x: parseInt(key),
      y: values[1],
    })),
  };
  const corrData: NivoData = {
    id: "Korrekturwerte",
    data: Object.entries(data).map(([key, values]) => ({
      x: parseInt(key),
      y: values[2],
    })),
  };
  const calibData: NivoData = {
    id: "Mikrofon(kalibriert)",
    data: Object.entries(data).map(([key, values]) => ({
      x: parseInt(key),
      y: values[1] + values[2],
    })),
  };
  const refData: NivoData = {
    id: "Referenz",
    data: Object.entries(data).map(([key, values]) => ({
      x: parseInt(key),
      y: parseInt(key),
    })),
  };

  return [micData, refData, corrData, calibData];
};

export default function CalibrationSettingsPanel({
  settings,
  setSettings,
}: {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<FileData | null>(null);
  const [dataToVisualize, setDataToVisualize] = useState<NivoData[]>(
    initialVisualizationData
  );
  const numCalibPoints = useRef<number>(0);

  useEffect(() => {
    console.log("File content changed useEffect");
    if (fileContent !== null) {
      numCalibPoints.current = Object.keys(fileContent).length;
      const nivoData = transformInNivoFormat(fileContent);
      setDataToVisualize(nivoData);
      setSettings({ ...settings, calibration_data: fileContent });
      console.log("File content changed:", fileContent);
    }
  }, [fileContent]);

  useEffect(() => {
    console.log("Calibration data changed useEffect");
    if (
      settings.calibration_data !== null &&
      settings.calibration_data !== undefined
    ) {
      console.log(settings.calibration_data);
      numCalibPoints.current = Object.keys(settings.calibration_data).length;
      const nivoData = transformInNivoFormat(settings.calibration_data);
      setDataToVisualize(nivoData);
      console.log("Calibration data changed:", settings.calibration_data);
    } else {
      setFileContent(null);
      setDataToVisualize(initialVisualizationData);
    }
  }, [settings.calibration_data]);

  return (
    <Accordion.Item value="Calibration">
      <Accordion.Control icon={<TbAdjustments />}>
        Kalibrierung
      </Accordion.Control>
      <Accordion.Panel>
        {fileContent === null && settings.calibration_data === null ? (
          <>
            <Blockquote
              iconSize={20}
              icon={<TbInfoCircle size="20px" />}
              mt="xs"
              pt={10}
              pb={10}
            >
              Soll das Mikrofon zusätzlich als Dezibelmessgerät verwendet
              werden, muss zur Gewährleistung einer möglichst hohen
              Messgenauigkeit eine zugehörige Kalibrierungdatei beigefügt
              werden.
            </Blockquote>
            <Center mt={15}>
              <JsonDropzone
                setFileName={setFileName}
                setFileContent={setFileContent}
              />
            </Center>
          </>
        ) : (
          <>
            <Blockquote
              iconSize={20}
              icon={<TbInfoCircle size="20px" />}
              mt="xs"
              pt={10}
              pb={10}
              style={{ whiteSpace: "pre-line" }}
            >
              Datei wurde erfolgreich geladen. Die in der Datei enthaltenen
              Kalibrierungsdaten werden im folgenden Diagramm dargestellt. Um
              eine andere Datei zu laden oder Kalibrierung zu entfernen klicken
              Sie auf den "Kalibrierung entfernen"-Button.
            </Blockquote>
            <Center>
              <Button
                aria-label="Kalibrierung entfernen"
                mt={10}
                size="xs"
                onClick={() => {
                  setFileName("");
                  setFileContent(null);
                  setSettings({ ...settings, calibration_data: null });
                }}
              >
                Kalibrierung entfernen
              </Button>
            </Center>
            <Group>
              <Text fw={700}>Dateiname:</Text>
              <Text>{fileName}</Text>
            </Group>
            <Group>
              <Text fw={700}>Kalibrierungpunkte:</Text>
              <Text>{numCalibPoints.current}</Text>
            </Group>
            <Text size="lg" mt={30} mb={-30}>
              Mikrofon vs Referenz
            </Text>
            <Container h={500} fluid>
              <ResponsiveLine
                isInteractive={true}
                data={dataToVisualize}
                xScale={{ type: "point" }}
                margin={{ top: 50, bottom: 50, left: 50, right: 60 }}
                colors={{ scheme: "category10" }}
                pointSize={5}
                yFormat=" >-.3f"
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Dezibel (erzeugt)",
                  legendOffset: 36,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Dezibel (gemessen)",
                  legendOffset: -40,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                enableTouchCrosshair={true}
                useMesh={true}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: -50,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(0, 0, 0, .03)",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
                tooltip={({ point }) => (
                  <Paper shadow="lg" p="xs" radius="sm" withBorder>
                    <strong>{point.serieId}</strong>
                    <br />
                    <strong>Soll: </strong> {point.data.xFormatted}
                    <br />
                    <strong>Ist: </strong> {point.data.yFormatted}
                  </Paper>
                )}
                enableSlices="x"
              />
            </Container>
          </>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}
