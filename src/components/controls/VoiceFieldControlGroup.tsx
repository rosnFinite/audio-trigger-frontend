import {
  Text,
  Button,
  Group,
  NativeSelect,
  NumberInput,
  Switch,
  Divider,
  Container,
  Grid,
  Modal,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TbColorPicker } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useDisclosure } from "@mantine/hooks";

interface VoiceFieldControlGroupProps {
  onStatChange: (selectedStat: string) => void;
}

function getMinMaxScore(
  voicefield: VoiceField[],
  stat: keyof VoiceStats
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;

  for (const field of voicefield) {
    for (const data of field.data) {
      const value = data.y[stat];
      if (value != null) {
        if (value < min) {
          min = value;
        }
        if (value > max) {
          max = value;
        }
      }
    }
  }
  return { min, max };
}

const colorSchemes = [
  { label: "Sequential: Blues", value: "blues" },
  { label: "Sequential: Greens", value: "greens" },
  { label: "Sequential: Reds", value: "reds" },
  { label: "Sequential: Green->Blue", value: "green_blue" },
  { label: "Sequential: Blue->Green", value: "blue_green" },
  { label: "Sequential: Purple->Red", value: "purple_red" },
  {
    label: "Sequential: Yellow->Green->Blue",
    value: "yellow_green_blue",
  },
  { label: "Sequential: Yellow->Orange->Red", value: "yellow_orange_red" },
  { label: "Diverging: Spectral", value: "spectral" },
  { label: "Diverging: Red->Blue", value: "red_blue" },
  { label: "Diverging: Red->Grey", value: "red_grey" },
  { label: "Diverging: Red->Yellow->Green", value: "red_yellow_green" },
];

export default function VoiceFieldControlGroup({onStatChange}: VoiceFieldControlGroupProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [stat, setStat] = useState<string>("score");
  const minScore = useAppSelector((state) => state.settings.values.min_score);
  const [schemeType, setSchemeType] =
    useState<string>("diverging");
  const [scheme, setScheme] = useState<string>("blues");
  const [manualMinMax, setManualMinMax] = useState<{min: number; max: number}>({min: -1, max: -1});
  const [dataMinMax, setDataMinMax] = useState<{min: number; max: number}>({min: 0, max: 0});
  const [colorDiverge, setColorDiverge] = useState<number>(-1);
  const [autoMinMax, setAutoMinMax] = useState<boolean>(true);

  const field = useAppSelector((state) => state.voicemap.values.field);
  const color = useAppSelector((state) => state.voicemap.values.color[stat as keyof StatColorSettings]);
  const dispatch = useAppDispatch();

  const handleStatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const stat: string = event.currentTarget.value;
    setStat(stat);
    onStatChange(stat);
  }

  useEffect(() => {
    const { min, max } = getMinMaxScore(
      field,
      stat as keyof VoiceStats
    );
    setManualMinMax({min: color.min, max: color.max});
    setDataMinMax({min: min, max: max});
  }, [stat, field, color.min, color.max]);

  return (
    <Group align="flex-end">
      <NativeSelect
        variant="filled"
        label="Statistik"
        description="Wählen Sie die Statistik, die Sie visualisieren möchten."
        value={stat}
        onChange={handleStatChange}
        data={[
          "score",
          "meanF",
          "stdevF",
          "hnr",
          "localJitter",
          "localAbsoluteJitter",
          "rapJitter",
          "ppq5Jitter",
          "ddpJitter",
          "localShimmer",
          "localdbShimmer",
          "apq3Shimmer",
          "aqpq5Shimmer",
          "apq11Shimmer",
          "ddaShimmer",
        ]}
      />
      <Group>
        <Modal opened={opened} onClose={close} title="Farbskalierung">
          <Group>
            <NativeSelect
              label="Typ"
              value={schemeType}
              onChange={(event) =>
                setSchemeType(event.currentTarget.value)
              }
              data={[
                { label: "Diverging", value: "diverging" },
                { label: "Sequential", value: "sequential" },
                { label: "Quantize", value: "quantize" },
              ]}
            />
            <NativeSelect
              label="Schema"
              value={scheme}
              onChange={(event) => setScheme(event.currentTarget.value)}
              data={colorSchemes}
            />
          </Group>
          <Divider my="sm" />
          <Center>
            <Switch
              defaultChecked
              label="Automatisch Auswahl des Wertebereichs"
              onChange={(event) => setAutoMinMax(event.currentTarget.checked)}
            />
          </Center>
          <Divider my="sm"/>
          <Group>
            <Container>
              <Text td="underline" fw={500}> Datenbestand</Text>
              <Text size="xs">Min: {dataMinMax.min === Infinity ? "NaN" : dataMinMax.min}</Text>
              <Text size="xs">Max: {dataMinMax.max === -Infinity ? "NaN" : dataMinMax.max}</Text>
            </Container>
            <Container>
              <Text td="underline" fw={500}> Ausgewählt</Text>
              <Text size="xs">Min: {color.min === -1 ? "Autom." : color.min}</Text>
              <Text size="xs">Max: {color.max === -1 ? "Autom." : color.max}</Text>
            </Container>
          </Group>
          <Divider my="sm" />
          <NumberInput
            disabled={autoMinMax}
            label="Mindestwert"
            description="Geben Sie den minimalen Wert für die Farbskala ein. [-1 = Automatisch]"
            defaultValue={manualMinMax.min}
            onChange={(value) => setManualMinMax({min: Number(value), max: manualMinMax.max})}
            min={-1}
          />
          <NumberInput
            disabled={autoMinMax}
            label="Maximalwert"
            description="Geben Sie den maximalen Wert für die Farbskala ein. [-1 = Automatisch]"
            defaultValue={manualMinMax.max}
            onChange={(value) => setManualMinMax({min: manualMinMax.min, max:Number(value)})}
            min={-1}
          />
          {schemeType === "diverging" && (
            <NumberInput
              disabled={autoMinMax}
              label="Diverge at"
              description="Geben Sie den Wert ein, bei dem die Farbskala divergiert. [-1 = Automatisch]"
              defaultValue={colorDiverge}
              onChange={(value) => setColorDiverge(Number(value))}
              min={-1}
            />
          )}
          <Grid mt={10}>
            <Grid.Col span={6}>
              <Button
                color="green"
                fullWidth
                onClick={() => {
                  dispatch({
                    type: "voicemap/SET_COLOR",
                    payload: {
                      stat: stat,
                      color: {
                        min: autoMinMax ? -1 : manualMinMax.min,
                        max: autoMinMax ? -1 : manualMinMax.max,
                        type: schemeType,
                        scheme: scheme,
                      },
                    },
                  });
                  close();
                }}
              >
                Anwenden
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button color="red" fullWidth onClick={() => {
                  dispatch({type: "voicemap/SET_COLOR", payload: {stat: stat, color: {min: stat === "score" ? minScore : -1, max: stat === "score" ? 1 : -1, type: "diverging", scheme: "blues"}}});
                  close();
                }}
              >
                Zurücksetzen
              </Button>
            </Grid.Col>
          </Grid>
        </Modal>
        <Button leftSection={<TbColorPicker />} onClick={open}>Farbskalierung</Button>
      </Group>
    </Group>
  );
}
