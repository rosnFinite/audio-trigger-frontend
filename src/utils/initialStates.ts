import { generateVoicemapBinNames } from "./voicemapUtils";

export const initialSettingsState: SettingsState = {
  sid: "",
  patient: "",
  save_location: "",
  status: "offline",
  device: -1,
  sampling_rate: 16000,
  buffer_size: 0.2,
  chunk_size: 1024,
  mono: false,
  calibration_file: "",
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
  min_score: 0.7,
  retrigger_percentage_improvement: 0.5,
};

export const initialVoiceState: VoiceState = {
  dbaSettings: { lower: 35, upper: 115, steps: 5 },
  freqSettings: { lower: 55, upper: 1700, steps: 2 },
  fieldBinNames: generateVoicemapBinNames(
    { lower: 35, upper: 115, steps: 5 },
    { lower: 55, upper: 1700, steps: 2 }
  ),
  color: {
    score: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    meanF: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    stdevF: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    hnr: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    localJitter: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    localAbsoluteJitter: {
      min: -1,
      max: -1,
      type: "diverging",
      scheme: "blues",
    },
    rapJitter: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    ppq5Jitter: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    ddpJitter: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    localShimmer: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    localdbShimmer: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    apq3Shimmer: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    aqpq5Shimmer: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    apq11Shimmer: { min: -1, max: -1, type: "diverging", scheme: "blues" },
    ddaShimmer: { min: -1, max: -1, type: "diverging", scheme: "blues" },
  },
  annotation: { id: "", text: "" },
  recordings: [],
  field: [],
};
