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
    meanF: number;
    stdevF: number;
    hnr: number;
    localJitter: number;
    localAbsoluteJitter: number;
    rapJitter: number;
    ppq5Jitter: number;
    ddpJitter: number;
    localShimmer: number;
    localdbShimmer: number;
    apq3Shimmer: number;
    aqpq5Shimmer: number;
    apq11Shimmer: number;
    ddaShimmer: number;
  }[];
  datamap: {
    id: string;
    data: {
      x: number;
      y: {
        score: number;
        meanF: number;
        stdevF: number;
        hnr: number;
        localJitter: number;
        localAbsoluteJitter: number;
        rapJitter: number;
        ppq5Jitter: number;
        ddpJitter: number;
        localShimmer: number;
        localdbShimmer: number;
        apq3Shimmer: number;
        aqpq5Shimmer: number;
        apq11Shimmer: number;
        ddaShimmer: number;
      };
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
          meanF: action.payload.stats.meanF,
          stdevF: action.payload.stats.stdevF,
          hnr: action.payload.stats.hnr,
          localJitter: action.payload.stats.localJitter,
          localAbsoluteJitter: action.payload.stats.localAbsoluteJitter,
          rapJitter: action.payload.stats.rapJitter,
          ppq5Jitter: action.payload.stats.ppq5Jitter,
          ddpJitter: action.payload.stats.ddpJitter,
          localShimmer: action.payload.stats.localShimmer,
          localdbShimmer: action.payload.stats.localdbShimmer,
          apq3Shimmer: action.payload.stats.apq3Shimmer,
          aqpq5Shimmer: action.payload.stats.aqpq5Shimmer,
          apq11Shimmer: action.payload.stats.apq11Shimmer,
          ddaShimmer: action.payload.stats.ddaShimmer,
        });
      } else {
        data[updateIndex] = {
          freqBin: action.payload.freqBin,
          dbaBin: action.payload.dbaBin,
          qScore: action.payload.score,
          timestamp: new Date().toLocaleString(),
          accepted: false,
          meanF: action.payload.stats.meanF,
          stdevF: action.payload.stats.stdevF,
          hnr: action.payload.stats.hnr,
          localJitter: action.payload.stats.localJitter,
          localAbsoluteJitter: action.payload.stats.localAbsoluteJitter,
          rapJitter: action.payload.stats.rapJitter,
          ppq5Jitter: action.payload.stats.ppq5Jitter,
          ddpJitter: action.payload.stats.ddpJitter,
          localShimmer: action.payload.stats.localShimmer,
          localdbShimmer: action.payload.stats.localdbShimmer,
          apq3Shimmer: action.payload.stats.apq3Shimmer,
          aqpq5Shimmer: action.payload.stats.aqpq5Shimmer,
          apq11Shimmer: action.payload.stats.apq11Shimmer,
          ddaShimmer: action.payload.stats.ddaShimmer,
        };
      }
      // Deep copy of the datamap to avoid mutation of the state
      let newDataMap = JSON.parse(JSON.stringify(state.value.datamap));
      newDataMap[action.payload.dbaBin].data[action.payload.freqBin].y = {
        score: action.payload.score,
        meanF: action.payload.stats.meanF,
        stdevF: action.payload.stats.stdevF,
        hnr: action.payload.stats.hnr,
        localJitter: action.payload.stats.localJitter,
        localAbsoluteJitter: action.payload.stats.localAbsoluteJitter,
        rapJitter: action.payload.stats.rapJitter,
        ppq5Jitter: action.payload.stats.ppq5Jitter,
        ddpJitter: action.payload.stats.ddpJitter,
        localShimmer: action.payload.stats.localShimmer,
        localdbShimmer: action.payload.stats.localdbShimmer,
        apq3Shimmer: action.payload.stats.apq3Shimmer,
        aqpq5Shimmer: action.payload.stats.aqpq5Shimmer,
        apq11Shimmer: action.payload.stats.apq11Shimmer,
        ddaShimmer: action.payload.stats.ddaShimmer,
      };
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
      newData.datamap[action.payload.dbaBin].data[action.payload.freqBin].y = {
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
      };
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
