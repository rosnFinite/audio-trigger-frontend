export const initialSettingsState: SettingsState = {
  sid: "",
  patient: "",
  save_location: "",
  status: {
    recorder: "offline",
    trigger: "offline",
  },
  device: -1,
  sampleRate: 16000,
  bufferSize: 0.2,
  chunkSize: 1024,
  mono: false,
  calibrationFile: "",
  frequency: {
    lower: 55,
    upper: 1600,
    steps: 2,
  },
  db: {
    lower: 35,
    upper: 115,
    steps: 5,
  },
  minScore: 0.7,
  retriggerPercentageImprovement: 0.5,
};
