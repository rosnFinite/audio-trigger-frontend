import { Modal, Stack, Image } from "@mantine/core";
import { useAppSelector } from "../../redux/hooks";
import { getRecordingBySelectionId } from "../../utils/selectionUtils";

interface VoiceFieldSelectionModalProps {
  selectionId: string;
  opened: boolean;
  onClose: () => void;
}

export default function VoiceFieldSelectionModal({selectionId, opened, onClose}: VoiceFieldSelectionModalProps) {
  const recordings = useAppSelector((state) => state.voicemap.values.recordings);
  const fieldBinNames = useAppSelector((state) => state.voicemap.values.fieldBinNames);

  const recording = getRecordingBySelectionId(recordings, selectionId, fieldBinNames);

  if (recording === undefined) {
    return null;
  }
  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false}>
      <Stack>
      </Stack>
    </Modal>
  );
}