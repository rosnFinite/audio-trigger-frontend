interface BinSettings {
  lower: number;
  upper: number;
  steps: number;
}

interface SettingsState {
  sid: string;
  patient: string;
  save_location: string;
  status: string;
  device: number;
  sampling_rate: number;
  buffer_size: number;
  chunk_size: number;
  mono: boolean;
  calibration_file: string;
  frequency: BinSettings;
  db: BinSettings;
  min_score: number;
  retrigger_percentage_improvement: number;
}
