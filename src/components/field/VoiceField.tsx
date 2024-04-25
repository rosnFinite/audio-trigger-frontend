import { Container } from "@mantine/core";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import { BasicTooltip } from "@nivo/tooltip";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { generateEmptyGrid } from "../../utils/stateUtils";
import { getVoiceFieldDataByKey } from "../../utils/selectionUtils";
import SocketContext from "../../context/SocketContext";
import VoiceFieldControlGroup from "../controls/VoiceFieldControlGroup";
import VoiceFieldSelectionModal from "../modals/VoiceFieldSelectionModal";

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
  const dbBinSettings = useAppSelector((state) => state.settings.values.db);
  const freqBinSettings = useAppSelector(
    (state) => state.settings.values.frequency
  );
  const status = useAppSelector((state) => state.settings.values.status);
  const dbBinVoice = useAppSelector(
    (state) => state.voicemap.values.dbaSettings
  );
  const freqBinVoice = useAppSelector(
    (state) => state.voicemap.values.freqSettings
  );
  const annotation = useAppSelector(
    (state) => state.voicemap.values.annotation
  );
  const field = useAppSelector((state) => state.voicemap.values.field);
  const binNames = useAppSelector(
    (state) => state.voicemap.values.fieldBinNames
  );
  const color = useAppSelector((state) => state.voicemap.values.color);
  const dispatch = useAppDispatch();
  const [selectedStat, setSelectedStat] = useState<string>("score");
  const [selectedData, setSelectedData] = useState<VoiceFieldScalarData[]>(
    getVoiceFieldDataByKey(field, selectedStat)
  );
  const [selectedScheme, setSelectedScheme] = useState<string>(
    color[selectedStat as keyof StatColorSettings].scheme
  );
  const [selectedSchemeType, setSelectedSchemeType] = useState<string>(
    color[selectedStat as keyof StatColorSettings].type
  );
  const [selectedColorMinMax, setSelectedColorMinMax] = useState<{
    min: number | undefined;
    max: number | undefined;
  }>({
    min: color[selectedStat as keyof StatColorSettings].min,
    max: color[selectedStat as keyof StatColorSettings].max,
  });
  const [modalOpened, setModalOpened] = useState(false);
  const [selectionId, setSelectionId] = useState("");

  useEffect(() => {
    setSelectedData(getVoiceFieldDataByKey(field, selectedStat));
  }, [selectedStat, field]);

  useEffect(() => {
    setSelectedScheme(color[selectedStat as keyof StatColorSettings].scheme);
    setSelectedSchemeType(color[selectedStat as keyof StatColorSettings].type);
    setSelectedColorMinMax({
      min: color[selectedStat as keyof StatColorSettings].min,
      max: color[selectedStat as keyof StatColorSettings].max,
    });
  }, [selectedStat, color]);

  useEffect(() => {
    // check current freq and dba settings of heatmap and compare to settings !IMPORTANT! This comparison requires the order of the attributes to be the same.
    // if the settings are different, we need to create a new empty heatmap
    if (
      JSON.stringify(dbBinVoice) !== JSON.stringify(dbBinSettings) ||
      JSON.stringify(freqBinVoice) !== JSON.stringify(freqBinSettings)
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
  }, [dbBinSettings, freqBinSettings, dbBinVoice, freqBinVoice, dispatch]);

  // Listen for voice and trigger events
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
          id: `${binNames.dba[binNames.dba.length - data.dba_bin - 1]}.${
            binNames.freq[data.freq_bin]
          }`,
          text: "Stimme",
        },
      });
    });
    socket.on("trigger", (data) => {
      console.log("trigger", data);
      let numDbaBins =
        (dbBinSettings.upper - dbBinSettings.lower) / dbBinSettings.steps;
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
  }, [
    binNames.dba,
    binNames.freq,
    dbBinSettings.lower,
    dbBinSettings.steps,
    dbBinSettings.upper,
    dispatch,
    socket,
  ]);

  // reset the grid on status changed to 'reset'
  useEffect(() => {
    if (status === "reset") {
      dispatch({
        type: "voicemap/SET_DATAMAP",
        payload: generateEmptyGrid(dbBinSettings, freqBinSettings),
      });
    }
  }, [dispatch, dbBinSettings, freqBinSettings, status]);

  return (
    <Container
      ml={0}
      mr={30}
      mb={5}
      h={height === undefined ? "70vh" : height}
      w={width === undefined ? "100%" : width}
      fluid
    >
      <VoiceFieldControlGroup
        onStatChange={(selection) => setSelectedStat(selection)}
      />
      <ResponsiveHeatMapCanvas
        data={selectedData}
        animate={false}
        hoverTarget="cell"
        inactiveOpacity={0.7}
        onClick={(data, event) => {
          if (status !== "running") {
            dispatch({
              type: "voicemap/SET_ANNOTATION",
              payload: { id: data.id, text: "Auswahl" },
            });
            setSelectionId(data.id);
            setModalOpened(true);
          }
        }}
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
          type: selectedSchemeType as any,
          scheme: selectedScheme as any,
          minValue: selectedColorMinMax.min,
          maxValue: selectedColorMinMax.max,
        }}
        emptyColor="#ffffff"
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
              id: annotation.id, // Fix: Assign the id property with the value as a string
            },
            note: annotation.text,
            noteX: -22,
            noteY: -20,
            offset: 0,
            noteTextOffset: 0,
            noteWidth: 0,
            borderRadius: 20,
          },
        ]}
        tooltip={({ cell }) => {
          const [db, freq] = cell.id.split(".");
          const formattedDb = db + " dB";
          const formattedFreq =
            freq.slice(0, -2) + "." + freq.slice(-2) + " Hz";
          return (
            <BasicTooltip
              id={formattedDb + " / " + formattedFreq}
              value={cell.label ? cell.label : "Keine Daten"}
            />
          );
        }}
      />
      <VoiceFieldSelectionModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        selectionId={selectionId}
      />
    </Container>
  );
}
