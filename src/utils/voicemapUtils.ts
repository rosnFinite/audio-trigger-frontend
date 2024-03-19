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
        y: 0,
      });
    }
    grid.push({
      id: i.toString(),
      data: data,
    });
  }
  return grid;
}

function generateLowerBounds(
  dbSettings: MapSettings,
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
    lowerBounds.freq.push(i.toFixed(2).toString().replace(".", ""));
  }
  for (let i = dbSettings.lower; i <= dbSettings.upper; i += dbSettings.steps) {
    lowerBounds.dba.push(i.toString());
  }
  return lowerBounds;
}

export { generateEmptyGrid, generateLowerBounds };
