import { useEffect } from "react";
import Voicemap from "../components/map/Voicemap";
import {Socket} from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initialize } from "../components/map/voicemapDataSlice";

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
    <Voicemap />
  )
}