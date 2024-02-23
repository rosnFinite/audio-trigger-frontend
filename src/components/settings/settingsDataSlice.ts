import {createSlice} from "@reduxjs/toolkit";
import { initialSettings } from "./initialSettings";

export const settingsDataSlice = createSlice({
  name: "settings",
  initialState: {
    value:  initialSettings
  },
  reducers: {
    initialize: (state) => {
      state.value = initialSettings;
    },
    updateSettings: (state, action) => {
      state.value = {...state.value, ...action.payload.settings};
    }
  }
})

export const { initialize } = settingsDataSlice.actions;
export default settingsDataSlice.reducer;