import { createSlice } from "@reduxjs/toolkit";

// TODO: Add the correct type for the voicemap data
interface IVoicemapData {
  dbaSettings: {
    lower: number;
    upper: number;
    steps: number;
  };
  freqSettings: {
    lower: number;
    upper: number;
    steps: number;
  };
  voice: string;
  data: {
    freqBin: number;
    dbaBin: number;
    qScore: string;
    timestamp: string;
    accepted: boolean;
  }[];
  datamap: {
    id: string;
    data: {
      x: number;
      y: number;
    }[];
  }[];
}

export const voicemapDataSlice = createSlice({
  name: "voicemap",
  initialState: {
    value: {
      dbaSettings: { lower: 35, upper: 115, steps: 5 },
      freqSettings: { lower: 55, upper: 1700, steps: 2 },
      voice: "0.0",
      data: [],
      datamap: [],
    } as IVoicemapData,
  },
  reducers: {
    INITIALIZE: (state) => {
      state.value = {
        dbaSettings: { lower: 35, upper: 115, steps: 5 },
        freqSettings: { lower: 55, upper: 1700, steps: 2 },
        voice: "0.0",
        data: [],
        datamap: [],
      };
    },
    SET_DATAMAP: (state, action) => {
      state.value.data = [];
      state.value.datamap = action.payload;
    },
    UPDATE_DATAPOINT: (state, action) => {
      // may throw an error if no data is present
      let data = state.value.data;
      let updateIndex = data.findIndex(
        (item) =>
          item.dbaBin === action.payload.dbaBin &&
          item.freqBin === action.payload.freqBin
      );
      if (updateIndex === -1) {
        data.push({
          freqBin: action.payload.freqBin,
          dbaBin: action.payload.dbaBin,
          qScore: action.payload.score,
          timestamp: new Date().toLocaleString(),
          accepted: false,
        });
        state.value.data = data;
      } else {
        data[updateIndex] = {
          freqBin: action.payload.freqBin,
          dbaBin: action.payload.dbaBin,
          qScore: action.payload.score,
          timestamp: new Date().toLocaleString(),
          accepted: false,
        };
        state.value.data = data;
      }
      // Deep copy of the datamap to avoid mutation of the state
      let newDataMap = JSON.parse(JSON.stringify(state.value.datamap));
      newDataMap[action.payload.dbaBin].data[action.payload.freqBin].y =
        action.payload.score;
      state.value.datamap = newDataMap;
    },
    UPDATE_SETTINGS: (state, action) => {
      state.value.dbaSettings = action.payload.dbaSettings;
      state.value.freqSettings = action.payload.freqSettings;
    },
    REMOVE_RECORDING: (state, action) => {
      // action.payload = {freqBin: freqBin, dbaBin:dbaBin} to identify data point to remove
      // remove the recording from the data array
      let data = state.value.data;
      let removeIndex = data.findIndex(
        (item) =>
          item.dbaBin === action.payload.dbaBin &&
          item.freqBin === action.payload.freqBin
      );
      data.splice(removeIndex, 1);
      state.value.data = data;
      // remove the recording from the datamap
      let newDataMap = JSON.parse(JSON.stringify(state.value.datamap));
      newDataMap[action.payload.dbaBin].data[action.payload.freqBin].y = 0;
      state.value.datamap = newDataMap;
    },
    ACCEPT_RECORDING: (state, action) => {
      // action.payload = {freqBin: freqBin, dbaBin:dbaBin} to identify data point to accept
      let data = state.value.data;
      let acceptIndex = data.findIndex(
        (item) =>
          item.dbaBin === action.payload.dbaBin &&
          item.freqBin === action.payload.freqBin
      );
      data[acceptIndex].accepted = true;
      state.value.data = data;
    },
    SET_VOICE: (state, action) => {
      state.value.voice = action.payload;
    },
  },
});

export const { SET_DATAMAP, UPDATE_DATAPOINT, UPDATE_SETTINGS, SET_VOICE } =
  voicemapDataSlice.actions;
export default voicemapDataSlice.reducer;
