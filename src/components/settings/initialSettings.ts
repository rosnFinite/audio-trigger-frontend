import { Settings } from "../../types/Settings.types";

export const initialSettings: Settings = {
  status: "offline",
  device: "-1",
  sampleRate: 44100,
  bufferSize: 0.2,
  chunkSize: 1024,
  mono: false,
  calibrationFile: "",
  frequency: {
      lower: 55,
      upper: 1600,
      steps: 2
  },
  db: {
      lower: 35,
      upper: 115,
      steps: 5
  },
  qualityScore: 50
};