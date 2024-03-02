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
      state.values = {...initialSettings};
    },
    UPDATE_SETTINGS: (state, action) => {
      action.payload.sid = state.values.sid;
      state.values = {...state.values, ...action.payload};
    },
    UPDATE_STATUS: (state, action) => {
      state.values.status = {...state.values.status, ...action.payload};
    },
    SET_CLIENT_SID: (state, action) => {
      state.values = {...initialSettings}; 
      console.log("SET_CLIENT_SID", action.payload);
      state.values.sid = action.payload.sid;
    }
  }
})

export const { INITIALIZE, UPDATE_SETTINGS, UPDATE_STATUS, SET_CLIENT_SID } = settingsDataSlice.actions;
export default settingsDataSlice.reducer;