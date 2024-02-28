import { Container } from "@mantine/core";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { SocketProp } from "../../types/SocketProp.types";

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
        y: 0,
      });
    }
    result.push({
      id: i.toString(),
      data: data
    });
  }
  return result;
};

export default function NivoVoicemap({socket}: SocketProp) {
  const settings = useAppSelector((state) => state.settings.values);
  const [data, setData] = useState(generateEmptyGrid(settings.db, settings.frequency));
  
  useEffect(() => {
    setData(generateEmptyGrid(settings.db, settings.frequency));
  }, [settings.db, settings.frequency]);

  useEffect(() => {
    socket.on("voice", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <Container ml={0} mr={30} h={"50vw"} fluid>
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
            type: 'diverging',
            scheme: 'blues',
            minValue: 0,
            maxValue: 50,
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
                id: `${"999"}.${"9999"}` // Fix: Assign the id property with the value as a string
              },
              note: 'Stimme',
              noteX: -22,
              noteY: -20,
              offset: 0,
              noteTextOffset: 0,
              noteWidth:0,
              borderRadius: 20
            }
          ]}
      />
    </Container>
  );
}