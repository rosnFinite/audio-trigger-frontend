import {createSlice} from "@reduxjs/toolkit";
import { initialSettings } from "./initialSettings";

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