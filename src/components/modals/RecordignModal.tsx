import { Modal, Stack, Image, Group, Button, Center } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getRecordingBySelectionId } from "../../utils/selectionUtils";
import { getRestBaseUrlForRecording } from "../../utils/apiUtils";
import { useEffect, useState } from "react";
import { useWebSocketCtx } from "../../context";

interface VoiceFieldSelectionModalProps {
  selectionId: string;
  opened: boolean;
  onClose: () => void;
}

export default function RecordingModal({
  selectionId,
  opened,
  onClose,
}: VoiceFieldSelectionModalProps) {
  // needed for requesting removing recording from voice field on the backend
  const { socket } = useWebSocketCtx();
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
  const [recording, setRecording] = useState<RecordingStats | undefined>();
  const [apiRecordingBaseUrl, setApiRecordingBaseUrl] = useState<
    string | null
  >();

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
    const tmp_recording = getRecordingBySelectionId(
      recordings,
      selectionId,
      fieldBinNames
    );
    setApiRecordingBaseUrl(
      getRestBaseUrlForRecording(
        saveLocation,
        fieldBinNames.dba.length - tmp_recording?.dbaBin - 1,
        tmp_recording?.freqBin
      )
    );
    setRecording(tmp_recording);
    setFrequency(freq());
    setDecibel(fieldBinNames.dba[tmp_recording?.dbaBin] + " dB");
  }, [recording, selectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (recording === undefined) {
    return null;
  }
  return (
    <Modal
      size="70%"
      title={decibel + " / " + frequency + " / " + recording.qScore}
      opened={opened}
      onClose={onClose}
    >
      <Stack>
        <Center>
          <Image
            src={`${apiRecordingBaseUrl}\\image_grid.png`}
            h={"90%"}
            w={"90%"}
          />
        </Center>
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
