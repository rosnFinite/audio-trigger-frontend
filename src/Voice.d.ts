interface Stats {
  meanF: number | null;
  stdevF: number | null;
  hnr: number | null;
  localJitter: number | null;
  localAbsoluteJitter: number | null;
  rapJitter: number | null;
  ppq5Jitter: number | null;
  ddpJitter: number | null;
  localShimmer: number | null;
  localdbShimmer: number | null;
  apq3Shimmer: number | null;
  aqpq5Shimmer: number | null;
  apq11Shimmer: number | null;
  ddaShimmer: number | null;
}

type NonNullableStats = {
  [Property in keyof Stats]: number;
};

interface RecordingStats extends NonNullableStats {
  freqBin: number;
  dbaBin: number;
  qScore: string;
  timestamp: string;
  accepted: boolean;
}

interface VoiceStats extends Stats {
  score: number | null;
}

interface VoiceField {
  id: string;
  data: {
    x: number;
    y: VoiceStats;
  }[];
}

interface VoiceFieldScalarData {
  id: string;
  data: {
    x: number;
    y: number;
  }[];
}

interface BinSettings {
  lower: number;
  upper: number;
  steps: number;
}

interface ColorSetting {
  type: string;
  scheme: string;
  min?: number;
  max?: number;
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
  color: StatColorSettings;
  annotation: {
    id: string;
    text: string;
  };
  recordings: RecordingStats[];
  field: VoiceField[];
}
