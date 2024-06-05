interface BinSettings {
  lower: number;
  upper: number;
  steps: number;
}

interface CalibrationData {
  [key: string]: number[];
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
  calibration_data: CalibrationData | null;
  retrigger_percentage_improvement: number;
}
