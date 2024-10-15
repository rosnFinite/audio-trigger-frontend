import { Container } from "@mantine/core";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import { useEffect, useState } from "react";
import { getVoiceFieldDataByKey } from "../../utils/selectionUtils";

export default function VoiceFieldMinimal({
  field,
  annotation,
}: {
  field: VoiceField[];
  annotation: {
    id: string;
    text: string;
  };
}) {
  const [data, setData] = useState<VoiceFieldScalarData[]>(
    getVoiceFieldDataByKey(field, "accepted")
  );

  useEffect(() => {
    setData(getVoiceFieldDataByKey(field, "accepted"));
  }, [field]);

  return (
    <Container fluid h="95vh" w="100vw">
      <ResponsiveHeatMapCanvas
        data={data}
        margin={{ top: 10, right: 5, bottom: 70, left: 45 }}
        valueFormat=" >-.2s"
        xOuterPadding={0}
        yOuterPadding={0}
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
        colors={(d) => (d.value || !d.value ? "#236bfa" : "#ffffff")}
        emptyColor="#ffffff"
        enableLabels={false}
        legends={[]}
        annotations={[
          {
            type: "rect",
            match: {
              id: annotation.text === "Stimme" ? annotation.id : "0.0", // Fix: Assign the id property with the value as a string
            },
            note: "Stimme",
            noteX: -50,
            noteY: -50,
            offset: 0,
            noteTextOffset: 0,
            noteWidth: 20,
            borderRadius: 20,
          },
        ]}
        isInteractive={false}
      />
    </Container>
  );
}
