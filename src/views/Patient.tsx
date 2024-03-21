import { useEffect, useState } from "react";
import { SocketProp } from "../types/SocketProp.types";
import VoicemapMinimal from "../components/map/VoicemapMinimal";

export default function Patient({ socket }: SocketProp) {
  // UGLY solution to listen to state changes from another tab!!
  // useAppSelector does not work in this component, although localStorage changes are synced to other tabs
  const [voicemap, setVoicemap] = useState(
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:voicemap") || "null")?.value ||
        "null"
    )
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "persist:voicemap") {
        const newValue = JSON.parse(e.newValue!);
        setVoicemap(JSON.parse(newValue.value));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <VoicemapMinimal
      datamap={voicemap.datamap}
      annotation={voicemap.annotation}
      maxScore={50}
    />
  );
}
