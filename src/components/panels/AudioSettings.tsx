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

export default function AudioSettings({
  settings,
  setSettings,
}: {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const sid = useAppSelector((state) => state.settings.values.sid);
  const stateSettings = useAppSelector((state) => state.settings.values);
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
          <Blockquote
              iconSize={20}
              icon={<TbInfoCircle size="20px" />}
              mt="xs"
              pt={10}
              pb={10}
            >
              Vergewissern Sie sich, dass externe Gerät korrekt an das DAQ-Board angeschlossenen sind: Mikrofon (AI0), Schalldruckmessgerät (AI1)
          </Blockquote>
          <Group grow>
            <NumberInput
              aria-label="Abtastrate"
              label="Abtastrate"
              defaultValue={16000}
              value={settings.sampling_rate}
              allowDecimal={false}
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
              aria-label="Buffergröße"
              label="Buffergröße"
              defaultValue={0.2}
              value={settings.buffer_size}
              decimalScale={3}
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
              aria-label="Chunksize"
              label="Chunksize"
              defaultValue={1024}
              value={settings.chunk_size}
              allowDecimal={false}
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
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
