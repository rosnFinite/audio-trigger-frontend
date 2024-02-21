import React, {useEffect, useState} from 'react';
import '@mantine/core/styles.css';
import {Accordion, Blockquote, Button, Checkbox, Container, Divider, FileInput, Group, NativeSelect, NumberInput, Stack, Title, Text} from "@mantine/core";
import { TbInfoCircle, TbMicrophone2, TbFlagExclamation, TbArrowBackUp, TbCheck, TbJson } from "react-icons/tb";
import axios from "axios";
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const initialDevices = [{label:"Automatisch erkennen", value: "-1"}];

export default function Settings() {
  const [devices, setDevices] = useState(initialDevices);
  const settings = useAppSelector((state) => state.settings.value);
  const dispatch = useAppDispatch(); 

  // TODO: Überlegen ob es besser ist Einstellungen nur nach drücken des Knopfes und nicht
  // bei jeder Änderung zu speichern

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5001/devices');
        const data = response.data;
        // transform data to match the format of the NativeSelect component
        const tranformed = data.devices.map((device: any) => {
          return {
            label: device.name,
            value: device.id
          }
        });
        // reset to initial devices state on first component render, then add the loaded devices
        setDevices([...initialDevices, ...tranformed]);
      } catch (error: any) {
        console.log("Fehler beim Laden der angeschlossenen Geräte: " + error.message);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    console.log("Settings changed");
    console.log(settings);
  }, [settings]);

  useEffect(() => {
    console.log("Devices changed");
    console.log(devices);
  }, [devices]);

  return (
    <Stack
      h="100vh"
    >
      <Title order={2}>
        Einstellungen
      </Title>
      <Divider my="md"/>
      <Accordion multiple defaultValue={["Audioaufnahme", "Trigger"]} variant='separated'>
        <Accordion.Item value="Audioaufnahme">
          <Accordion.Control icon={<TbMicrophone2 />}>
            Audioaufnahme
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <NativeSelect 
                label="Aufnahmegerät" 
                description="Falls angeschlossen wird standardmäßig das EGG-Gerät (iMic) ausgewählt, sont muss hier ein Eingabegerät ausgewählt werden." 
                data={devices}
                onChange={(event) => {
                  dispatch({type: "settings/updateSettings", payload: {device: event.currentTarget.value}});
                }}
              />
              <Group grow>
                <NumberInput 
                  label="Sampling rate [Hz]" 
                  defaultValue={44100}
                  value={settings.sampleRate}
                  placeholder="44100"
                  withAsterisk 
                  hideControls 
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {sampleRate: Number(event.value)}});
                  }}
                />
                <NumberInput 
                  label="Buffergröße [Sek.]" 
                  defaultValue={0.2}
                  value={settings.bufferSize}
                  placeholder='0.2'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {bufferSize: Number(event.value)}});
                  }} 
                />
                <NumberInput 
                  label="Chunksize" 
                  defaultValue={1024}
                  value={settings.chunkSize}
                  placeholder='1024'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {chunkSize: Number(event.value)}});
                  }} 
                />
              </Group>
              <Blockquote color='red' icon={<TbInfoCircle size={"25"}/>} mt="xs" pt={10} pb={10}>
                Beim Aktivieren des Monosignals werden keine EGG-Daten aufgezeichnet.
              </Blockquote>
              <Checkbox 
                label="Monosignal (1 Kanal)"
                checked={settings.mono}
                size='md'
                onChange={(event) => {
                  dispatch({type: "settings/updateSettings", payload: {mono: event.currentTarget.checked}});
                }}
              />
              <Blockquote color='yellow' icon={<TbInfoCircle size={"25"}/>} mt="xs" pt={10} pb={10}>
                Soll das Mikrofon zusätzlich als Dezibelmessgerät verwendet werden, muss zur Gewährleistung einer möglichst hohen Messgenauigkeit eine zugehörige Kalibrierungdatei beigefügt werden.
              </Blockquote>
              <Container ml={0} pl={0}>
                <FileInput 
                  label="Kalibrierungsdatei" 
                  accept=".json" 
                  description="Kalibrierungsdatei für das Mikrofon (.json)"
                  placeholder="Datei auswählen"
                  rightSection={<TbJson size={"20"}/>}
                />
              </Container>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Trigger">
        <Accordion.Control icon={<TbFlagExclamation />}>
            Trigger
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Text fw={700}>Stimmfeld</Text>
              <Divider />
              <Blockquote color='blue' icon={<TbInfoCircle size={"25"}/>} mt="xs" pt={10} pb={10}>
                Definition des zu erfassenden Stimmfeldes. Hieraus resultiert die Größe der unter "Stimmfeld" dargestellten Heatmap.
              </Blockquote>
              <Group grow>
                <NumberInput 
                  label="Frequenz Hz [untere Grenze]" 
                  description="Untere Grenze des relevanten Frequenzbereichs"
                  defaultValue={55}
                  value={settings.frequency.lower}
                  placeholder='55'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {frequency: {...settings.frequency, lower: Number(event.value)}}});
                  }} 
                />
                <NumberInput 
                  label="Frequenz Hz [obere Grenze]"
                  description="Obere Grenze des relevanten Frequenzbereichs"
                  defaultValue={1600}
                  value={settings.frequency.upper}
                  placeholder='1600'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {frequency: {...settings.frequency, upper: Number(event.value)}}});
                  }}  
                />
                <NumberInput 
                  label="Halbtonschritte"
                  description="Größe der zusammengefassten Frequenzbereiche" 
                  defaultValue={2}
                  value={settings.frequency.steps}
                  placeholder='2'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {frequency: {...settings.frequency, steps: Number(event.value)}}});
                  }}  
                />
              </Group>
              <Group grow>
                <NumberInput 
                  label="dB(A) [untere Grenze]" 
                  description="Untere Grenze des relevanten Schalldruckpegels"
                  defaultValue={35}
                  value={settings.db.lower}
                  placeholder='35'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {db: {...settings.db, lower: Number(event.value)}}});
                  }}  
                />
                <NumberInput 
                  label="dB(A) [obere Grenze]"
                  description="Obere Grenze des relevanten Schalldruckpegels"
                  defaultValue={115}
                  value={settings.db.upper}
                  placeholder='115'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {db: {...settings.db, upper: Number(event.value)}}});
                  }} 
                />
                <NumberInput 
                  label="dB(A)-Schritte"
                  description="Größe der zusammengefassten Schalldruckpegelbereiche" 
                  defaultValue={5}
                  value={settings.db.steps}
                  placeholder='5'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {db: {...settings.db, steps: Number(event.value)}}});
                  }} 
                />
              </Group>
              <Text fw={700}>Triggerschwelle</Text>
              <Divider />
              <Container ml={0} pl={0}>
                <NumberInput 
                  label="Oberer Quality Score"
                  description="ZU unterschreitender Quality Score, um einen Trigger auszulösen" 
                  defaultValue={50}
                  value={settings.qualityScore}
                  placeholder='50'
                  withAsterisk 
                  hideControls
                  onValueChange={(event) => {
                    dispatch({type: "settings/updateSettings", payload: {qualityScore: Number(event.value)}});
                  }} 
                />
              </Container>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group justify='center'>
        <Button
          color='green' 
          rightSection={<TbCheck size={"20"}/>}
        >
          Aufnahme starten
        </Button>
        <Button 
          color='red' 
          rightSection={<TbArrowBackUp size={"20"} />}
          onClick={() => {
            dispatch({type: "settings/initialize", payload: {}});
          }}
        >
          Zurücksetzen
        </Button>
      </Group>
    </Stack>
  );
}

