import { createSlice } from "@reduxjs/toolkit";
import { generateVoicemapBinNames } from "../../utils/voicemapUtils";

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
  datamapBinNames: {
    freq: string[];
    dba: string[];
  };
  annotation: {
    id: string;
    text: string;
  };
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
      datamapBinNames: generateVoicemapBinNames(
        { lower: 35, upper: 115, steps: 5 },
        { lower: 55, upper: 1700, steps: 2 }
      ),
      annotation: { id: "", text: "" },
      data: [],
      datamap: [],
    } as IVoicemapData,
  },
  reducers: {
    INITIALIZE: (state) => {
      state.value = {
        ...state.value,
        dbaSettings: { lower: 35, upper: 115, steps: 5 },
        freqSettings: { lower: 55, upper: 1700, steps: 2 },
        datamapBinNames: generateVoicemapBinNames(
          { lower: 35, upper: 115, steps: 5 },
          { lower: 55, upper: 1700, steps: 2 }
        ),
        annotation: { id: "", text: "" },
        data: [],
        datamap: [],
      };
    },
    SET_DATAMAP: (state, action) => {
      state.value = {
        ...state.value,
        data: [],
        datamap: action.payload,
      };
    },
    UPDATE_DATAPOINT: (state, action) => {
      // may throw an error if no data is present
      let data = [...state.value.data];
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
      } else {
        data[updateIndex] = {
          freqBin: action.payload.freqBin,
          dbaBin: action.payload.dbaBin,
          qScore: action.payload.score,
          timestamp: new Date().toLocaleString(),
          accepted: false,
        };
      }
      // Deep copy of the datamap to avoid mutation of the state
      let newDataMap = JSON.parse(JSON.stringify(state.value.datamap));
      newDataMap[action.payload.dbaBin].data[action.payload.freqBin].y =
        action.payload.score;
      state.value = {
        ...state.value,
        datamap: newDataMap,
        data: data,
      };
    },
    UPDATE_SETTINGS: (state, action) => {
      state.value = {
        ...state.value,
        dbaSettings: action.payload.dbaSettings,
        freqSettings: action.payload.freqSettings,
        datamapBinNames: generateVoicemapBinNames(
          action.payload.dbaSettings,
          action.payload.freqSettings
        ),
      };
    },
    REMOVE_RECORDING: (state, action) => {
      // action.payload = {freqBin: freqBin, dbaBin:dbaBin} to identify data point to remove
      // remove the recording from the data array
      console.log("Removing recording", action.payload);
      const newData = { ...state.value };
      newData.data = newData.data.filter(
        (item) =>
          item.dbaBin !== action.payload.dbaBin ||
          item.freqBin !== action.payload.freqBin
      );
      newData.datamap[action.payload.dbaBin].data[action.payload.freqBin].y = 0;
      state.value = newData;
    },
    ACCEPT_RECORDING: (state, action) => {
      // action.payload = {freqBin: freqBin, dbaBin:dbaBin} to identify data point to accept
      const newData = {
        ...state.value,
        data: state.value.data.map((item) => {
          if (
            item.dbaBin === action.payload.dbaBin &&
            item.freqBin === action.payload.freqBin
          ) {
            return {
              ...item,
              accepted: true,
            };
          }
          return item;
        }),
      };
      state.value = newData;
    },
    SET_ANNOTATION: (state, action) => {
      state.value = {
        ...state.value,
        annotation: action.payload,
      };
      console.log();
    },
  },
});

export const {
  SET_DATAMAP,
  UPDATE_DATAPOINT,
  UPDATE_SETTINGS,
  SET_ANNOTATION,
} = voicemapDataSlice.actions;
export default voicemapDataSlice.reducer;
