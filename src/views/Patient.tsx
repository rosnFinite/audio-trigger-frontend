import React from "react";
import Voicemap from "../components/map/Voicemap";
import { SocketProp } from "../types/SocketProp.types";

export default function Patient({ socket }: SocketProp) {
  return <Voicemap socket={socket} width="100vw" height="100vh" />;
}
