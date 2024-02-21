import {createSlice} from "@reduxjs/toolkit";

interface Settings {
  status: string;
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

const initialSettings: Settings = {
  status: "offline",
  device: "-1",
  sampleRate: 44100,
  bufferSize: 0.2,
  chunkSize: 1024,
  mono: false,
  calibrationFile: "",
  frequency: {
    lower: 55,
    upper: 1600,
    steps: 2
  },
  db: {
    lower: 35,
    upper: 115,
    steps: 5
  },
  qualityScore: 50
};

export const settingsDataSlice = createSlice({
  name: "settings",
  initialState: {
    value:  initialSettings
  },
  reducers: {
    initialize: (state, action) => {
      state.value = initialSettings;
    },
    updateSettings: (state, action) => {
      state.value = {...state.value, ...action.payload};
    }
  }
})

export const { initialize } = settingsDataSlice.actions;
export default settingsDataSlice.reducer;