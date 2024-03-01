import {createSlice} from "@reduxjs/toolkit";

// TODO: Add the correct type for the voicemap data
interface IVoicemapData {
  dbaSettings: {
    lower: number;
    upper: number;
    steps: number;
  },
  freqSettings: {
    lower: number;
    upper: number;
    steps: number;
  },
  voice: string,
  datamap: {
    id: string;
    data: {
      x: string;
      y: number;
    }[];
  }[];
}

export const voicemapDataSlice = createSlice({
  name: "voicemap",
  initialState: {
    value: {dbaSettings:{lower:35, upper:115, steps:5}, freqSettings:{lower:55, upper:1700, steps:2}, voice:"0.0", datamap: []} as IVoicemapData
  },
  reducers: {
    SET_DATAMAP: (state, action) => {
      console.log("SET_DATAMAP", action.payload);
      state.value.datamap = action.payload;
    },
    UPDATE_DATAPOINT: (state, action) => {
      console.log("UPDATE_DATAPOINT", action.payload);
      // Deep copy of the datamap to avoid mutation of the state
      let newDataMap = JSON.parse(JSON.stringify(state.value.datamap));
      newDataMap[action.payload.dbaBin].data[action.payload.freqBin].y = action.payload.score;
      state.value.datamap = newDataMap;
    },
    UPDATE_SETTINGS: (state, action) => {
      console.log("UPDATE_SETTINGS", action.payload);
      state.value.dbaSettings = action.payload.dbaSettings;
      state.value.freqSettings = action.payload.freqSettings;
    },
    SET_VOICE: (state, action) => {
      console.log("SET_VOICE", action.payload);
      state.value.voice = action.payload;
    }
  }
})

export const { SET_DATAMAP, UPDATE_DATAPOINT, UPDATE_SETTINGS, SET_VOICE } = voicemapDataSlice.actions;
export default voicemapDataSlice.reducer;