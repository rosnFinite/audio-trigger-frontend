import { createSlice } from "@reduxjs/toolkit";
import { generateVoicemapBinNames } from "../../utils/stateUtils";
import { initialVoiceState } from "../../utils/stateUtils";

export const voicemapDataSlice = createSlice({
  name: "voicemap",
  initialState: {
    values: initialVoiceState,
  },
  reducers: {
    INITIALIZE: (state) => {
      state.values = { ...initialVoiceState };
    },
    SET_DATAMAP: (state, action) => {
      state.values = {
        ...state.values,
        recordings: [],
        field: action.payload,
      };
    },
    UPDATE_DATAPOINT: (state, action) => {
      // may throw an error if no data is present
      let recordings = [...state.values.recordings];
      let updateIndex = recordings.findIndex(
        (item) =>
          item.dbaBin === action.payload.dbaBin &&
          item.freqBin === action.payload.freqBin
      );
      if (updateIndex === -1) {
        recordings.push({
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
        recordings[updateIndex] = {
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
      let field = JSON.parse(JSON.stringify(state.values.field));
      field[action.payload.dbaBin].data[action.payload.freqBin].y = {
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
      state.values = {
        ...state.values,
        field: field,
        recordings: recordings,
      };
    },
    UPDATE_SETTINGS: (state, action) => {
      state.values = {
        ...state.values,
        dbaSettings: action.payload.dbaSettings,
        freqSettings: action.payload.freqSettings,
        fieldBinNames: generateVoicemapBinNames(
          action.payload.dbaSettings,
          action.payload.freqSettings
        ),
      };
    },
    REMOVE_RECORDING: (state, action) => {
      // action.payload = {freqBin: freqBin, dbaBin:dbaBin} to identify data point to remove
      // remove the recording from the data array
      const newData = { ...state.values };
      newData.recordings = newData.recordings.filter(
        (item) =>
          item.dbaBin !== action.payload.dbaBin ||
          item.freqBin !== action.payload.freqBin
      );
      newData.field[action.payload.dbaBin].data[action.payload.freqBin].y = {
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
      state.values = newData;
    },
    ACCEPT_RECORDING: (state, action) => {
      // action.payload = {freqBin: freqBin, dbaBin:dbaBin} to identify data point to accept
      const newData = {
        ...state.values,
        recordings: state.values.recordings.map((item) => {
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
      state.values = newData;
    },
    SET_ANNOTATION: (state, action) => {
      state.values = {
        ...state.values,
        annotation: action.payload,
      };
    },
    SET_COLOR: (state, action) => {
      const newColorObj = {
        min: action.payload.color.min, 
        max: action.payload.color.max, 
        type: action.payload.color.type, 
        scheme: action.payload.color.scheme, 
        divergeAt: action.payload.color.divergeAt === undefined ? 0.5 : action.payload.color.divergeAt
      };
      state.values = { ...state.values, color: { ...state.values.color, [action.payload.stat]: newColorObj }};
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
