import React, {useEffect, useState} from 'react';
import '@mantine/core/styles.css';
import {Accordion, Blockquote, Button, Checkbox, Container, Divider, FileInput, Group, NativeSelect, NumberInput, Stack, Title, Text} from "@mantine/core";
import { TbInfoCircle, TbMicrophone2, TbFlagExclamation, TbArrowBackUp, TbCheck, TbJson } from "react-icons/tb";

export default function Settings() {

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
              <NativeSelect label="Aufnahmegerät" description="Falls angeschlossen wird standardmäßig das EGG-Gerät (iMic) ausgewählt, sont muss hier ein Eingabegerät ausgewählt werden." data={[]}/>
              <Group grow>
                <NumberInput 
                  label="Sampling rate [Hz]" 
                  defaultValue={44100}
                  placeholder='44100'
                  withAsterisk 
                  hideControls 
                />
                <NumberInput 
                  label="Buffergröße [Sek.]" 
                  defaultValue={0.2}
                  placeholder='0.2'
                  withAsterisk 
                  hideControls 
                />
                <NumberInput 
                  label="Chunksize" 
                  defaultValue={1024}
                  placeholder='1024'
                  withAsterisk 
                  hideControls 
                />
              </Group>
              <Blockquote color='red' icon={<TbInfoCircle size={"25"}/>} mt="xs" pt={10} pb={10}>
                Beim Aktivieren des Monosignals werden keine EGG-Daten aufgezeichnet.
              </Blockquote>
              <Checkbox 
                label="Monosignal (1 Kanal)"
                size='md'
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
                  placeholder='55'
                  withAsterisk 
                  hideControls 
                />
                <NumberInput 
                  label="Frequenz Hz [obere Grenze]"
                  description="Obere Grenze des relevanten Frequenzbereichs"
                  defaultValue={1600}
                  placeholder='1600'
                  withAsterisk 
                  hideControls 
                />
                <NumberInput 
                  label="Halbtonschritte"
                  description="Größe der zusammengefassten Frequenzbereiche" 
                  defaultValue={2}
                  placeholder='2'
                  withAsterisk 
                  hideControls 
                />
              </Group>
              <Group grow>
                <NumberInput 
                  label="dB(A) [untere Grenze]" 
                  description="Untere Grenze des relevanten Schalldruckpegels"
                  defaultValue={35}
                  placeholder='35'
                  withAsterisk 
                  hideControls 
                />
                <NumberInput 
                  label="dB(A) [obere Grenze]"
                  description="Obere Grenze des relevanten Schalldruckpegels"
                  defaultValue={115}
                  placeholder='115'
                  withAsterisk 
                  hideControls 
                />
                <NumberInput 
                  label="dB(A)-Schritte"
                  description="Größe der zusammengefassten Schalldruckpegelbereiche" 
                  defaultValue={5}
                  placeholder='5'
                  withAsterisk 
                  hideControls 
                />
              </Group>
              <Text fw={700}>Triggerschwelle</Text>
              <Divider />
              <Container ml={0} pl={0}>
                <NumberInput 
                  label="Oberer Quality Score"
                  description="ZU unterschreitender Quality Score, um einen Trigger auszulösen" 
                  defaultValue={50}
                  placeholder='50'
                  withAsterisk 
                  hideControls 
                />
              </Container>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group justify='center'>
        <Button rightSection={<TbCheck size={"20"}/>}>Anwenden</Button>
        <Button color='red' rightSection={<TbArrowBackUp size={"20"} />}>Zurücksetzen</Button>
      </Group>
    </Stack>
  );
}

