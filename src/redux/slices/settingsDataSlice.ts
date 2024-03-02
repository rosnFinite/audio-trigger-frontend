import {createSlice} from "@reduxjs/toolkit";
import {Settings} from "../../types/Settings.types"
import {initialSettings} from "../../utils/initializer";

export const settingsDataSlice = createSlice({
  name: "settings",
  initialState: {
    values:  initialSettings as Settings
  },
  reducers: {
    INITIALIZE: (state) => {
      state.values = initialSettings;
    },
    UPDATE_SETTINGS: (state, action) => {
      state.values = {...state.values, ...action.payload};
    },
    UPDATE_STATUS: (state, action) => {
      console.log("updateStatus", action.payload);
      state.values.status = {...state.values.status, ...action.payload};
    },
    SET_CLIENT_SID: (state, action) => {
      state.values.sid = action.payload.sid;
    }
  }
})

export const { INITIALIZE, UPDATE_SETTINGS, UPDATE_STATUS, SET_CLIENT_SID } = settingsDataSlice.actions;
export default settingsDataSlice.reducer;