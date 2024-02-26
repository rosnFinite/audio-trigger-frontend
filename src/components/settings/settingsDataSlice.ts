import {createSlice} from "@reduxjs/toolkit";
import { initialSettings } from "./initialSettings";

export const settingsDataSlice = createSlice({
  name: "settings",
  initialState: {
    values:  initialSettings
  },
  reducers: {
    initialize: (state) => {
      state.values = initialSettings;
    },
    updateSettings: (state, action) => {
      state.values = {...state.values, ...action.payload};
    },
    updateStatus: (state, action) => {
      console.log("updateStatus", action.payload);
      state.values.status = {...state.values.status, ...action.payload};
    }
  }
})

export const { initialize } = settingsDataSlice.actions;
export default settingsDataSlice.reducer;