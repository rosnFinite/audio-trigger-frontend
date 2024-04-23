import {
  Text,
  Button,
  Group,
  NativeSelect,
  NumberInput,
  Popover,
  Switch,
  Divider,
  Container,
  Grid,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TbColorPicker } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

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
      if (data.y[stat] !== 0) {
        if (data.y[stat] < min) {
          min = data.y[stat];
        }
        if (data.y[stat] > max) {
          max = data.y[stat];
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
  const [selectedStat, setSelectedStat] = useState<string>("score");
  const [selectedSchemeType, setSelectedSchemeType] =
    useState<string>("divergent");
  const [selectedScheme, setSelectedScheme] = useState<string>("blues");
  const [colorMin, setColorMin] = useState<number>(-1);
  const [colorMax, setColorMax] = useState<number>(-1);
  const [colorDiverge, setColorDiverge] = useState<number>(-1);
  const [disabled, setDisabled] = useState<boolean>(true);

  const voicefield = useAppSelector((state) => state.voicemap.values.field);
  const dispatch = useAppDispatch();

  const handleStatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStat: string = event.currentTarget.value;
    setSelectedStat(selectedStat);
    onStatChange(selectedStat);
  }

  useEffect(() => {
    const { min, max } = getMinMaxScore(
      voicefield,
      selectedStat as keyof VoiceStats
    );
    console.log(min, max);
    setColorMin(min);
    setColorMax(max);
  }, [selectedStat, voicefield]);

  return (
    <Group align="flex-end">
      <NativeSelect
        variant="filled"
        label="Statistik"
        description="Wählen Sie die Statistik, die Sie visualisieren möchten."
        value={selectedStat}
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
        <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button leftSection={<TbColorPicker />}>Farbskalierung</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <NativeSelect
              mb={5}
              label="Typ"
              value={selectedSchemeType}
              onChange={(event) =>
                setSelectedSchemeType(event.currentTarget.value)
              }
              data={[
                { label: "Divergent", value: "divergent" },
                { label: "Sequential", value: "sequential" },
                { label: "Quantize", value: "quantize" },
              ]}
            />
            <NativeSelect
              mb={10}
              label="Schema"
              value={selectedScheme}
              onChange={(event) => setSelectedScheme(event.currentTarget.value)}
              data={colorSchemes}
            />
            <Divider my="sm" />
            <Text mb={5}>Auswahl des Wertebereichs</Text>
            <Switch
              defaultChecked
              label="Automatisch"
              onChange={(event) => setDisabled(event.currentTarget.checked)}
              mb={10}
            />
            <Divider />
            <Container pl={0} pr={0}>
              <Grid>
                <Grid.Col span={6}>
                  <Text td="underline" fw={500}>
                    Datenbestand
                  </Text>
                  <Text size="xs">Min: 0</Text>
                  <Text size="xs">Max: 100</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text td="underline" fw={500}>
                    Ausgewählt
                  </Text>
                  <Text size="xs">Min: 0</Text>
                  <Text size="xs">Max: 100</Text>
                </Grid.Col>
              </Grid>

              <Divider my="xs" />
              <NumberInput
                disabled={disabled}
                label="Mindestwert"
                defaultValue={colorMin}
                min={-1}
              />
              <NumberInput
                disabled={disabled}
                label="Maximalwert"
                defaultValue={colorMax}
                min={-1}
              />
              {selectedSchemeType === "divergent" && (
                <NumberInput
                  disabled={disabled}
                  label="Diverge at"
                  defaultValue={colorDiverge}
                  min={-1}
                />
              )}
              <Button
                mt={10}
                fullWidth
                color="green"
                onClick={() => {
                  dispatch({
                    type: "SET_COLOR",
                    payload: {
                      stats: selectedStat,
                      color: {
                        min: 0,
                        max: 100,
                        type: "divergent",
                        scheme: "blues",
                      },
                    },
                  });
                }}
              >
                Anwenden
              </Button>
              <Button mt={5} fullWidth color="red">
                Zurücksetzen
              </Button>
            </Container>
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Group>
  );
}
