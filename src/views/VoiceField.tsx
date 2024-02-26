import { useEffect } from "react";
import {Socket} from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initialize } from "../components/map/voicemapDataSlice";
import NivoVoicemap from "../components/map/NivoVoicemap";
import { Blockquote, Button, Center, Divider, Stack, Title } from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";
import { Link } from "react-router-dom";
import ControlButtonGroup from "../components/ControlButtonGroup";

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
      <ControlButtonGroup />
      <NivoVoicemap />
    </Stack>
  )
}