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

export const settingsDataSlice = createSlice({
  name: "settings",
  initialState: {
    value:  {} as Settings
  },
  reducers: {
    initialize: (state, action) => {
      state.value = action.payload;
    },
    updateSettings: (state, action) => {
      state.value = {...state.value, ...action.payload};
    }
  }
})

export const { initialize } = settingsDataSlice.actions;
export default settingsDataSlice.reducer;