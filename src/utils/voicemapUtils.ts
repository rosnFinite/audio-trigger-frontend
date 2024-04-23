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

export { generateEmptyGrid, generateVoicemapBinNames };
