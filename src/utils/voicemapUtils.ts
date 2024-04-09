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
          score: 0,
          meanF: 0,
          stdevF: 0,
          hnr: 0,
          localJitter: 0,
          localAbsoluteJitter: 0,
          rapJitter: 0,
          ppq5Jitter: 0,
          ddpJitter: 0,
          localShimmer: 0,
          localdbShimmer: 0,
          apq3Shimmer: 0,
          aqpq5Shimmer: 0,
          apq11Shimmer: 0,
          ddaShimmer: 0,
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
