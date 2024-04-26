import { Modal, Stack, Image, Group, Button } from "@mantine/core";
import { useAppSelector } from "../../redux/hooks";
import { getRecordingBySelectionId } from "../../utils/selectionUtils";
import { getRestBaseUrlForRecording } from "../../utils/apiUtils";

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
  const recordings = useAppSelector(
    (state) => state.voicemap.values.recordings
  );
  const fieldBinNames = useAppSelector(
    (state) => state.voicemap.values.fieldBinNames
  );
  const saveLocation = useAppSelector(
    (state) => state.settings.values.save_location
  );

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
  const freq =
    fieldBinNames.freq[recording.freqBin].slice(0, -2) +
    "." +
    fieldBinNames.freq[recording.freqBin].slice(-2) +
    " Hz";
  const db = fieldBinNames.dba[recording.dbaBin] + " dB";

  if (recording === undefined) {
    return null;
  }
  return (
    <Modal
      size="auto"
      title={db + " / " + freq + " / " + recording.qScore}
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
              <Button size="lg" color="green" onClick={}>
                Akzeptieren
              </Button>
              <Button size="lg" color="red" onClick={onClose}>
                Löschen
              </Button>
            </>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
