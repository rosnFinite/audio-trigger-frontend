interface Stats {
  meanF: number;
  stdevF: number;
  hnr: number;
  localJitter: number;
  localAbsoluteJitter: number;
  rapJitter: number;
  ppq5Jitter: number;
  ddpJitter: number;
  localShimmer: number;
  localdbShimmer: number;
  apq3Shimmer: number;
  aqpq5Shimmer: number;
  apq11Shimmer: number;
  ddaShimmer: number;
}

interface RecordingStats extends Stats {
  freqBin: number;
  dbaBin: number;
  qScore: string;
  timestamp: string;
  accepted: boolean;
}

interface VoiceStats extends Stats {
  score: number;
}

interface VoiceField {
  id: string;
  data: {
    x: number;
    y: VoiceStats;
  }[];
}

interface BinSettings {
  lower: number;
  upper: number;
  steps: number;
}

interface ColorSetting {
  min: number;
  max: number;
  type: string;
  scheme: string;
  divergeAt?: number;
}
interface StatColorSettings {
  score: ColorSetting;
  meanF: ColorSetting;
  stdevF: ColorSetting;
  hnr: ColorSetting;
  localJitter: ColorSetting;
  localAbsoluteJitter: ColorSetting;
  rapJitter: ColorSetting;
  ppq5Jitter: ColorSetting;
  ddpJitter: ColorSetting;
  localShimmer: ColorSetting;
  localdbShimmer: ColorSetting;
  apq3Shimmer: ColorSetting;
  aqpq5Shimmer: ColorSetting;
  apq11Shimmer: ColorSetting;
  ddaShimmer: ColorSetting;
}

interface VoiceState {
  dbaSettings: BinSettings;
  freqSettings: BinSettings;
  fieldBinNames: {
    freq: string[];
    dba: string[];
  };
  color: ColorSettings;
  annotation: {
    id: string;
    text: string;
  };
  recordings: RecordingStats[];
  field: VoiceField[];
}
