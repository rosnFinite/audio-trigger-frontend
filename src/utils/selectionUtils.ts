const getRecordingBySelectionId = (recordings: RecordingStats[], selectionId: string, fieldBinNames: {freq: string[]; dba: string[]}): RecordingStats => {
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

const getRecordingByBinIndex = (recordings: RecordingStats[], dbBin: number, freqBin: number): RecordingStats => {
  const recording = recordings[
    recordings.findIndex(
      (item) => item.dbaBin === dbBin && item.freqBin === freqBin
    )
  ];
  return recording;
};

function getVoiceFieldDataByKey(data: VoiceField[], key: string): VoiceFieldScalarData[] {
  const result = data.map((item) => ({
    id: item.id,
    data: item.data.map((d: { x: number; y: VoiceStats }) => ({
      x: d.x,
      y: d.y[key as keyof VoiceStats] as number,
    })),
  }));
  return result;
}


function getMinMaxScore(
  voicefield: VoiceField[],
  stat: keyof VoiceStats
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;

  for (const field of voicefield) {
    for (const data of field.data) {
      const value = data.y[stat];
      if (value != null) {
        if (value < min) {
          min = value;
        }
        if (value > max) {
          max = value;
        }
      }
    }
  }
  return { min, max };
}

export { getRecordingBySelectionId, getRecordingByBinIndex, getVoiceFieldDataByKey, getMinMaxScore};