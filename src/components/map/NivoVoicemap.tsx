import { Container, Slider, Stack } from "@mantine/core";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";

interface MapSettings {
  lower: number;
  upper: number;
  steps: number;
}


function generateEmptyGrid(dbSettings: MapSettings, freqSettings: MapSettings) {
  let result = [];
  for (let i = dbSettings.upper; i >= dbSettings.lower; i -= dbSettings.steps) {
    let data = [];

    for (let j = freqSettings.lower; j <= freqSettings.upper; j *= Math.pow(2, 2/12)) {
      data.push({
        x: j.toFixed(2).toString(),
        y: Math.floor(Math.random() * 51)
      });
    }
    result.push({
      id: i.toString(),
      data: data
    });
  }
  return result;
};

export default function NivoVoicemap() {
  const [freqBin, setFreqBin] = useState(0);
  const [dbaBin, setDbaBin] = useState(0);
  const settings = useAppSelector((state) => state.settings.value);
  const [data, setData] = useState(generateEmptyGrid(settings.db, settings.frequency));
  const [match, setMatch] = useState("");
  

  useEffect(() => {
    setData(generateEmptyGrid(settings.db, settings.frequency));
  }, [settings.db, settings.frequency]);

  useEffect(() => {
    setMatch(`${dbaBin}.${freqBin}`);
  }, [freqBin, dbaBin]);

  return (
    <Stack mt={20}>
      <Slider
        label="Frequency Bin"
        color="blue"
        defaultValue={0}
        min={0}
        max={32}
        marks={[
          { value: 0, label: '0' },
          { value: 16, label: '16' },
          { value: 32, label: '32' },
        ]}
        onChange={(value) => setFreqBin(value)}
      />
      <Slider
        label="dBA Bin"
        color="red"
        defaultValue={0}
        min={0}
        max={16}
        marks={[
          { value: 0, label: '0' },
          { value: 8, label: '8' },
          { value: 16, label: '16' },
        ]}
        onChange={(value) => setDbaBin(value)}
      />
      <Container ml={0} mr={30} h={"80vh"} fluid>
        <ResponsiveHeatMapCanvas
          data={data}
          margin={{ top: 70, right: 60, bottom: 70, left: 80 }}
          valueFormat=" >-.2s"
          xOuterPadding={0.5}
          yOuterPadding={0.5}
          axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: 'Frequenz [Hz]',
              legendOffset: 55,
              legendPosition: 'middle',
          }}
          axisTop={null}
          axisLeft={{
              tickSize: 5,
              ticksPosition: 'after',
              tickRotation: 0,
              legend: 'dB(A)',
              legendPosition: 'middle',
              legendOffset: -35
          }}
          axisRight={null}
          colors={{
              type: 'quantize',
              scheme: 'blues',
          }}
          emptyColor="#555555"
          enableLabels={false}
          legends={[
              {
                  anchor: 'right',
                  translateX: 30,
                  translateY: 0,
                  length: 200,
                  thickness: 10,
                  direction: 'column',
                  tickPosition: 'after',
                  tickSize: 3,
                  tickSpacing: 4,
                  tickOverlap: false,
                  tickFormat: '>-.2s',
                  title: 'Q-Score →',
                  titleAlign: 'start',
                  titleOffset: 4
              }
          ]}
          annotations={[
            {
                type: 'rect',
                
                match: {
                    id: match
                },
                note: '',
                noteX: -16,
                noteY: 0,
                offset: 0,
                noteTextOffset: 0,
                noteWidth:0,
                borderRadius: 20
            }
        ]}
        />
      </Container>
    </Stack>
  );
}