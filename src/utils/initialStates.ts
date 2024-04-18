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
