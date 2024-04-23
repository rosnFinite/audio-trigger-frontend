import { Container } from "@mantine/core";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { generateEmptyGrid } from "../../utils/voicemapUtils";
import SocketContext from "../../context/SocketContext";
import VoiceFieldControlGroup from "../controls/VoiceFieldControlGroup";

interface MinMax {
  min: number,
  max: number
}

interface FieldData {
  id: string;
  data: {
    x: number;
    y: number;
  }[];
}

function getDataByKey(data: VoiceField[], key: string) {
  const result = data.map((item) => ({
    id: item.id,
    data: item.data.map((d: { x: number; y: VoiceStats }) => ({
      x: d.x,
      y: d.y[key as keyof VoiceStats] as number,
    })),
  }))
  return result
}

function getMinMax(data: FieldData[]) {
  const values = data.flatMap(entry => entry.data.map(value => value.y))
  const zeroFilteredValues = values.filter(y => y !== 0);
  let min, max;
  if (zeroFilteredValues.length === 0) {
    min = 0;
    max = 0;
  } else {
    min = Math.min(...zeroFilteredValues);
    max = Math.max(...zeroFilteredValues);
  }
  console.log(min, max)
  return {min: min, max: max}
}

/**
To visualize the voicemap, we use the Nivo library. We use a Heatmap to visualize the data. For it to work Nivo needs a grid of data. First dimension contains the dba values, the second dimension contains the frequency values. 
To visualize the current voice, we use the annotations feature of Nivo. This needs the id of the cell to be highlighted. We use the dba and frequency bin to calculate the id. 
Because we cannot use floating point numbers as ids, we convert the values to strings and remove the decimal point. This is later reverted in the axisBottom format function.
The same is done for the lower frequency bounds of the grid. Which we use to map the frequency bin to the actual frequency value.
 */

export default function VoiceField({
  height,
  width,
}: {
  height?: string;
  width?: string;
}) {
  const socket = useContext(SocketContext);

  // needed to create matching string for annotation
  const [selectedStat, setSelectedStat] = useState<string>("score");
  const dbBinSettings = useAppSelector((state) => state.settings.values.db);
  const freqBinSettings = useAppSelector(
    (state) => state.settings.values.frequency
  );
  const status = useAppSelector(
    (state) => state.settings.values.status
  );
  const minScore = useAppSelector((state) => state.settings.values.min_score);
  const voicemap = useAppSelector((state) => state.voicemap.values);
  const fieldBinNames = useAppSelector(
    (state) => state.voicemap.values.fieldBinNames
  );
  const [fieldData, setFieldData] = useState<FieldData[]>(getDataByKey(voicemap.field, selectValue))
  const [minmax, setMinmax] = useState<MinMax>({"min": minScore, "max": 1})
  const dispatch = useAppDispatch();

  useEffect(() => {
    // check current freq and dba settings of heatmap and compare to settings !IMPORTANT! This comparison requires the order of the attributes to be the same.
    // if the settings are different, we need to create a new empty heatmap
    if (
      JSON.stringify(voicemap.dbaSettings) !== JSON.stringify(dbBinSettings) ||
      JSON.stringify(voicemap.freqSettings) !== JSON.stringify(freqBinSettings)
    ) {
      dispatch({
        type: "voicemap/SET_DATAMAP",
        payload: generateEmptyGrid(dbBinSettings, freqBinSettings),
      });
      dispatch({
        type: "voicemap/UPDATE_SETTINGS",
        payload: { dbaSettings: dbBinSettings, freqSettings: freqBinSettings },
      });
    }
    console.log("voicemap", voicemap);
  }, []);

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    socket.on("voice", (data) => {
      dispatch({
        type: "voicemap/SET_ANNOTATION",
        // Heatmap naturally reverses dbaBin order (y-axis, from top to bottom, high -> low), therefore we need to maniupulate incoming dbaBin (low -> high to high -> low)
        payload: {
          id: `${
            fieldBinNames.dba[fieldBinNames.dba.length - data.dba_bin - 1]
          }.${fieldBinNames.freq[data.freq_bin]}`,
          text: "Stimme",
        },
      });
    });
    socket.on("trigger", (data) => {
      console.log("trigger", data);
      let numDbaBins = (dbBinSettings.upper - dbBinSettings.lower) / dbBinSettings.steps;
      dispatch({
        type: "voicemap/UPDATE_DATAPOINT",
        payload: {
          dbaBin: numDbaBins - data.dba_bin,
          freqBin: data.freq_bin,
          score: data.score,
          stats: data.stats,
        },
      });
    });
  }, [socket]);

  useEffect(() => {
    console.log("status", status);
    if (status === "reset") {
      dispatch({
        type: "voicemap/SET_DATAMAP",
        payload: generateEmptyGrid(dbBinSettings, freqBinSettings),
      });
    }
  }, [dispatch, dbBinSettings, freqBinSettings, status]);

  useEffect(() => {
    console.log("UPDATE MINMAX AND SELETED DATA")
    // special case 'score' here we already have minimum provided for the values
    const selectedData = getDataByKey(voicemap.field, selectValue);
    if (selectValue === "score") {
      setMinmax({min: minScore, max: 1});
    } else {
      const selectedDataMinMax = getMinMax(selectedData);
      setMinmax(selectedDataMinMax);
    }
    setFieldData(selectedData);
  }, [selectValue])

  return (
    <Container
      ml={0}
      mr={30}
      mb={5}
      h={height === undefined ? "70vh" : height}
      w={width === undefined ? "100%" : width}
      fluid
    >
      <VoiceFieldControlGroup onStatChange={(selection) => setSelectedStat(selection)}/>
      <ResponsiveHeatMapCanvas
        data={fieldData}
        valueFormat="0>-.4f"
        margin={{ top: 0, right: 60, bottom: 130, left: 40 }}
        xOuterPadding={0.5}
        yOuterPadding={0.5}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 90,
          legend: "Frequenz [Hz]",
          legendOffset: 55,
          legendPosition: "middle",
          format: (value: any) => {
            // Konvertieren Sie den Wert in einen String
            let strValue = value.toString();
            // Fügen Sie einen Punkt vor den letzten beiden Ziffern ein
            let formattedValue =
              strValue.slice(0, -2) + "." + strValue.slice(-2);
            return formattedValue;
          },
        }}
        axisTop={null}
        axisLeft={{
          tickSize: 5,
          ticksPosition: "after",
          tickRotation: 0,
          legend: "dB(A)",
          legendPosition: "middle",
          legendOffset: -35,
        }}
        axisRight={null}
        colors={{
          type: "diverging",
          scheme: "blues",
          minValue: selectedStat === "score" ? minScore : 0,
          maxValue: selectedStat === "score" ? 1 : undefined,
        }}
        emptyColor="#555555"
        enableLabels={false}
        legends={[
          {
            anchor: "right",
            translateX: 30,
            translateY: 0,
            length: 200,
            thickness: 10,
            direction: "column",
            tickPosition: "after",
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            tickFormat: ">-.2s",
            title: `${selectedStat} →`,
            titleAlign: "start",
            titleOffset: 4,
          },
        ]}
        annotations={[
          {
            type: "rect",
            match: {
              id: voicemap.annotation.id, // Fix: Assign the id property with the value as a string
            },
            note: voicemap.annotation.text,
            noteX: -22,
            noteY: -20,
            offset: 0,
            noteTextOffset: 0,
            noteWidth: 0,
            borderRadius: 20,
          },
        ]}
      />
    </Container>
  );
}
