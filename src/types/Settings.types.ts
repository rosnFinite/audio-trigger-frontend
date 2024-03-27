export interface Settings {
  sid: string;
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
  frequency: {
    lower: number;
    upper: number;
    steps: number;
  };
  db: {
    lower: number;
    upper: number;
    steps: number;
  };
  qualityScore: number;
}
