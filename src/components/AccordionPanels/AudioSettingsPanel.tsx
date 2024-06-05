import {
  Accordion,
  Blockquote,
  Checkbox,
  Group,
  NativeSelect,
  NumberInput,
  Stack,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TbInfoCircle, TbMicrophone2 } from "react-icons/tb";
import { useAppSelector } from "../../redux/hooks";
import axios from "axios";

interface Device {
  label: string;
  value: string;
}

const initialDevices: Device[] = [
  { label: "Kein Mikrofon gefunden", value: "-1" },
];

export default function AudioSettingsPanel({
  settings,
  setSettings,
}: {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const sid = useAppSelector((state) => state.settings.values.sid);
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  useEffect(() => {
    const fetchDevices = async () => {
      while (true) {
        try {
          const response = await axios.get(
            "http://localhost:5001/api/audio-client/devices"
          );
          const data = response.data;
          // transform data to match the format of the NativeSelect component
          const transformed = data.devices.map((device: any) => {
            return {
              label: device.name,
              value: device.id,
            };
          });
          // reset to initial devices state on first component render, then add the loaded devices
          setDevices([...transformed]);
          break; // break the loop if fetching was successful
        } catch (error: any) {
          console.log(
            "Fehler beim Laden der angeschlossenen Geräte: " + error.message
          );
          // retry fetching devices
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    // only fetch devices if the audio client is connected
    if (sid !== "") {
      fetchDevices();
    } else {
      setDevices(initialDevices);
    }
  }, [sid]);

  return (
    <Accordion.Item value="Audio">
      <Accordion.Control icon={<TbMicrophone2 />}>Audio</Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <NativeSelect
            label="Aufnahmegerät"
            description="Auswahl des zu verwendenden Aufnahmegerätes. Bei 'Automatisch erkennen' wird standardmäßig das iMic-Microfon verwendet. Falls nicht verfügbar, wird das erste gefundene Gerät verwendet."
            data={devices}
            onChange={(event) => {
              setSettings({
                ...settings,
                device: Number(event.currentTarget.value),
              });
            }}
          />
          <Group grow>
            <NumberInput
              label="Abtastrate"
              defaultValue={16000}
              value={settings.sampling_rate}
              placeholder="16000"
              suffix=" Hz"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  sampling_rate: Number(event.value),
                });
              }}
            />
            <NumberInput
              label="Buffergröße"
              defaultValue={0.2}
              value={settings.buffer_size}
              placeholder="0.2"
              suffix=" Sek."
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  buffer_size: Number(event.value),
                });
              }}
            />
            <NumberInput
              label="Chunksize"
              defaultValue={1024}
              value={settings.chunk_size}
              placeholder="1024"
              hideControls
              onValueChange={(event) => {
                setSettings({
                  ...settings,
                  chunk_size: Number(event.value),
                });
              }}
            />
          </Group>
          <Blockquote
            iconSize={20}
            icon={<TbInfoCircle size="20px" />}
            mt="xs"
            pt={10}
            pb={10}
          >
            Beim Aktivieren des Monosignals werden keine EGG-Daten
            aufgezeichnet.
          </Blockquote>
          <Checkbox
            label="Monosignal (1 Kanal)"
            checked={settings.mono}
            size="md"
            onChange={(event) => {
              setSettings({
                ...settings,
                mono: event.currentTarget.checked,
              });
            }}
          />
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
