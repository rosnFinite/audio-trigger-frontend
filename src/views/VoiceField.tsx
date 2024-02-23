import { useEffect } from "react";
import Voicemap from "../components/map/Voicemap";
import {Socket} from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initialize } from "../components/map/voicemapDataSlice";
import NivoVoicemap from "../components/map/NivoVoicemap";
import { Blockquote, Button, Center, Divider, Group, Stack, Title, Tooltip } from "@mantine/core";
import { TbInfoCircle, TbPlayerRecord, TbPlayerStop, TbProgressX } from "react-icons/tb";
import { Link } from "react-router-dom";

interface VoiceFieldProps {
  socket: Socket
}

export default function VoiceField({socket}: VoiceFieldProps) {
  const voicemapData = useAppSelector((state) => state.voicemap.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("voice", (data) => {});
    socket.on("trigger", (data) => {
      if (voicemapData.length === 0) {
        //initialize store 
        dispatch(initialize([data]));
      } else {
        //update voicemapData
      }
    });
  }, []);
  
  return (
    <Stack h={"100%"}>
      <Title order={2}>Stimmfeld</Title>
      <Divider my="xs"/>
      <Blockquote color='blue' icon={<TbInfoCircle size={"25"}/>} mt="xs" pt={10} pb={10}>
        Über die Schaltfläche 'Patientenansicht' wird ein neuer Tab geöffnet, in dem die Patientenansicht angezeigt wird.
        Diese beinhaltet ausschließlich das Stimmfeld und keine weiteren Schaltflächen.
      </Blockquote>
      <Center>
        <Link to="/patient-view">
          <Button>
            Patientenansicht
          </Button>
        </Link>
      </Center>
      <Group justify="center" gap={"xs"}>
        <Tooltip label="Startet den Triggerprozess">
          <Button variant="outline" leftSection={<TbPlayerRecord size={"1.5rem"} />}>
            Start
          </Button>
        </Tooltip>
        <Tooltip label="Stoppt den Triggerprozess">
          <Button variant="outline" leftSection={<TbPlayerStop size={"1.5rem"} />}>
            Stop
          </Button>
        </Tooltip>
        <Tooltip label="Setzt das gesamte Stimmfeld zurück">
          <Button variant="outline" leftSection={<TbProgressX size={"1.5rem"}/>}>
            Reset
          </Button>
        </Tooltip>
      </Group>
      <NivoVoicemap />
    </Stack>
  )
}