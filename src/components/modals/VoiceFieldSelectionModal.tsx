import { Modal } from "@mantine/core";
import { useAppSelector } from "../../redux/hooks";
import Recording from "../recording/Recording";

interface VoiceFieldSelectionModalProps {
  selectionId: string;
  opened: boolean;
  onClose: () => void;
}

const findRecordingBySelectionId = (recordings: RecordingStats[], selectionId: string, fieldBinNames: {freq: string[]; dba: string[]}) => {
  const splittedId = selectionId.split(".");
  const db = splittedId[0];
  const freq = splittedId[1];
  const dbBin = fieldBinNames.dba.findIndex((item) => item === db);
  const freqBin = fieldBinNames.freq.findIndex((item) => item === freq);
  const recording = recordings[
    recordings.findIndex(
      (item) => item.dbaBin === dbBin && item.freqBin === freqBin
    )
  ];
  return recording;
}


export default function VoiceFieldSelectionModal({selectionId, opened, onClose}: VoiceFieldSelectionModalProps) {
  const recordings = useAppSelector((state) => state.voicemap.values.recordings);
  const fieldBinNames = useAppSelector((state) => state.voicemap.values.fieldBinNames);

  const recording = findRecordingBySelectionId(recordings, selectionId, fieldBinNames);

  if (recording === undefined) {
    return null;
  }
  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false}>
      <Recording freqBin={recording.freqBin} dbaBin={recording.dbaBin} acceptable={!recording.accepted} />
    </Modal>
  );
}