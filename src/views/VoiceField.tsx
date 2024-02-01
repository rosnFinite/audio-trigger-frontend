import Grid from "../components/grid/Grid";
import {io, Socket} from "socket.io-client";
import {useEffect, useState} from "react";

export default function VoiceField() {
  const [socketInstance, setSocketInstance] = useState<Socket>();
  const socket = io("localhost:5001/")

  useEffect(() => {
    socket.connect()
    socket.on("connect_error", (err) => {
      console.log(err.message);
    })
    setSocketInstance(socket);
    return () => {
      if (socket.connected) { // <-- This is important
          socket.close();
      }
    }
  }, []);

  return (
    <Grid numCols={35} numRows={15} h={"100vh"} size={"95%"} socket={socketInstance}/>
  )
}