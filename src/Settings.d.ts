interface BinSettings {
  lower: number;
  upper: number;
  steps: number;
}

interface SettingsState {
  sid: string;
  patient: string;
  save_location: string;
  status: {
    recorder: string;
    trigger: string;
  };
  device: number;
  sampleRate: number;
  bufferSize: number;
  chunkSize: number;
  mono: boolean;
  calibrationFile: string;
  frequency: BinSettings;
  db: BinSettings;
  minScore: number;
  retriggerPercentageImprovement: number;
}
