import { useEffect, useState } from "react";
import VoicemapMinimal from "../components/map/VoicemapMinimal";

export default function Patient() {
  // UGLY solution to listen to state changes from another tab!!
  // useAppSelector does not work in this component, although localStorage changes are synced to other tabs
  const [voicemap, setVoicemap] = useState(
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:voicemap") || "null")?.value ||
        "null"
    )
  );
  const [settings, setSettings] = useState(
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:settings") || "null")?.values ||
        "null"
    )
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "persist:voicemap") {
        const newValue = JSON.parse(e.newValue!);
        setVoicemap(JSON.parse(newValue.value));
      }
      if (e.key === "persist:settings") {
        const newValue = JSON.parse(e.newValue!);
        setSettings(JSON.parse(newValue.values));
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
      maxScore={1}
      minScore={settings.minScore}
    />
  );
}
