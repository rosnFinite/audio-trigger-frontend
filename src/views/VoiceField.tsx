import Grid from "../components/grid/Grid";
import {Socket} from "socket.io-client";

interface VoiceFieldProps {
  socket: Socket
}

export default function VoiceField({socket}: VoiceFieldProps) {
  return (
    <Grid numCols={33} numRows={14} h={"100vh"} size={"95%"} socket={socket} />
  )
}