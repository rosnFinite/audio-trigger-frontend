import { Container } from "@mantine/core";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { SocketProp } from "../../types/SocketProp.types";

interface MapSettings {
  lower: number;
  upper: number;
  steps: number;
}


/**
To visualize the voicemap, we use the Nivo library. We use a Heatmap to visualize the data. For it to work Nivo needs a grid of data. First dimension contains the dba values, the second dimension contains the frequency values. 
To visualize the current voice, we use the annotations feature of Nivo. This needs the id of the cell to be highlighted. We use the dba and frequency bin to calculate the id. 
Because we cannot use floating point numbers as ids, we convert the values to strings and remove the decimal point. This is later reverted in the axisBottom format function.
The same is done for the lower frequency bounds of the grid. Which we use to map the frequency bin to the actual frequency value.
 */

function generateEmptyGrid(dbSettings: MapSettings, freqSettings: MapSettings) {
  let grid = [];
  for (let i = dbSettings.upper; i >= dbSettings.lower; i -= dbSettings.steps) {
    let data = [];

    for (let j = freqSettings.lower; j <= freqSettings.upper; j *= Math.pow(2, 2/12)) {
      data.push({
        x: j.toFixed(2).toString().replace(".", ""),
        y: 0,
      });
    }
    grid.push({
      id: i.toString(),
      data: data
    });
  }
  return grid;
};

function generateLowerBounds(dbSettings: MapSettings, freqSettings: MapSettings) {
  let lowerBounds: {freq: string[], dba: string[]} = {
    "freq": [],
    "dba": []
  };
  for (let i = freqSettings.lower; i <= freqSettings.upper; i *= Math.pow(2, 2/12)) {
    lowerBounds.freq.push(i.toFixed(2).toString().replace(".", ""));
  }
  for (let i = dbSettings.lower; i <= dbSettings.upper; i += dbSettings.steps) {
    lowerBounds.dba.push(i.toString());
  }
  return lowerBounds;
}

export default function NivoVoicemap({socket}: SocketProp) {
  // needed to create matching string for annotation
  const settingsDb: MapSettings = useAppSelector((state) => state.settings.values.db);
  const settingsFreq: MapSettings = useAppSelector((state) => state.settings.values.frequency);
  const settingsStatus = useAppSelector((state) => state.settings.values.status);
  const settingsQScore = useAppSelector((state) => state.settings.values.qualityScore);
  const voicemap = useAppSelector((state) => state.voicemap.value);
  const dispatch = useAppDispatch(); 
  const lowerBounds = useMemo(() => generateLowerBounds(settingsDb, settingsFreq), [settingsDb, settingsFreq]);

  
  useEffect(() => {
    // check current freq and dba settings of heatmap and compare to settings !IMPORTANT! This comparison requires the order of the attributes to be the same.
    // if the settings are different, we need to create a new empty heatmap
    if (JSON.stringify(voicemap.dbaSettings) !== JSON.stringify(settingsDb) || JSON.stringify(voicemap.freqSettings) !== JSON.stringify(settingsFreq)) {
      dispatch({ type: "voicemap/SET_DATAMAP", payload: generateEmptyGrid(settingsDb, settingsFreq)});
      dispatch({ type: "voicemap/UPDATE_SETTINGS", payload: {dbaSettings: settingsDb, freqSettings: settingsFreq}});
    }
    console.log("voicemap", voicemap);
  }, []);

  useEffect(() => {
    socket.on("voice", (data) => {
      dispatch({ type: "voicemap/SET_VOICE", payload: `${lowerBounds.dba[data.dba_bin]}.${lowerBounds.freq[data.freq_bin]}` });
    });
    // TODO still some bugs with certain values
    socket.on("trigger", (data) => {
      console.log("trigger", data);
      let numDbaBins = (settingsDb.upper - settingsDb.lower) / settingsDb.steps;
      dispatch({ type: "voicemap/UPDATE_DATAPOINT", payload: {dbaBin: numDbaBins - data.dba_bin, freqBin: data.freq_bin, score: data.score} });
    });
  }, [socket]);

  useEffect(() => {
    console.log("status", settingsStatus);
    if (settingsStatus.trigger === "reset") {
      dispatch({ type: "voicemap/SET_DATAMAP", payload: generateEmptyGrid(settingsDb, settingsFreq)});
    }
  }, [dispatch, settingsDb, settingsFreq, settingsStatus]);

  return (
    <Container ml={0} mr={30} h={"50vw"} fluid>
      <ResponsiveHeatMapCanvas
        data={voicemap.datamap}
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
            format: (value: any) => {
              // Konvertieren Sie den Wert in einen String
              let strValue = value.toString();
              // Fügen Sie einen Punkt vor den letzten beiden Ziffern ein
              let formattedValue = strValue.slice(0, -2) + '.' + strValue.slice(-2);
              return formattedValue;
            }
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
            maxValue: settingsQScore,
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
                id: voicemap.voice // Fix: Assign the id property with the value as a string
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