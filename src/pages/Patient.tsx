import { useEffect, useState } from "react";
import VoicemapMinimal from "../components/field/VoiceFieldMinimal";

export default function Patient() {
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
        console.log("storage", storage.values);
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

  return (
    <VoicemapMinimal field={voicemap.field} annotation={voicemap.annotation} />
  );
}
