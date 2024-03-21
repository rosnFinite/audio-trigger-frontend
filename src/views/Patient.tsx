import React from "react";
import { SocketProp } from "../types/SocketProp.types";
import VoicemapMinimal from "../components/map/VoicemapMinimal";

export default function Patient({ socket }: SocketProp) {
  return <VoicemapMinimal />;
}
