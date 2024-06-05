interface MapSettings {
  lower: number;
  upper: number;
  steps: number;
}

function generateEmptyGrid(dbSettings: MapSettings, freqSettings: MapSettings) {
  let grid = [];
  for (let i = dbSettings.upper; i >= dbSettings.lower; i -= dbSettings.steps) {
    let data = [];

    for (
      let j = freqSettings.lower;
      j <= freqSettings.upper;
      j *= Math.pow(2, 2 / 12)
    ) {
      data.push({
        x: j.toFixed(2).toString().replace(".", ""),
        y: {
          score: null,
          accepted: null,
          meanF: null,
          stdevF: null,
          hnr: null,
          localJitter: null,
          localAbsoluteJitter: null,
          rapJitter: null,
          ppq5Jitter: null,
          ddpJitter: null,
          localShimmer: null,
          localdbShimmer: null,
          apq3Shimmer: null,
          aqpq5Shimmer: null,
          apq11Shimmer: null,
          ddaShimmer: null,
        },
      });
    }
    grid.push({
      id: i.toString(),
      data: data,
    });
  }
  return grid;
}

function generateVoicemapBinNames(
  dbaSettings: MapSettings,
  freqSettings: MapSettings
) {
  let lowerBounds: { freq: string[]; dba: string[] } = {
    freq: [],
    dba: [],
  };
  for (
    let i = freqSettings.lower;
    i <= freqSettings.upper;
    i *= Math.pow(2, 2 / 12)
  ) {
    lowerBounds.freq.push(i.toFixed(2).replace(".", ""));
  }
  for (
    let i = dbaSettings.upper;
    i >= dbaSettings.lower;
    i -= dbaSettings.steps
  ) {
    lowerBounds.dba.push(i.toString());
  }
  return lowerBounds;
}

const initialSettingsState: SettingsState = {
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
  calibration_data: null,
};

const initialVoiceState: VoiceState = {
  dbaSettings: { lower: 35, upper: 115, steps: 5 },
  freqSettings: { lower: 55, upper: 1700, steps: 2 },
  fieldBinNames: generateVoicemapBinNames(
    { lower: 35, upper: 115, steps: 5 },
    { lower: 55, upper: 1700, steps: 2 }
  ),
  color: {
    score: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    accepted: {
      min: 0,
      max: 1,
      type: "diverging",
      scheme: "red_yellow_green",
    },
    meanF: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    stdevF: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    hnr: { min: undefined, max: undefined, type: "diverging", scheme: "blues" },
    localJitter: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    localAbsoluteJitter: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    rapJitter: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    ppq5Jitter: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    ddpJitter: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    localShimmer: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    localdbShimmer: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    apq3Shimmer: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    aqpq5Shimmer: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    apq11Shimmer: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
    ddaShimmer: {
      min: undefined,
      max: undefined,
      type: "diverging",
      scheme: "blues",
    },
  },
  annotation: { id: "", text: "" },
  recordings: [],
  field: [],
};

export {
  generateEmptyGrid,
  generateVoicemapBinNames,
  initialSettingsState,
  initialVoiceState,
};
