export interface Settings {
  status: {
    recorder: string;
    trigger: string;
  };
  device: string;
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