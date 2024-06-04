import { useEffect, useState } from "react";
import VoicemapMinimal from "../components/field/VoiceFieldMinimal";
import { Stack } from "@mantine/core";
import QualityIndicator from "../components/QualityIndicator";
import { useWebSocketCtx } from "../context";

export default function Patient() {
  const { socket } = useWebSocketCtx();
  const [score, setScore] = useState(0);
  // UGLY solution to listen to state changes from another tab!!
  // useAppSelector does not work in this component, although localStorage changes are synced to other tabs
  const [voicemap, setVoicemap] = useState(
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:voicemap") || "null")?.values ||
        null
    )
  );
  const [settings, setSettings] = useState(
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:settings") || "null")?.values ||
        null
    )
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "persist:voicemap" && e.newValue !== null) {
        const storage = JSON.parse(e.newValue!);
        setVoicemap(JSON.parse(storage.values));
      }
      if (e.key === "persist:settings" && e.newValue !== null) {
        const storage = JSON.parse(e.newValue!);
        setSettings(JSON.parse(storage.values));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    console.log("voicemap", voicemap);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    const voiceHandler = (data: any) => {
      console.log("voice", data);
      setScore(data.score);
    };

    socket.on("voice", voiceHandler);

    return () => {
      socket.off("voice", voiceHandler);
    };
  }, []);

  return (
    <Stack>
      <VoicemapMinimal
        field={voicemap.field}
        annotation={voicemap.annotation}
      />
      <QualityIndicator
        fluid
        size="xl"
        value={score}
        triggerThreshold={settings.min_score}
        isPatientView
        status={settings.status}
      />
    </Stack>
  );
}
