import {
  Accordion,
  Stack,
  Divider,
  Blockquote,
  Group,
  NumberInput,
  Text,
} from "@mantine/core";
import { TbFlagExclamation, TbInfoCircle } from "react-icons/tb";

export default function TriggerSettingsPanel({
  settings,
  setSettings,
}: {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  return (
    <Accordion.Item value="Trigger">
      <Accordion.Control icon={<TbFlagExclamation />}>
        Trigger
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <Text fw={700}>Definition des Stimmfeldes</Text>
          <Divider />
          <Blockquote
            color="blue"
            iconSize={20}
            icon={<TbInfoCircle size="20px" />}
            mt="xs"
            pt={10}
            pb={10}
          >
            Hieraus ergibt sich die Größe der unter "Stimmfeld" dargestellten
            Heatmap.
          </Blockquote>
          <Group grow>
            <NumberInput
              aria-label="Untere Frequenzgrenze"
              label="Untere Frequenzgrenze"
              description="Untere Grenze des relevanten Frequenzbereichs"
              defaultValue={55}
              value={settings.frequency.lower}
              decimalScale={2}
              placeholder="55"
              suffix=" Hz"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  frequency: {
                    ...settings.frequency,
                    lower: Number(event.value),
                  },
                });
              }}
            />
            <NumberInput
              aria-label="Obere Frequenzgrenze"
              label="Obere Frequenzgrenze"
              description="Obere Grenze des relevanten Frequenzbereichs"
              defaultValue={1600}
              value={settings.frequency.upper}
              decimalScale={2}
              placeholder="1600"
              suffix=" Hz"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  frequency: {
                    ...settings.frequency,
                    upper: Number(event.value),
                  },
                });
              }}
            />
            <NumberInput
              aria-label="Halbtonschritte"
              label="Halbtonschritte"
              description="Größe der zusammengefassten Frequenzbereiche"
              defaultValue={2}
              value={settings.frequency.steps}
              allowDecimal={false}
              placeholder="2"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  frequency: {
                    ...settings.frequency,
                    steps: Number(event.value),
                  },
                });
              }}
            />
          </Group>
          <Group grow>
            <NumberInput
              aria-label="Untere Dezibelgrenze"
              label="Untere Dezibelgrenze"
              description="Untere Grenze des relevanten Schalldruckpegels"
              defaultValue={35}
              value={settings.db.lower}
              allowDecimal={false}
              placeholder="35"
              suffix=" dB"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  db: { ...settings.db, lower: Number(event.value) },
                });
              }}
            />
            <NumberInput
              aria-label="Obere Dezibelgrenze"
              label="Obere Dezibelgrenze"
              description="Obere Grenze des relevanten Schalldruckpegels"
              defaultValue={115}
              value={settings.db.upper}
              allowDecimal={false}
              placeholder="115"
              suffix=" dB"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  db: { ...settings.db, upper: Number(event.value) },
                });
              }}
            />
            <NumberInput
              aria-label="Dezibelschritte"
              label="Dezibelschritte"
              description="Größe der zusammengefassten Schalldruckpegelbereiche"
              defaultValue={5}
              value={settings.db.steps}
              allowDecimal={false}
              placeholder="5"
              suffix=" dB"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  db: { ...settings.db, steps: Number(event.value) },
                });
              }}
            />
          </Group>
          <Text fw={700}>Einstellung des Triggerverhaltens</Text>
          <Divider />
          <Group ml={0} pl={0} justify="space-between" grow>
            <NumberInput
              aria-label="Mindest-Score für Trigger"
              label="Mindest-Score"
              description="Zu erreichender Score für das Erfassen eines Events. Wertebereich: 0.0 - 1.0. "
              defaultValue={0.7}
              value={settings.min_score}
              decimalScale={2}
              placeholder="0.7"
              min={0}
              max={1}
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  min_score: Number(event.value),
                });
              }}
            />
            <NumberInput
              aria-label="Prozentuale Verbesserung für Retrigger"
              label="Retrigger Scoreverbesserung [%]"
              description="Prozentuale Verbesserung eines bereits hinterlegten Scores, um ein erneutes Triggern zu ermöglichen."
              defaultValue={10}
              placeholder="10"
              decimalScale={2}
              suffix="%"
              min={0}
              max={100}
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  retrigger_percentage_improvement: Number(event.value) / 100,
                });
              }}
            />
          </Group>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
