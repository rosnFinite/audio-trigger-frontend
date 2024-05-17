import { Modal, Stack, Image, Group, Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getRecordingBySelectionId } from "../../utils/selectionUtils";
import { getRestBaseUrlForRecording } from "../../utils/apiUtils";
import { useContext, useEffect, useState } from "react";
import SocketContext from "../../context/SocketContext";

interface VoiceFieldSelectionModalProps {
  selectionId: string;
  opened: boolean;
  onClose: () => void;
}

export default function VoiceFieldSelectionModal({
  selectionId,
  opened,
  onClose,
}: VoiceFieldSelectionModalProps) {
  // needed for requesting removing recording from voice field on the backend
  const socket = useContext(SocketContext);
  const recordings = useAppSelector(
    (state) => state.voicemap.values.recordings
  );
  const fieldBinNames = useAppSelector(
    (state) => state.voicemap.values.fieldBinNames
  );
  const saveLocation = useAppSelector(
    (state) => state.settings.values.save_location
  );
  const dispatch = useAppDispatch();
  const [frequency, setFrequency] = useState<string | null>(null);
  const [decibel, setDecibel] = useState<string | null>(null);
  const recording = getRecordingBySelectionId(
    recordings,
    selectionId,
    fieldBinNames
  );
  const apiRecordingBaseUrl = getRestBaseUrlForRecording(
    saveLocation,
    fieldBinNames.dba.length - recording?.dbaBin - 1,
    recording?.freqBin
  );
  const freq = () => {
    if (recording === undefined) {
      return null;
    } else {
      return (
        fieldBinNames.freq[recording?.freqBin].slice(0, -2) +
        "." +
        fieldBinNames.freq[recording?.freqBin].slice(-2) +
        " Hz"
      );
    }
  };

  useEffect(() => {
    setFrequency(freq());
    setDecibel(fieldBinNames.dba[recording?.dbaBin] + " dB");
  }, [recording]);

  if (recording === undefined) {
    return null;
  }
  return (
    <Modal
      size="auto"
      title={decibel + " / " + frequency + " / " + recording.qScore}
      opened={opened}
      onClose={onClose}
    >
      <Stack>
        <Image
          src={`${apiRecordingBaseUrl}\\spectrogram_intensity.png`}
          h={850}
          w={850}
        />
        <Group grow>
          {recording.accepted ? (
            <Button size="lg" color="red" onClick={onClose}>
              Löschen
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                color="green"
                onClick={() => {
                  dispatch({
                    type: "voicemap/ACCEPT_RECORDING",
                    payload: {
                      freqBin: recording.freqBin,
                      dbaBin: recording.dbaBin,
                    },
                  });
                  onClose();
                }}
              >
                Akzeptieren
              </Button>
              <Button
                size="lg"
                color="red"
                onClick={() => {
                  if (!socket) {
                    console.error("Socket is not initialized");
                    return;
                  }
                  socket.emit("remove_recording_request", {
                    freqBin: recording.freqBin,
                    dbaBin: fieldBinNames.dba.length - recording.dbaBin - 1,
                  });
                  dispatch({
                    type: "voicemap/REMOVE_RECORDING",
                    payload: {
                      freqBin: recording.freqBin,
                      dbaBin: recording.dbaBin,
                    },
                  });
                  onClose();
                }}
              >
                Löschen
              </Button>
            </>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
